-- Pory dnia w pokoju użytkownika (JSON per faza)
ALTER TABLE DatingProfile ADD COLUMN roomPhasesJson TEXT NOT NULL DEFAULT '{}';
