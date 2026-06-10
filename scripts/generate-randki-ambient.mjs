#!/usr/bin/env node
/**
 * Generuje pętle ambient WAV per pora dnia — warstwy szumu, tonów i tekstur.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/randki/ambient");
const SAMPLE_RATE = 44100;
const DURATION_SEC = 48;

function brownNoise(state = { last: 0 }) {
  const white = Math.random() * 2 - 1;
  state.last = (state.last + 0.02 * white) / 1.02;
  return state.last * 3.5;
}

function pinkNoise(state = { b0: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 }) {
  const white = Math.random() * 2 - 1;
  state.b0 = 0.99886 * state.b0 + white * 0.0555179;
  state.b1 = 0.99332 * state.b1 + white * 0.0750759;
  state.b2 = 0.969 * state.b2 + white * 0.153852;
  state.b3 = 0.8665 * state.b3 + white * 0.3104856;
  state.b4 = 0.55 * state.b4 + white * 0.5329522;
  state.b5 = -0.7616 * state.b5 - white * 0.016898;
  const out = state.b0 + state.b1 + state.b2 + state.b3 + state.b4 + state.b5 + state.b6 + white * 0.5362;
  state.b6 = white * 0.115926;
  return out * 0.11;
}

function sine(freq, t, amp = 1) {
  return Math.sin(2 * Math.PI * freq * t) * amp;
}

function envLoop(t, duration, attack = 2, release = 3) {
  const fadeIn = Math.min(1, t / attack);
  const fadeOut = Math.min(1, (duration - t) / release);
  return fadeIn * fadeOut;
}

function crackle(rng = () => Math.random()) {
  return rng() < 0.0008 ? (rng() - 0.5) * 0.4 : 0;
}

function generatePhase(phase) {
  const n = SAMPLE_RATE * DURATION_SEC;
  const left = new Float32Array(n);
  const right = new Float32Array(n);
  const brownL = { last: 0 };
  const brownR = { last: 0.01 };
  const pinkL = {};
  const pinkR = {};

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const e = envLoop(t, DURATION_SEC);
    let l = 0;
    let r = 0;

    switch (phase) {
      case "morning": {
        l += brownNoise(brownL) * 0.06;
        r += brownNoise(brownR) * 0.06;
        l += pinkNoise(pinkL) * 0.04;
        r += pinkNoise(pinkR) * 0.04;
        l += sine(110, t, 0.012) * e;
        r += sine(112, t, 0.011) * e;
        l += sine(220, t, 0.004) * Math.sin(t * 0.3) * e;
        if (Math.random() < 0.00005) l += 0.08;
        break;
      }
      case "day": {
        l += pinkNoise(pinkL) * 0.05;
        r += pinkNoise(pinkR) * 0.05;
        l += sine(174.6, t, 0.008) * e;
        r += sine(176, t, 0.007) * e;
        l += sine(349, t, 0.003) * Math.sin(t * 0.15) * e;
        l += brownNoise(brownL) * 0.025;
        r += brownNoise(brownR) * 0.025;
        break;
      }
      case "sunset": {
        l += pinkNoise(pinkL) * 0.045;
        r += pinkNoise(pinkR) * 0.045;
        l += sine(98, t, 0.015) * e;
        r += sine(100, t, 0.014) * e;
        l += sine(196, t, 0.006) * Math.sin(t * 0.08) * e;
        l += Math.sin(t * 0.7) * brownNoise(brownL) * 0.03;
        r += Math.sin(t * 0.65) * brownNoise(brownR) * 0.03;
        break;
      }
      case "evening": {
        l += brownNoise(brownL) * 0.035;
        r += brownNoise(brownR) * 0.035;
        l += sine(82.4, t, 0.018) * e;
        r += sine(84, t, 0.017) * e;
        l += sine(164.8, t, 0.007) * Math.sin(t * 0.12) * e;
        l += sine(246, t, 0.004) * e;
        l += crackle() * 0.5;
        r += crackle() * 0.5;
        break;
      }
      case "night":
      default: {
        l += brownNoise(brownL) * 0.055;
        r += brownNoise(brownR) * 0.055;
        l += sine(55, t, 0.02) * e;
        r += sine(56.5, t, 0.019) * e;
        l += sine(110, t, 0.005) * Math.sin(t * 0.05) * e;
        l += pinkNoise(pinkL) * 0.025;
        r += pinkNoise(pinkR) * 0.025;
        if (Math.random() < 0.00003) {
          const thump = Math.exp(-((i % 800) / 80)) * 0.06;
          l += thump;
          r += thump * 0.9;
        }
        l += crackle() * 0.35;
        r += crackle() * 0.35;
        break;
      }
    }

    left[i] = Math.tanh(l * 1.4) * 0.85;
    right[i] = Math.tanh(r * 1.4) * 0.85;
  }

  return { left, right };
}

function writeWav(filePath, left, right) {
  const numSamples = left.length;
  const numChannels = 2;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const l = Math.max(-1, Math.min(1, left[i]));
    const r = Math.max(-1, Math.min(1, right[i]));
    buffer.writeInt16LE((l * 0x7fff) | 0, offset);
    buffer.writeInt16LE((r * 0x7fff) | 0, offset + 2);
    offset += 4;
  }

  fs.writeFileSync(filePath, buffer);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const phase of ["morning", "day", "sunset", "evening", "night"]) {
  const { left, right } = generatePhase(phase);
  const out = path.join(OUT_DIR, `${phase}.wav`);
  writeWav(out, left, right);
  console.log(`Wrote ${out} (${DURATION_SEC}s)`);
}
