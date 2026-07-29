import { useState } from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { browseHistorySeeds } from "../data/historySeeds";
import type { HistorySeed } from "../game/types";
import { playCardSound } from "../services/cardAudio";
import {
  chooseDestinySeed,
  DEFAULT_PICKER_CONTEXT,
  SeedPickerScreen,
  type PickerContext,
} from "./SeedPickerScreen";

vi.mock("../services/cardAudio", () => ({
  playCardSound: vi.fn(),
}));

const cards = browseHistorySeeds();

function PickerHarness({
  unlockedSeedIds = [],
  onSelect = vi.fn(),
  onShowAnnouncement = vi.fn(),
  onToggleMute = vi.fn(),
}: {
  unlockedSeedIds?: readonly string[];
  onSelect?: (seed: HistorySeed) => void;
  onShowAnnouncement?: () => void;
  onToggleMute?: () => void;
}) {
  const [context, setContext] = useState<PickerContext>(DEFAULT_PICKER_CONTEXT);
  return (
    <>
      <output data-testid="picker-mode">{context.mode}</output>
      <output data-testid="active-seed-id">{context.activeSeedId}</output>
      <SeedPickerScreen
        context={context}
        muted={false}
        unlockedSeedIds={unlockedSeedIds}
        onContextChange={setContext}
        onSelect={onSelect}
        onShowAnnouncement={onShowAnnouncement}
        onToggleMute={onToggleMute}
      />
    </>
  );
}

describe("destiny draw history entry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.12);
    vi.mocked(playCardSound).mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts with one hidden destiny card instead of one hundred choices", () => {
    render(<PickerHarness />);

    expect(screen.getByRole("heading", { name: "哎！我改变了历史？" })).toBeVisible();
    expect(screen.getByLabelText("本作品包含人工智能生成内容")).toHaveTextContent("AI生成");
    expect(screen.getByRole("article", { name: "尚未揭晓的命运卡牌" })).toBeVisible();
    expect(screen.queryByRole("button", { name: /闯入这一刻/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /随机滚动时间线/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "随机抽一个开局" })).toBeEnabled();
    expect(screen.getByText("会优先抽到你还没通关的历史")).toBeVisible();
  });

  it("rotates full-height history posters at one pace, then reveals entry controls only after settling", () => {
    const onSelect = vi.fn();
    const { container } = render(<PickerHarness onSelect={onSelect} />);
    const timeoutSpy = vi.spyOn(window, "setTimeout");

    fireEvent.click(screen.getByRole("button", { name: "随机抽一个开局" }));
    expect(playCardSound).toHaveBeenCalledWith("page-turn", false);
    expect(screen.getByTestId("destiny-carousel")).toBeVisible();
    expect(container.querySelectorAll(".destiny-carousel__card")).toHaveLength(3);
    expect(container.querySelectorAll(".destiny-carousel .history-card__poster-stack")).toHaveLength(3);
    expect(container.querySelector('.destiny-carousel__card[data-slot="current"]')).toBeTruthy();
    expect(container.querySelector('.destiny-carousel__card[data-slot="previous"]')).toBeTruthy();
    expect(container.querySelector('.destiny-carousel__card[data-slot="next"]')).toBeTruthy();
    expect(container.querySelectorAll(".destiny-carousel img[loading=\"eager\"]")).toHaveLength(3);
    expect(screen.getByText("历史流转，即将揭晓")).toHaveAttribute("role", "status");
    const drawDelays = timeoutSpy.mock.calls
      .map(([, delay]) => Number(delay))
      .slice(0, 9);
    const stepIntervals = drawDelays.map((delay, index) => (
      index === 0 ? delay : delay - drawDelays[index - 1]
    ));
    expect(new Set(stepIntervals)).toEqual(new Set([2]));
    expect(screen.queryByRole("button", { name: /闯入这一刻/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "换一个开局" })).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(60));

    const revealedCard = screen.getByRole("article");
    const entry = within(revealedCard).getByRole("button", { name: /闯入这一刻/ });
    expect(within(revealedCard).getByTestId("history-card-poster-stack")).toBeVisible();
    expect(within(revealedCard).getByTestId("history-card-dossier")).toHaveAttribute("aria-label", "闯入信息");
    expect(within(revealedCard).getByTestId("history-card-action")).toBe(entry);
    expect(screen.getByRole("button", { name: "换一个开局" })).toBeEnabled();

    fireEvent.click(entry);
    expect(playCardSound).toHaveBeenCalledWith("enter-history", false);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
      id: screen.getByTestId("active-seed-id").textContent,
    }));
  });

  it("prioritizes locked histories and avoids immediately repeating the current result", () => {
    const current = cards[0];
    const locked = cards[2];
    expect(chooseDestinySeed(
      cards.slice(0, 3),
      [cards[0].id, cards[1].id],
      current.id,
      () => 0,
    )).toBe(locked);

    const allUnlocked = cards.slice(0, 3).map((seed) => seed.id);
    expect(chooseDestinySeed(cards.slice(0, 3), allUnlocked, current.id, () => 0)).toBe(cards[1]);
  });

  it("shows only completed histories in the secondary archive", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const unlocked = [cards[4].id, cards[11].id];
    const onSelect = vi.fn();
    render(<PickerHarness unlockedSeedIds={unlocked} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /已解锁档案/ }));

    expect(screen.getByTestId("picker-mode")).toHaveTextContent("archive");
    expect(screen.getByRole("heading", { name: "已解锁 2 个瞬间" })).toBeVisible();
    expect(screen.getByRole("button", { name: new RegExp(cards[4].eventName) })).toBeVisible();
    expect(screen.getByRole("button", { name: new RegExp(cards[11].eventName) })).toBeVisible();
    expect(screen.queryByText(cards[0].eventName)).not.toBeInTheDocument();
    expect(screen.getByText(/点击任意档案，可从第一幕重新游玩/)).toBeVisible();

    await user.click(screen.getByRole("button", { name: `再次闯入：${cards[4].eventName}` }));
    expect(onSelect).toHaveBeenCalledWith(cards[4]);
  });

  it("keeps audio and the player-facing rules inside one settings menu", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const onToggleMute = vi.fn();
    const onShowAnnouncement = vi.fn();
    render(
      <PickerHarness
        onToggleMute={onToggleMute}
        onShowAnnouncement={onShowAnnouncement}
      />,
    );

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitem", { name: /游戏说明/ }));
    expect(onShowAnnouncement).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: /声音/ }));
    expect(onToggleMute).toHaveBeenCalledOnce();
  });
});
