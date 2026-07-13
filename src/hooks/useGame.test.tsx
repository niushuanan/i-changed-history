import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, type GameState } from "../game/reducer";
import { parseAlternatePresent, parseTimelineTurn } from "../game/schema";
import { endingFixture, turnFixture } from "../test/fixtures";
import { useGame, type UseGameDependencies } from "./useGame";
const turn = parseTimelineTurn(JSON.stringify(turnFixture));
const deps = (): UseGameDependencies => ({
  generateOpening: vi.fn().mockResolvedValue(turn), generateNextTurn: vi.fn(), adjudicateCustomAction: vi.fn(), generateEnding: vi.fn(),
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

  it("starts directly from a historical moment", async () => {
    const dependencies = deps();
    const { result } = renderHook(() => useGame(dependencies));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));
    expect(dependencies.generateOpening).toHaveBeenCalledWith(expect.objectContaining({ seed: HISTORY_SEEDS[0] }), expect.objectContaining({ signal: expect.any(AbortSignal) }));
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

  it("writes a declared result into history and spends one chance only after generation", async () => {
    const dependencies = deps();
    vi.mocked(dependencies.adjudicateCustomAction).mockResolvedValue({
      declaredOutcome: "我暗杀了皇帝且成功",
      canonStatus: "玩家钦定",
      causalMechanism: "死讯通过禁军口令传入摄政会议",
      deviationClass: "rupture",
      instantEcho: {
        directResult: "皇帝提前收到宫变消息",
        unexpectedCost: "两宫禁军开始互扣使者",
        beneficiary: "忠于皇帝的宿卫",
        payer: "玄武门低阶军士",
      },
    });
    const { result } = renderHook(() => useGame(dependencies));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));

    act(() => result.current.submitCustomAction("我暗杀了皇帝且成功"));
    expect(result.current.state.customActionsUsed).toBe(0);
    await waitFor(() => expect(result.current.state.phase).toBe("echo"));
    expect(result.current.state.customActionsUsed).toBe(1);
    expect(dependencies.adjudicateCustomAction).toHaveBeenCalledWith(
      expect.any(Object), [], turn, "我暗杀了皇帝且成功", expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
