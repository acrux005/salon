-- Fix capturedAt (SQLite cannot ADD with non-constant default)
ALTER TABLE DatingDailyMoment ADD COLUMN capturedAt TEXT;
UPDATE DatingDailyMoment SET capturedAt = createdAt WHERE capturedAt IS NULL;
