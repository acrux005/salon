-- Randka Odart 2026 features — run: sqlite3 /path/to/dev.db < prisma/migrateRandki2026.sql

ALTER TABLE DatingProfile ADD COLUMN onboardingJson TEXT NOT NULL DEFAULT '{}';
ALTER TABLE DatingProfile ADD COLUMN onboardingDone INTEGER NOT NULL DEFAULT 0;
ALTER TABLE DatingProfile ADD COLUMN intention TEXT NOT NULL DEFAULT 'relationship';
ALTER TABLE DatingProfile ADD COLUMN mood TEXT;
ALTER TABLE DatingProfile ADD COLUMN moodUpdatedAt DATETIME;
ALTER TABLE DatingProfile ADD COLUMN communicationStyle TEXT;
ALTER TABLE DatingProfile ADD COLUMN avgResponseHours REAL;
ALTER TABLE DatingProfile ADD COLUMN responseRate REAL;
ALTER TABLE DatingProfile ADD COLUMN ghostScore INTEGER NOT NULL DEFAULT 100;
ALTER TABLE DatingProfile ADD COLUMN profileQualityScore INTEGER NOT NULL DEFAULT 100;

ALTER TABLE DatingMatch ADD COLUMN icebreakersJson TEXT NOT NULL DEFAULT '[]';
ALTER TABLE DatingMatch ADD COLUMN compatibilityNote TEXT;

CREATE TABLE IF NOT EXISTS DatingDiscoveryImpression (
  id TEXT NOT NULL PRIMARY KEY,
  viewerAccountId TEXT NOT NULL,
  targetAccountId TEXT NOT NULL,
  whyReason TEXT,
  compatibilityScore INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT DatingDiscoveryImpression_viewerAccountId_fkey FOREIGN KEY (viewerAccountId) REFERENCES DatingAccount (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT DatingDiscoveryImpression_targetAccountId_fkey FOREIGN KEY (targetAccountId) REFERENCES DatingAccount (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS DatingDiscoveryImpression_viewerAccountId_createdAt_idx ON DatingDiscoveryImpression(viewerAccountId, createdAt);
CREATE INDEX IF NOT EXISTS DatingDiscoveryImpression_targetAccountId_idx ON DatingDiscoveryImpression(targetAccountId);
