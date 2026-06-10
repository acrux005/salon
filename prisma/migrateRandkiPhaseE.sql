-- Phase E: WebRTC signaling + voice callId
ALTER TABLE DatingVoiceMatchQueue ADD COLUMN callId TEXT;

CREATE TABLE IF NOT EXISTS DatingVoiceCallSignal (
  id TEXT NOT NULL PRIMARY KEY,
  callId TEXT NOT NULL UNIQUE,
  accountAId TEXT NOT NULL,
  accountBId TEXT NOT NULL,
  offerSdp TEXT,
  answerSdp TEXT,
  signalsJson TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  expiresAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS DatingVoiceCallSignal_accountAId_idx ON DatingVoiceCallSignal(accountAId);
CREATE INDEX IF NOT EXISTS DatingVoiceCallSignal_accountBId_idx ON DatingVoiceCallSignal(accountBId);
