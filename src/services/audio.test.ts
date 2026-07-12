import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEpicAudioController, MUTE_STORAGE_KEY, type AudioLike } from "./audio";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

class FakeAudio implements AudioLike {
  src = "";
  loop = false;
  muted = false;
  volume = 1;
  currentTime = 0;
  play = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  pause = vi.fn();
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => { resolve = next; });
  return { promise, resolve };
}

describe("epic score controller", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts only on command, loops, and fades to the default volume", async () => {
    const audio = new FakeAudio();
    const factory = vi.fn(() => audio);
    const controller = createEpicAudioController({ createAudio: factory, storage: new MemoryStorage() });

    expect(factory).not.toHaveBeenCalled();
    await expect(controller.start()).resolves.toBe(true);
    expect(audio).toMatchObject({ src: "/audio/epic-history-loop.mp3", loop: true });
    expect(audio.play).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(2_000);
    expect(audio.volume).toBeCloseTo(0.32, 2);
  });

  it("raises intensity by chapter and lowers it for the result", async () => {
    const audio = new FakeAudio();
    const controller = createEpicAudioController({ createAudio: () => audio, storage: new MemoryStorage() });
    await controller.start();
    vi.advanceTimersByTime(2_000);

    controller.setChapter(5);
    vi.advanceTimersByTime(2_000);
    expect(audio.volume).toBeCloseTo(0.4, 2);

    controller.setChapter("result");
    vi.advanceTimersByTime(2_000);
    expect(audio.volume).toBeCloseTo(0.24, 2);
  });

  it("restores and persists mute without requiring audio to exist", async () => {
    const storage = new MemoryStorage();
    storage.setItem(MUTE_STORAGE_KEY, "true");
    const audio = new FakeAudio();
    const controller = createEpicAudioController({ createAudio: () => audio, storage });

    expect(controller.isMuted()).toBe(true);
    expect(controller.toggleMuted()).toBe(false);
    expect(storage.getItem(MUTE_STORAGE_KEY)).toBe("false");
    await controller.start();
    expect(audio.muted).toBe(false);
  });

  it("treats play and storage failures as a silent fallback", async () => {
    const audio = new FakeAudio();
    audio.play.mockRejectedValue(new Error("autoplay blocked"));
    const blockedStorage = {
      getItem() { throw new Error("blocked"); },
      setItem() { throw new Error("blocked"); },
    };
    const controller = createEpicAudioController({ createAudio: () => audio, storage: blockedStorage });

    await expect(controller.start()).resolves.toBe(false);
    expect(() => controller.toggleMuted()).not.toThrow();
    expect(() => controller.stop()).not.toThrow();
  });

  it("does not revive a pending start after stop", async () => {
    const pendingPlay = deferred<void>();
    const audio = new FakeAudio();
    audio.play.mockReturnValue(pendingPlay.promise);
    const controller = createEpicAudioController({ createAudio: () => audio, storage: new MemoryStorage() });

    const starting = controller.start();
    controller.stop();
    pendingPlay.resolve();

    await expect(starting).resolves.toBe(false);
    vi.advanceTimersByTime(2_000);
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.volume).toBe(0);
  });

  it("does not leak a pending start after dispose", async () => {
    const pendingPlay = deferred<void>();
    const audio = new FakeAudio();
    audio.play.mockReturnValue(pendingPlay.promise);
    const controller = createEpicAudioController({ createAudio: () => audio, storage: new MemoryStorage() });

    const starting = controller.start();
    controller.dispose();
    pendingPlay.resolve();

    await expect(starting).resolves.toBe(false);
    expect(audio.pause).toHaveBeenCalled();
    expect(audio.currentTime).toBe(0);
  });
});
