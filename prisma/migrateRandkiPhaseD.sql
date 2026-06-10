-- Phase D: BeReal moment, voice match, push, Stripe refs
ALTER TABLE DatingAccount ADD COLUMN stripeCustomerId TEXT;
ALTER TABLE DatingAccount ADD COLUMN stripeSubscriptionId TEXT;

ALTER TABLE DatingDailyMoment ADD COLUMN secondaryUrl TEXT;
ALTER TABLE DatingDailyMoment ADD COLUMN capturedAt TEXT;
UPDATE DatingDailyMoment SET capturedAt = createdAt WHERE capturedAt IS NULL;

CREATE TABLE IF NOT EXISTS DatingPushSubscription (
  id TEXT NOT NULL PRIMARY KEY,
  accountId TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  keysJson TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT DatingPushSubscription_accountId_fkey FOREIGN KEY (accountId) REFERENCES DatingAccount(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS DatingPushSubscription_accountId_idx ON DatingPushSubscription(accountId);

CREATE TABLE IF NOT EXISTS DatingVoiceMatchQueue (
  id TEXT NOT NULL PRIMARY KEY,
  accountId TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'waiting',
  pairedAccountId TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  expiresAt TEXT NOT NULL,
  CONSTRAINT DatingVoiceMatchQueue_accountId_fkey FOREIGN KEY (accountId) REFERENCES DatingAccount(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS DatingVoiceMatchQueue_status_createdAt_idx ON DatingVoiceMatchQueue(status, createdAt);
