import { getPrisma } from "@/lib/db";
import { BASE_DAILY_DISCOVERY_LIMIT, PREMIUM_DAILY_DISCOVERY_LIMIT } from "@/lib/randki/premiumPerks";

export { BASE_DAILY_DISCOVERY_LIMIT, PREMIUM_DAILY_DISCOVERY_LIMIT, PREMIUM_PERKS } from "@/lib/randki/premiumPerks";

export async function isPremiumActive(accountId: string): Promise<boolean> {
  const account = await getPrisma().datingAccount.findUnique({
    where: { id: accountId },
    select: { isPremium: true, premiumUntil: true },
  });
  if (!account?.isPremium) return false;
  if (!account.premiumUntil) return true;
  return account.premiumUntil > new Date();
}

export async function getDailyDiscoveryLimit(accountId: string): Promise<number> {
  return (await isPremiumActive(accountId)) ? PREMIUM_DAILY_DISCOVERY_LIMIT : BASE_DAILY_DISCOVERY_LIMIT;
}
