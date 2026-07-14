import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, type GameState } from "../game/reducer";
import { parseAlternatePresent, parseTimelineTurn } from "../game/schema";
import { endingFixture, turnFixture } from "../test/fixtures";
import { useGame, type UseGameDependencies } from "./useGame";
const turn = parseTimelineTurn(JSON.stringify(turnFixture));
const deps = (): UseGameDependencies => ({
  generateNextTurn: vi.fn(), generateEnding: vi.fn(),
  loadSnapshot: vi.fn(() => null), saveSnapshot: vi.fn(() => true),
  audio: { start: vi.fn().mockResolvedValue(true), stop: vi.fn(), setChapter: vi.fn(), isMuted: vi.fn(() => false), setMuted: vi.fn(), toggleMuted: vi.fn(() => true), dispose: vi.fn() },
});

describe("useGame single-life orchestration", () => {
  it("starts the score from the first product gesture", async () => {
    const dependencies = deps();
    const { result } = renderHook(() => useGame(dependencies));

    await act(() => result.current.startExperience());
    await act(() => result.current.startExperience());

    expect(dependencies.audio.start).toHaveBeenCalledTimes(1);
  });

  it("keeps the score running when an active run exits to the picker", async () => {
    const dependencies = deps();
    const { result } = renderHook(() => useGame(dependencies));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));

    act(() => result.current.restart());

    expect(result.current.state.phase).toBe("selecting");
    expect(dependencies.audio.stop).not.toHaveBeenCalled();
  });

  it("starts directly from a fixed historical moment without calling DeepSeek", async () => {
    const dependencies = deps();
    const { result } = renderHook(() => useGame(dependencies));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));
    expect(result.current.state.currentTurn).toMatchObject({
      chapter: 1,
      generationSource: "fixed",
      location: HISTORY_SEEDS[0].location,
    });
  });

  it("exposes real DeepSeek progress stages while a request is running", async () => {
    const dependencies = deps();
    vi.mocked(dependencies.generateNextTurn).mockImplementation(async (_scenario, _played, _chapter, options) => {
      options?.onProgress?.("reasoning");
      options?.onProgress?.("writing");
      return turn;
    });
    const { result } = renderHook(() => useGame(dependencies));

    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    act(() => result.current.choose("A"));
    await waitFor(() => expect(result.current.generationStage).toBe("writing"));
    await waitFor(() => expect(result.current.state.pendingTurn).not.toBeNull());
  });

  it("never lets concurrent or retried progress move backward", async () => {
    const dependencies = deps();
    vi.mocked(dependencies.generateNextTurn).mockImplementation(async (_scenario, _played, _chapter, options) => {
      options?.onProgress?.("writing");
      options?.onProgress?.("reasoning");
      return turn;
    });
    const { result } = renderHook(() => useGame(dependencies));

    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    act(() => result.current.choose("A"));
    await waitFor(() => expect(result.current.state.pendingTurn).not.toBeNull());

    expect(result.current.generationStage).toBe("writing");
  });

  it("automatically runs a restored ending request after refresh", async () => {
    const dependencies = deps();
    const restored: GameState = {
      ...createInitialGameState(9),
      phase: "ending",
      scenario: { seed: HISTORY_SEEDS[0] },
      currentTurn: turn,
      playedTurns: [{
        turn,
        selectedChoiceId: "A",
        selectedChoiceLabel: turn.choices[0].label,
        selectedDeviationClass: "nudge",
        resolvedEcho: turn.choices[0].instantEcho,
      }],
      request: { kind: "ending", id: 8 },
    };
    vi.mocked(dependencies.loadSnapshot).mockReturnValue(restored);
    vi.mocked(dependencies.generateEnding).mockResolvedValue(
      parseAlternatePresent(JSON.stringify(endingFixture)),
    );

    const { result } = renderHook(() => useGame(dependencies));
    await waitFor(() => expect(result.current.state.phase).toBe("result"));
    expect(dependencies.generateEnding).toHaveBeenCalledWith(
      restored.scenario,
      restored.playedTurns,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("writes a declared result immediately and starts exactly one next-turn request", async () => {
    const dependencies = deps();
    vi.mocked(dependencies.generateNextTurn).mockResolvedValue(turn);
    const { result } = renderHook(() => useGame(dependencies));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));

    act(() => result.current.submitCustomAction("我暗杀了皇帝且成功"));
    expect(result.current.state.customActionsUsed).toBe(1);
    expect(result.current.state.playedTurns[0]).toMatchObject({
      selectedChoiceLabel: "我暗杀了皇帝且成功",
      selectedDeviationClass: "rupture",
      playerAuthored: true,
      canonStatus: "玩家钦定",
    });
    await waitFor(() => expect(result.current.state.phase).toBe("event"));
    expect(result.current.state.echo).toBeNull();
    expect(dependencies.generateNextTurn).toHaveBeenCalledTimes(1);
    expect(dependencies.generateNextTurn).toHaveBeenCalledWith(
      expect.any(Object),
      expect.arrayContaining([expect.objectContaining({ selectedChoiceLabel: "我暗杀了皇帝且成功" })]),
      2,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
