type CardSound = "deal" | "roll" | "commit";

function createTone(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playCardSound(sound: CardSound, muted = false): void {
  if (muted || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.13;
    master.connect(context.destination);
    const now = context.currentTime + 0.005;

    if (sound === "deal") {
      createTone(context, master, 172, now, 0.055, 0.32, "triangle");
      createTone(context, master, 236, now + 0.04, 0.07, 0.23, "sine");
    } else if (sound === "roll") {
      [196, 247, 311].forEach((frequency, index) => {
        createTone(context, master, frequency, now + index * 0.055, 0.09, 0.27, "triangle");
      });
    } else {
      createTone(context, master, 128, now, 0.12, 0.42, "square");
      createTone(context, master, 384, now + 0.035, 0.16, 0.28, "triangle");
    }

    window.setTimeout(() => {
      void context.close();
    }, 600);
  } catch {
    // Sound feedback is optional and must never block a game decision.
  }
}
