-- Phase C: daily moment, circles, premium
ALTER TABLE DatingAccount ADD COLUMN isPremium INTEGER NOT NULL DEFAULT 0;
ALTER TABLE DatingAccount ADD COLUMN premiumUntil TEXT;

ALTER TABLE DatingProfile ADD COLUMN circleSlug TEXT;
CREATE INDEX IF NOT EXISTS DatingProfile_circleSlug_idx ON DatingProfile(circleSlug);

CREATE TABLE IF NOT EXISTS DatingDailyMoment (
  id TEXT NOT NULL PRIMARY KEY,
  accountId TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT DatingDailyMoment_accountId_fkey FOREIGN KEY (accountId) REFERENCES DatingAccount(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS DatingDailyMoment_accountId_createdAt_idx ON DatingDailyMoment(accountId, createdAt);
