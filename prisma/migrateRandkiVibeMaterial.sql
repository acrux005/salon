-- Vibe Material: "Co mnie definiuje" (max 3 sloty na konto)
CREATE TABLE IF NOT EXISTS DatingVibeMaterial (
  id TEXT NOT NULL PRIMARY KEY,
  accountId TEXT NOT NULL,
  url TEXT,
  title TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT 'link',
  embedUrl TEXT,
  thumbnailUrl TEXT,
  caption TEXT NOT NULL DEFAULT '',
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT DatingVibeMaterial_accountId_fkey FOREIGN KEY (accountId) REFERENCES DatingAccount(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS DatingVibeMaterial_accountId_sortOrder_idx ON DatingVibeMaterial(accountId, sortOrder);
