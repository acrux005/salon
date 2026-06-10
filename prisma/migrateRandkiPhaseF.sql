-- Phase F: face verification on daily moment
ALTER TABLE DatingDailyMoment ADD COLUMN faceVerified INTEGER NOT NULL DEFAULT 0;
ALTER TABLE DatingDailyMoment ADD COLUMN faceScore REAL;
