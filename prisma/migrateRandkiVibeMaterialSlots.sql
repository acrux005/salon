-- Typowane sloty: anthem / playlist / mood_today (+ define dla istniejących)
ALTER TABLE DatingVibeMaterial ADD COLUMN slotType TEXT NOT NULL DEFAULT 'define';

UPDATE DatingVibeMaterial SET slotType = 'anthem' WHERE sortOrder = 0 AND slotType = 'define';
UPDATE DatingVibeMaterial SET slotType = 'playlist' WHERE sortOrder = 1 AND slotType = 'define';
UPDATE DatingVibeMaterial SET slotType = 'mood_today' WHERE sortOrder = 2 AND slotType = 'define';

CREATE UNIQUE INDEX IF NOT EXISTS DatingVibeMaterial_accountId_slotType_uidx
  ON DatingVibeMaterial(accountId, slotType)
  WHERE slotType IN ('anthem', 'playlist', 'mood_today');
