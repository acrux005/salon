import { getPrisma } from "@/lib/db";
import { deleteDatingPhotoFile } from "@/lib/randki/fileCleanup";

const MAX_PHOTOS = 6;

export { MAX_PHOTOS };

export async function listProfilePhotos(accountId: string, includeHidden = false) {
  return getPrisma().datingPhoto.findMany({
    where: {
      accountId,
      ...(includeHidden ? {} : { hidden: false, approved: true }),
    },
    orderBy: { order: "asc" },
    select: { id: true, url: true, order: true, approved: true, hidden: true },
  });
}

export async function countVisiblePhotos(accountId: string): Promise<number> {
  return getPrisma().datingPhoto.count({
    where: { accountId, hidden: false, approved: true },
  });
}

export async function syncPrimaryPhotoUrl(accountId: string) {
  const photos = await listProfilePhotos(accountId);
  const primary = photos[0]?.url ?? null;
  await getPrisma().datingProfile.update({
    where: { accountId },
    data: { photoUrl: primary },
  });
  return primary;
}

export async function getPhotoUrlsForAccount(accountId: string): Promise<string[]> {
  const photos = await listProfilePhotos(accountId);
  if (photos.length > 0) return photos.map((p) => p.url);
  const profile = await getPrisma().datingProfile.findUnique({
    where: { accountId },
    select: { photoUrl: true },
  });
  return profile?.photoUrl ? [profile.photoUrl] : [];
}

export async function deletePhotoById(accountId: string, photoId: string) {
  const photo = await getPrisma().datingPhoto.findFirst({ where: { id: photoId, accountId } });
  if (!photo) return false;
  await deleteDatingPhotoFile(photo.url);
  await getPrisma().datingPhoto.delete({ where: { id: photoId } });
  return true;
}

export async function deleteAllAccountPhotos(accountId: string) {
  const photos = await getPrisma().datingPhoto.findMany({ where: { accountId }, select: { url: true } });
  for (const p of photos) await deleteDatingPhotoFile(p.url);
  await getPrisma().datingPhoto.deleteMany({ where: { accountId } });
}
