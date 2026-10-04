/**
 * Sanskrit Phonetics Audio Synthesis & Playback Engine
 * Dual-Engine architecture:
 * 1. Web Speech API (Native Indic TTS with Sanskrit/Hindi pitch and rate optimization)
 * 2. Web Audio API Acoustic Formant Synthesizer (Instantaneous zero-latency resonant formants)
 */

import { VarnaLetter, ALL_VARNAMALA_LETTERS } from '../data/varnamala';

let audioCtx: AudioContext | null = null;
let currentSequenceTimeout: number | null = null;
let isSequenceRunning = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export interface PlaybackOptions {
  speed?: number; // 0.5, 0.75, 1.0
  volume?: number;
  engine?: 'auto' | 'speech' | 'acoustic';
}

/**
 * Acoustic Formant Synthesis using Web Audio API
 * Generates human vocal tract resonance using parallel bandpass formant filters (F1, F2, F3).
 */
export function playAcousticFormant(varna: VarnaLetter, options?: PlaybackOptions): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const speed = options?.speed || 1.0;
  const now = ctx.currentTime;
  const p = varna.audioParams;
  const duration = (p.duration / speed);

  // Master Gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  masterGain.connect(ctx.destination);

  // Fundamental glottal pulse oscillator (sawtooth for rich harmonic spectrum)
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(p.baseFreq, now);
  // Slight natural pitch inflection
  osc.frequency.exponentialRampToValueAtTime(p.baseFreq * 0.96, now + duration);

  // Formant Filter 1 (Tongue height)
  const f1Filter = ctx.createBiquadFilter();
  f1Filter.type = 'bandpass';
  f1Filter.frequency.setValueAtTime(p.formantF1, now);
  f1Filter.Q.setValueAtTime(6.0, now);

  // Formant Filter 2 (Tongue advancement / front-back)
  const f2Filter = ctx.createBiquadFilter();
  f2Filter.type = 'bandpass';
  f2Filter.frequency.setValueAtTime(p.formantF2, now);
  f2Filter.Q.setValueAtTime(7.0, now);

  // Formant Filter 3 (Lip rounding / retroflexion)
  const f3Filter = ctx.createBiquadFilter();
  f3Filter.type = 'bandpass';
  f3Filter.frequency.setValueAtTime(p.formantF3, now);
  f3Filter.Q.setValueAtTime(8.0, now);

  // Connect oscillator through formant bank in parallel
  osc.connect(f1Filter);
  osc.connect(f2Filter);
  osc.connect(f3Filter);

  f1Filter.connect(masterGain);
  f2Filter.connect(masterGain);
  f3Filter.connect(masterGain);

  // If aspirated or fricative, add a shaped burst of white noise
  if (p.isAspirated || p.type === 'fricative' || p.type === 'aspirate') {
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = p.type === 'fricative' ? 'highpass' : 'bandpass';
    noiseFilter.frequency.setValueAtTime(p.type === 'fricative' ? 3200 : 1500, now);
    noiseFilter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }

  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Web Speech API Voice Synthesis for Sanskrit / Devanagari text
 */
export function playSpeechSynthesis(text: string, options?: PlaybackOptions): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const speed = options?.speed || 1.0;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose the best available Indic voice
    const voices = window.speechSynthesis.getVoices();
    const sanskritVoice = voices.find(v => 
      v.lang.startsWith('sa') || 
      v.lang.startsWith('hi') || 
      v.lang.startsWith('mr') ||
      v.name.toLowerCase().includes('hindi') || 
      v.name.toLowerCase().includes('india')
    );

    if (sanskritVoice) {
      utterance.voice = sanskritVoice;
    }

    utterance.lang = 'hi-IN';
    utterance.rate = Math.max(0.4, Math.min(1.2, 0.85 * speed));
    utterance.pitch = 1.0;

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = () => {
      resolve();
    };

    window.speechSynthesis.speak(utterance);

    // Timeout safety fallback
    setTimeout(() => {
      resolve();
    }, 2500);
  });
}

/**
 * Universal Play Varna function:
 * Plays both high-fidelity speech synthesis and adds acoustic harmonic reinforcement
 */
export async function playVarna(varna: VarnaLetter, options?: PlaybackOptions): Promise<void> {
  const engine = options?.engine || 'auto';

  // Acoustic harmonic trigger for crisp acoustic punch
  if (engine === 'acoustic' || engine === 'auto') {
    try {
      playAcousticFormant(varna, options);
    } catch {
      // ignore web audio context errors
    }
  }

  if (engine === 'speech' || engine === 'auto') {
    const textToSpeak = varna.exemplar?.audioText || varna.devanagari;
    await playSpeechSynthesis(textToSpeak, options);
  }
}

/**
 * Play any custom Sanskrit word / text with speech synthesis
 */
export async function playSanskritWord(word: string, options?: PlaybackOptions): Promise<void> {
  await playSpeechSynthesis(word, options);
}

/**
 * Plays an entire sequence of letters sequentially with visual progress callback (Guided Tour)
 */
export function playVarnaSequence(
  letters: VarnaLetter[],
  onStep: (index: number, varna: VarnaLetter) => void,
  onComplete: () => void,
  options?: PlaybackOptions
): () => void {
  stopAllAudio();
  isSequenceRunning = true;

  const speed = options?.speed || 1.0;
  const stepDelay = Math.round(1400 / speed);

  let currentIndex = 0;

  function runNext() {
    if (!isSequenceRunning || currentIndex >= letters.length) {
      isSequenceRunning = false;
      onComplete();
      return;
    }

    const currentLetter = letters[currentIndex];
    onStep(currentIndex, currentLetter);
    playVarna(currentLetter, options);

    currentIndex++;
    currentSequenceTimeout = window.setTimeout(runNext, stepDelay);
  }

  runNext();

  // Return cancel function
  return () => {
    stopAllAudio();
  };
}

/**
 * Stops all ongoing audio and cancel sequences
 */
export function stopAllAudio(): void {
  isSequenceRunning = false;
  if (currentSequenceTimeout) {
    clearTimeout(currentSequenceTimeout);
    currentSequenceTimeout = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
