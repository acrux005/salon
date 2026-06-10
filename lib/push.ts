export type PushPayload = {
  title: string;
  body?: string;
  url?: string;
};

/** Stub: zamow.odart.pl nie ma modelu pushSubscription w schemie. */
export async function sendPushToRecipient(
  _recipientType: string,
  _recipientId: string,
  _payload: PushPayload
) {
  return;
}
