import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, type GameState } from "../game/reducer";
import { parseAlternatePresent, parseTimelineTurn } from "../game/schema";
import { endingFixture, turnFixture } from "../test/fixtures";
import { useGame, type UseGameDependencies } from "./useGame";

const profile = { name: "林舟", occupation: "product", strengths: ["negotiation", "strategy"], riskStyle: "balanced" } as const;
const turn = parseTimelineTurn(JSON.stringify(turnFixture));
const deps = (): UseGameDependencies => ({
  generateOpening: vi.fn().mockResolvedValue(turn), generateNextTurn: vi.fn(), generateEnding: vi.fn(),
  loadSnapshot: vi.fn(() => null), saveSnapshot: vi.fn(() => true),
  audio: { start: vi.fn().mockResolvedValue(true), stop: vi.fn(), setChapter: vi.fn(), isMuted: vi.fn(() => false), setMuted: vi.fn(), toggleMuted: vi.fn(() => true), dispose: vi.fn() },
});

describe("useGame profile orchestration", () => {
  it("requires a profile and sends the complete traveler scenario to AI", async () => {
    const dependencies = deps();
    const { result } = renderHook(() => useGame(dependencies));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    expect(dependencies.generateOpening).not.toHaveBeenCalled();
    act(() => result.current.setProfile(profile));
    act(() => result.current.selectSeed(HISTORY_SEEDS[0]));
    await waitFor(() => expect(result.current.state.phase).toBe("event"));
    expect(dependencies.generateOpening).toHaveBeenCalledWith({ profile, seed: HISTORY_SEEDS[0] }, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it("automatically runs a restored ending request after refresh", async () => {
    const dependencies = deps();
    const restored: GameState = {
      ...createInitialGameState(9),
      phase: "ending",
      profile,
      scenario: { profile, seed: HISTORY_SEEDS[0] },
      currentTurn: turn,
      playedTurns: [{
        turn,
        selectedChoiceId: "A",
        selectedChoiceLabel: turn.choices[0].label,
        selectedDeviationClass: "nudge",
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
});
