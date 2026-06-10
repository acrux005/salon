-- Katalog moodów Spotify/YouTube (cache od cronu)
CREATE TABLE IF NOT EXISTS DatingVibeCatalog (
  id TEXT NOT NULL PRIMARY KEY,
  mood TEXT NOT NULL,
  platform TEXT NOT NULL,
  externalId TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  embedUrl TEXT,
  thumbnailUrl TEXT,
  artistName TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  source TEXT NOT NULL DEFAULT 'auto',
  fetchedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS DatingVibeCatalog_platform_externalId_key
  ON DatingVibeCatalog(platform, externalId);

CREATE INDEX IF NOT EXISTS DatingVibeCatalog_mood_platform_active_idx
  ON DatingVibeCatalog(mood, platform, active);
