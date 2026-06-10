import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { tryConsume } from "@/lib/rateLimit";
import { authorizeCredentials, type LoginIntent } from "@/lib/credentialsAuthorize";
import { getPrisma } from "@/lib/db";
import { RANDKI_ROLE } from "@/lib/auth";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
        loginAs: { label: "Login as", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();
        const loginAs = credentials.loginAs?.trim() as LoginIntent | undefined;
        try {
          const emailKey = "login:" + email;
          if (!tryConsume(emailKey, 10, 15 * 60 * 1000)) return null;
          return authorizeCredentials(email, credentials.password, loginAs || undefined);
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        const nextRole = (user as { role?: string }).role;
        token.role = nextRole ?? "";
        token.restaurantId = (user as { restaurantId?: string }).restaurantId ?? "";
        token.restaurantSlug = (user as { restaurantSlug?: string }).restaurantSlug ?? "";
        token.clinicId = (user as { clinicId?: string }).clinicId ?? "";
        token.clinicSlug = (user as { clinicSlug?: string }).clinicSlug ?? "";
        token.clientId = (user as { clientId?: string }).clientId ?? "";
        token.vetClinicId = (user as { vetClinicId?: string }).vetClinicId ?? "";
        token.vetClinicSlug = (user as { vetClinicSlug?: string }).vetClinicSlug ?? "";
        token.vetOwnerAccountId = (user as { vetOwnerAccountId?: string }).vetOwnerAccountId ?? "";
        token.activeVetClinicId = (user as { activeVetClinicId?: string }).activeVetClinicId ?? "";
        token.gabClinicId = (user as { gabClinicId?: string }).gabClinicId ?? "";
        token.gabClinicSlug = (user as { gabClinicSlug?: string }).gabClinicSlug ?? "";
        token.gabPatientAccountId = (user as { gabPatientAccountId?: string }).gabPatientAccountId ?? "";
        token.activeGabClinicId = (user as { activeGabClinicId?: string }).activeGabClinicId ?? "";
        token.gabMemberId = (user as { gabMemberId?: string }).gabMemberId ?? "";
        token.gabMemberRole = (user as { gabMemberRole?: string }).gabMemberRole ?? "";
        token.datingAccountId = (user as { datingAccountId?: string }).datingAccountId ?? "";
      }
      if (token.role === RANDKI_ROLE && token.datingAccountId) {
        try {
          const account = await getPrisma().datingAccount.findUnique({
            where: { id: token.datingAccountId as string },
            select: { bannedAt: true },
          });
          token.datingBanned = !!account?.bannedAt;
        } catch {
          token.datingBanned = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id;
        (session.user as { role?: string }).role = token.role;
        (session.user as { restaurantId?: string }).restaurantId = token.restaurantId;
        (session.user as { restaurantSlug?: string }).restaurantSlug = token.restaurantSlug;
        (session.user as { clinicId?: string }).clinicId = token.clinicId;
        (session.user as { clinicSlug?: string }).clinicSlug = token.clinicSlug;
        (session.user as { clientId?: string }).clientId = token.clientId;
        (session.user as { vetClinicId?: string }).vetClinicId = token.vetClinicId;
        (session.user as { vetClinicSlug?: string }).vetClinicSlug = token.vetClinicSlug;
        (session.user as { vetOwnerAccountId?: string }).vetOwnerAccountId = token.vetOwnerAccountId;
        (session.user as { activeVetClinicId?: string }).activeVetClinicId = token.activeVetClinicId;
        (session.user as { gabClinicId?: string }).gabClinicId = token.gabClinicId;
        (session.user as { gabClinicSlug?: string }).gabClinicSlug = token.gabClinicSlug;
        (session.user as { gabPatientAccountId?: string }).gabPatientAccountId = token.gabPatientAccountId;
        (session.user as { activeGabClinicId?: string }).activeGabClinicId = token.activeGabClinicId;
        (session.user as { gabMemberId?: string }).gabMemberId = (token.gabMemberId as string) ?? "";
        (session.user as { gabMemberRole?: string }).gabMemberRole = (token.gabMemberRole as string) ?? "";
        (session.user as { datingAccountId?: string }).datingAccountId = (token.datingAccountId as string) ?? "";
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: `${basePath}/login`,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
