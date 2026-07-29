export type CardSound =
  | "deal"
  | "roll"
  | "inspect"
  | "page-turn"
  | "enter-history"
  | "swipe-regular"
  | "swipe-radical"
  | "swipe-surreal";

type SoundDefinition = Readonly<{
  path: string;
  volume: number;
  duckMs: number;
  playbackRate?: number;
}>;

const SOUNDS: Record<CardSound, SoundDefinition> = {
  "page-turn": { path: "/audio/sfx/page-turn.mp3", volume: 0.78, duckMs: 760, playbackRate: 1.04 },
  "enter-history": { path: "/audio/sfx/enter-history.m4a", volume: 0.72, duckMs: 480, playbackRate: 0.94 },
  "swipe-regular": { path: "/audio/sfx/swipe-regular.m4a", volume: 0.78, duckMs: 360, playbackRate: 0.96 },
  "swipe-radical": { path: "/audio/sfx/swipe-radical.m4a", volume: 0.72, duckMs: 420, playbackRate: 0.92 },
  "swipe-surreal": { path: "/audio/sfx/swipe-surreal.m4a", volume: 0.76, duckMs: 480, playbackRate: 1.08 },
  roll: { path: "/audio/sfx/card-shuffle.m4a", volume: 0.62, duckMs: 900, playbackRate: 1.02 },
  deal: { path: "/audio/sfx/card-deal.m4a", volume: 0.82, duckMs: 360 },
  inspect: { path: "/audio/sfx/card-inspect.m4a", volume: 0.88, duckMs: 480, playbackRate: 0.92 },
};

const templates = new Map<CardSound, HTMLAudioElement>();

function audioTemplate(sound: CardSound): HTMLAudioElement | null {
  if (typeof Audio !== "function") return null;
  const existing = templates.get(sound);
  if (existing) return existing;

  try {
    const definition = SOUNDS[sound];
    const audio = new Audio(definition.path);
    audio.preload = "auto";
    audio.volume = definition.volume;
    audio.playbackRate = definition.playbackRate ?? 1;
    templates.set(sound, audio);
    return audio;
  } catch {
    return null;
  }
}

export function preloadCardSounds(): void {
  if (typeof window === "undefined" || import.meta.env.MODE === "test") return;
  (Object.keys(SOUNDS) as CardSound[]).forEach((sound) => {
    const audio = audioTemplate(sound);
    try {
      audio?.load();
    } catch {
      // Preloading is optional; gesture-triggered playback can still load on demand.
    }
  });
}

export function playCardSound(
  sound: CardSound,
  muted = false,
  duckScore?: (durationMs: number) => void,
): void {
  if (muted || typeof window === "undefined" || import.meta.env.MODE === "test") return;
  const template = audioTemplate(sound);
  if (!template) return;

  try {
    const player = template.cloneNode(true) as HTMLAudioElement;
    const definition = SOUNDS[sound];
    duckScore?.(definition.duckMs);
    player.volume = definition.volume;
    player.playbackRate = definition.playbackRate ?? 1;
    player.currentTime = 0;
    const playback = player.play();
    if (playback && typeof playback.catch === "function") {
      void playback.catch(() => {
        // WebView autoplay policy must never block a game decision.
      });
    }
  } catch {
    // Audio feedback is optional and must never block a game decision.
  }
}
