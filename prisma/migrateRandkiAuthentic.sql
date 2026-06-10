-- Authentic chemistry layer
ALTER TABLE DatingProfile ADD COLUMN voiceIntroUrl TEXT;
ALTER TABLE DatingProfile ADD COLUMN activityIntent TEXT;
ALTER TABLE DatingProfile ADD COLUMN revealMode TEXT NOT NULL DEFAULT 'vibe_first';

ALTER TABLE DatingMatch ADD COLUMN chemistryScore INTEGER;
ALTER TABLE DatingMatch ADD COLUMN chemistryLabel TEXT;
ALTER TABLE DatingMatch ADD COLUMN wingmanTipsJson TEXT NOT NULL DEFAULT '[]';
