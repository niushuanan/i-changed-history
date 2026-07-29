import type { DecisionChapter } from "../game/timelinePlan";

export const MUTE_STORAGE_KEY = "i-changed-history:audio-muted:v1";
const SCORE_PATH = "/audio/epic-history-loop.mp3";

export type AudioLike = {
  src: string;
  loop: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  play(): Promise<void> | void;
  pause(): void;
};

type AudioStorage = Pick<Storage, "getItem" | "setItem">;

export type EpicAudioOptions = {
  createAudio?: () => AudioLike;
  storage?: AudioStorage;
  setInterval?: typeof globalThis.setInterval;
  clearInterval?: typeof globalThis.clearInterval;
  setTimeout?: typeof globalThis.setTimeout;
  clearTimeout?: typeof globalThis.clearTimeout;
};

export type EpicAudioController = {
  start(): Promise<boolean>;
  stop(): void;
  setChapter(chapter: DecisionChapter | "result"): void;
  duckFor(durationMs: number): void;
  isMuted(): boolean;
  setMuted(muted: boolean): boolean;
  toggleMuted(): boolean;
  dispose(): void;
};

function browserStorage(): AudioStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function readMuted(storage?: AudioStorage): boolean {
  try {
    return storage?.getItem(MUTE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function createEpicAudioController(options: EpicAudioOptions = {}): EpicAudioController {
  const createAudio = options.createAudio ?? (() => new Audio());
  const storage = options.storage ?? browserStorage();
  const setIntervalFn = options.setInterval ?? globalThis.setInterval;
  const clearIntervalFn = options.clearInterval ?? globalThis.clearInterval;
  const setTimeoutFn = options.setTimeout ?? globalThis.setTimeout;
  const clearTimeoutFn = options.clearTimeout ?? globalThis.clearTimeout;
  let audio: AudioLike | null = null;
  let muted = readMuted(storage);
  let targetVolume = 0.09;
  let duckMultiplier = 1;
  let fadeTimer: ReturnType<typeof globalThis.setInterval> | null = null;
  let duckTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  let playing = false;
  let desiredPlaying = false;
  let playGeneration = 0;

  const clearFade = () => {
    if (fadeTimer === null) return;
    clearIntervalFn(fadeTimer);
    fadeTimer = null;
  };

  const clearDuck = () => {
    if (duckTimer === null) return;
    clearTimeoutFn(duckTimer);
    duckTimer = null;
  };

  const effectiveTargetVolume = () => targetVolume * duckMultiplier;

  const ensureAudio = () => {
    if (audio) return audio;
    audio = createAudio();
    audio.src = SCORE_PATH;
    audio.loop = true;
    audio.volume = 0;
    audio.muted = muted;
    return audio;
  };

  const fadeToTarget = () => {
    if (!audio || !playing) return;
    clearFade();
    fadeTimer = setIntervalFn(() => {
      if (!audio) return;
      const effectiveTarget = effectiveTargetVolume();
      const difference = effectiveTarget - audio.volume;
      if (Math.abs(difference) <= 0.02) {
        audio.volume = effectiveTarget;
        clearFade();
        return;
      }
      audio.volume = Math.min(1, Math.max(0, audio.volume + Math.sign(difference) * 0.02));
    }, 60);
  };

  const setMuted = (nextMuted: boolean) => {
    muted = nextMuted;
    if (audio) audio.muted = muted;
    try {
      storage?.setItem(MUTE_STORAGE_KEY, String(muted));
    } catch {
      // Muting remains available even when browser storage is disabled.
    }
    return muted;
  };

  const stop = () => {
    playGeneration += 1;
    desiredPlaying = false;
    clearFade();
    clearDuck();
    duckMultiplier = 1;
    playing = false;
    if (!audio) return;
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    } catch {
      // Audio failure is never game-blocking.
    }
  };

  return {
    async start() {
      const generation = ++playGeneration;
      desiredPlaying = true;
      const player = ensureAudio();
      player.muted = muted;
      try {
        await player.play();
        if (generation !== playGeneration || !desiredPlaying || audio !== player) {
          if (!desiredPlaying || audio !== player) {
            try {
              player.pause();
              player.currentTime = 0;
              player.volume = 0;
            } catch {
              // A stale player is already detached from the game.
            }
          }
          return false;
        }
        playing = true;
        fadeToTarget();
        return true;
      } catch {
        if (generation === playGeneration) playing = false;
        return false;
      }
    },
    stop,
    setChapter(chapter) {
      targetVolume = chapter === "result" ? 0.07 : 0.08 + chapter * 0.01;
      fadeToTarget();
    },
    duckFor(durationMs) {
      if (!audio || !playing || muted) return;
      clearDuck();
      clearFade();
      duckMultiplier = 0.28;
      audio.volume = Math.min(audio.volume, effectiveTargetVolume());
      duckTimer = setTimeoutFn(() => {
        duckTimer = null;
        duckMultiplier = 1;
        fadeToTarget();
      }, Math.max(120, durationMs));
    },
    isMuted() {
      return muted;
    },
    setMuted,
    toggleMuted() {
      return setMuted(!muted);
    },
    dispose() {
      stop();
      audio = null;
    },
  };
}
