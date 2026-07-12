import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { endingFixture, turnFixture } from "../test/fixtures";
import { parseAlternatePresent, parseTimelineTurn } from "../game/schema";
import { createInitialGameState } from "../game/reducer";
import { useGame, type UseGameDependencies } from "./useGame";

const chapterNames = ["裂缝", "余震", "新秩序", "世界线", "此刻"] as const;

function turnFor(chapter: 1 | 2 | 3 | 4 | 5) {
  return parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    chapter,
    chapterName: chapterNames[chapter - 1],
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
  }));
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function dependencies(overrides: Partial<UseGameDependencies> = {}): UseGameDependencies {
  return {
    generateOpening: vi.fn().mockResolvedValue(turnFor(1)),
    generateNextTurn: vi.fn().mockResolvedValue(turnFor(2)),
    generateEnding: vi.fn().mockResolvedValue(parseAlternatePresent(JSON.stringify(endingFixture))),
    loadSnapshot: vi.fn(() => null),
    saveSnapshot: vi.fn(() => true),
    audio: {
      start: vi.fn().mockResolvedValue(true),
      stop: vi.fn(),
      setChapter: vi.fn(),
      isMuted: vi.fn(() => false),
      setMuted: vi.fn((muted: boolean) => muted),
      toggleMuted: vi.fn(() => true),
      dispose: vi.fn(),
    },
    ...overrides,
  };
}

describe("useGame orchestration", () => {
  it("starts music from the selection gesture and resolves an opening", async () => {
    const deps = dependencies();
    const { result } = renderHook(() => useGame(deps));

    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    expect(deps.audio.start).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.state.phase).toBe("event"));
    expect(deps.generateOpening).toHaveBeenCalledWith(HISTORY_SEEDS[0], expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it("shows an immediate echo while the next turn is still loading", async () => {
    const next = deferred<ReturnType<typeof turnFor>>();
    const deps = dependencies({ generateNextTurn: vi.fn(() => next.promise) });
    const { result } = renderHook(() => useGame(deps));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));

    act(() => result.current.choose("A"));
    expect(result.current.state).toMatchObject({ phase: "echo", deviation: 3 });
    await waitFor(() => expect(deps.generateNextTurn).toHaveBeenCalledOnce());

    await act(async () => next.resolve(turnFor(2)));
    expect(result.current.state.phase).toBe("echo");
    act(() => result.current.continueTimeline());
    expect(result.current.state).toMatchObject({ phase: "event", currentTurn: { chapter: 2 } });
  });

  it("aborts an active request and ignores its late result on restart", async () => {
    const opening = deferred<ReturnType<typeof turnFor>>();
    const deps = dependencies({ generateOpening: vi.fn(() => opening.promise) });
    const { result } = renderHook(() => useGame(deps));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(deps.generateOpening).toHaveBeenCalledOnce());
    const signal = vi.mocked(deps.generateOpening).mock.calls[0][1]?.signal;

    act(() => result.current.restart());
    expect(signal?.aborted).toBe(true);
    await act(async () => opening.resolve(turnFor(1)));
    expect(result.current.state).toEqual(expect.objectContaining(createInitialGameState(expect.any(Number))));
    expect(result.current.state.phase).toBe("selecting");
  });

  it("keeps invalid custom text and starts a valid custom scenario", async () => {
    const deps = dependencies();
    const { result } = renderHook(() => useGame(deps));

    let invalid: ReturnType<typeof result.current.submitCustomSeed>;
    act(() => { invalid = result.current.submitCustomSeed("如果1966年的中国发生变化"); });
    expect(invalid!).toMatchObject({ ok: false, reason: "modern_china" });
    expect(deps.generateOpening).not.toHaveBeenCalled();

    act(() => result.current.submitCustomSeed("如果古罗马普及蒸汽动力"));
    await waitFor(() => expect(deps.generateOpening).toHaveBeenCalledWith(
      "如果古罗马普及蒸汽动力",
      expect.any(Object),
    ));
  });
});
