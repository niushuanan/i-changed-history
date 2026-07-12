import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
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
});
