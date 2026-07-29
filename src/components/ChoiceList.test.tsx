import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { playCardSound } from "../services/cardAudio";
import { turnFixture } from "../test/fixtures";
import { ChoiceList } from "./ChoiceList";

vi.mock("../services/cardAudio", () => ({
  playCardSound: vi.fn(),
}));

describe("roguelike history cards", () => {
  const choices = parseTimelineTurn(JSON.stringify(turnFixture)).choices;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(playCardSound).mockClear();
  });
  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("shows one readable card for each risk tier without personality decorations", () => {
    const { container } = render(
      <ChoiceList
        choices={choices}
        muted={false}
        onChoose={vi.fn()}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    expect(screen.getByRole("button", { name: /循史牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /破局牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /天外牌/ })).toBeVisible();
    expect(container.querySelectorAll(".choice-card__art img")).toHaveLength(3);
    expect(container.querySelectorAll(".choice-card__frame-image")).toHaveLength(3);
    expect(container.querySelectorAll(".choice-card__surface")).toHaveLength(3);
    expect(container.querySelectorAll(".choice-card__hold-cue")).toHaveLength(3);
    expect(container.querySelector(".choice-roll__deck")).not.toBeInTheDocument();
    expect(container.querySelector(".choice-roll__label")).toHaveTextContent("ROLL");
    expect(screen.queryByText("上划选择")).not.toBeInTheDocument();
    expect(screen.queryByText("按住读牌")).not.toBeInTheDocument();
    expect(screen.queryByText(/人格|ENFP|INTP/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重抽卡牌，还剩 3 次" })).toBeEnabled();
  });

  it("commits exactly one card only after an upward swipe crosses the threshold", () => {
    const onChoose = vi.fn();
    render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={onChoose}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    const card = screen.getByRole("button", { name: /循史牌/ });
    fireEvent.pointerDown(card, { clientY: 220, pointerId: 1 });
    fireEvent.pointerMove(card, { clientY: 190, pointerId: 1 });
    fireEvent.pointerUp(card, { clientY: 190, pointerId: 1 });
    act(() => vi.advanceTimersByTime(250));
    expect(onChoose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.pointerDown(card, { clientY: 220, pointerId: 2 });
      fireEvent.pointerMove(card, { clientY: 130, pointerId: 2 });
    });
    expect(document.querySelector(".card-drag-layer")).toBeInTheDocument();
    expect(document.querySelector(".card-drag-lift")).toHaveTextContent(choices[0].displayLabel);
    expect(document.querySelector(".card-drag-lift")).toHaveClass("choice-card");
    expect(document.querySelector(".card-drag-lift .choice-card__frame-image")).toHaveAttribute(
      "src",
      "/assets/cards/frame-regular-v2.webp",
    );
    act(() => {
      fireEvent.pointerUp(card, { clientY: 130, pointerId: 2 });
    });
    expect(document.querySelector(".card-drag-layer")).not.toBeInTheDocument();
    expect(onChoose).not.toHaveBeenCalled();
    expect(card).toHaveClass("is-committing");
    expect(card.closest(".rogue-choice-table")).toHaveClass("is-committing");
    expect(document.querySelector(".card-commit-layer")).toBeInTheDocument();
    expect(document.querySelector(".card-commit-flight")).toHaveAttribute("data-phase", "flying");
    expect(document.querySelector(".card-commit-flight")).toHaveAttribute("data-target-top", "8");
    expect(document.querySelector(".card-commit-flight__card")).toHaveClass("choice-card");
    expect(document.querySelector(".card-commit-flight__card .choice-card__frame-image")).toHaveAttribute(
      "src",
      "/assets/cards/frame-regular-v2.webp",
    );
    expect(document.querySelector(".card-commit-flight__particles")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(640));
    expect(document.querySelector(".card-commit-flight")).toHaveAttribute("data-phase", "dissolving");
    expect(onChoose).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(640));
    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onChoose).toHaveBeenCalledWith("A");
  });

  it.each([
    ["循史牌", "swipe-regular"],
    ["破局牌", "swipe-radical"],
    ["天外牌", "swipe-surreal"],
  ] as const)("gives %s its own swipe sound", (accessibleName, sound) => {
    render(
      <ChoiceList
        choices={choices}
        muted={false}
        onChoose={vi.fn()}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    const card = screen.getByRole("button", { name: new RegExp(accessibleName) });
    act(() => {
      fireEvent.pointerDown(card, { clientY: 220, pointerId: 9 });
      fireEvent.pointerMove(card, { clientY: 120, pointerId: 9 });
      fireEvent.pointerUp(card, { clientY: 120, pointerId: 9 });
    });

    expect(playCardSound).toHaveBeenCalledWith(sound, false);
  });

  it("never commits a card when the browser cancels the pointer gesture", () => {
    const onChoose = vi.fn();
    render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={onChoose}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    const card = screen.getByRole("button", { name: /破局牌/ });
    act(() => {
      fireEvent.pointerDown(card, { clientY: 220, pointerId: 7 });
      fireEvent.pointerMove(card, { clientY: 120, pointerId: 7 });
      fireEvent.pointerCancel(card, { clientY: 120, pointerId: 7 });
    });
    act(() => vi.advanceTimersByTime(600));

    expect(card).not.toHaveClass("is-committing");
    expect(onChoose).not.toHaveBeenCalled();
  });

  it("reveals the full canonical decision on long press without committing it", () => {
    const canonical = "召集所有仍然忠于朝廷的边军将领公开核验军令来源并要求他们在日落之前重新宣誓效忠";
    const detailedChoices = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? {
        ...choice,
        label: canonical,
        displayLabel: "核验边军军令",
        actionSpec: {
          actor: "你",
          action: canonical,
          target: "边军将领",
          deadline: "日落前",
        },
      } : choice),
    })).choices;
    const onChoose = vi.fn();
    render(
      <ChoiceList
        choices={detailedChoices}
        muted
        onChoose={onChoose}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    const card = screen.getByRole("button", { name: /循史牌/ });
    fireEvent.pointerDown(card, { clientY: 220, pointerId: 1 });
    expect(card).toHaveClass("is-pressing");
    expect(card.closest(".rogue-choice-table")).toHaveClass("is-holding");
    act(() => vi.advanceTimersByTime(180));
    expect(card).toHaveClass("is-pressing");
    act(() => vi.advanceTimersByTime(340));

    const dialog = screen.getByRole("dialog", { name: "核验边军军令详细信息" });
    const scrollRegion = screen.getByRole("region", { name: "完整决定与执行结果" });
    expect(card).not.toHaveClass("is-pressing");
    expect(screen.getAllByText(canonical)).toHaveLength(1);
    expect(scrollRegion).toContainElement(screen.getByText(canonical));
    expect(dialog).not.toHaveTextContent("怎么做");
    expect(dialog).toHaveTextContent(detailedChoices[0].instantEcho.unexpectedCost);
    expect(scrollRegion.previousElementSibling).toBe(dialog.querySelector("header"));
    expect(scrollRegion.nextElementSibling).toBe(dialog.querySelector(".choice-detail__footer"));
    expect(dialog.querySelector(".choice-detail__art img")).toHaveAttribute(
      "src",
      "/assets/cards/choice-regular.png",
    );
    expect(screen.getByRole("button", { name: "关闭卡牌详情" })).toHaveClass("choice-detail__close");
    expect(onChoose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "关闭卡牌详情" }));
    expect(dialog.closest(".choice-detail-backdrop")).toHaveClass("is-closing");
    act(() => vi.advanceTimersByTime(260));
    expect(dialog).not.toBeInTheDocument();
    expect(card).toHaveFocus();
  });

  it("cancels the long-press lift as soon as the player starts swiping", () => {
    render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    const card = screen.getByRole("button", { name: /天外牌/ });
    fireEvent.pointerDown(card, { clientY: 220, pointerId: 8 });
    expect(card).toHaveClass("is-pressing");
    fireEvent.pointerMove(card, { clientY: 198, pointerId: 8 });
    expect(card).not.toHaveClass("is-pressing");
    expect(card.closest(".rogue-choice-table")).not.toHaveClass("is-holding");
    act(() => vi.advanceTimersByTime(360));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("gives even the prepared trio a deliberate shuffle beat, then exposes two live rolls", () => {
    const onRoll = vi.fn();
    const { rerender } = render(
      <ChoiceList
        choices={choices}
        muted={false}
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollCount={0}
        rollLoading={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "重抽卡牌，还剩 3 次" }));
    expect(playCardSound).toHaveBeenCalledWith("roll", false);
    expect(onRoll).not.toHaveBeenCalled();
    expect(document.querySelector(".rogue-choice-table")).toHaveClass("is-collecting");
    act(() => vi.advanceTimersByTime(900));
    expect(onRoll).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("正在为这一刻换一手牌");
    act(() => vi.advanceTimersByTime(320));
    expect(onRoll).toHaveBeenCalledTimes(1);

    rerender(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollCount={1}
        rollLoading={false}
      />,
    );
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByRole("button", { name: "重抽卡牌，还剩 2 次" })).toBeEnabled();

    rerender(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollCount={1}
        rollLoading
      />,
    );
    expect(screen.getByRole("button", { name: "正在洗牌" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("正在为这一刻换一手牌");

    rerender(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollCount={3}
        rollLoading={false}
      />,
    );
    const usedButton = screen.getByRole("button", { name: "本节点三次重抽已经用完" });
    expect(usedButton).toBeDisabled();
    expect(onRoll).toHaveBeenCalledTimes(1);
  });

  it("keeps the current cards playable and exposes an in-place live Roll retry", () => {
    const onRoll = vi.fn();
    render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollCount={1}
        rollLoading={false}
        rollError="这手牌没洗出来，再 Roll 一次。"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("这手牌没洗出来，再 Roll 一次。");
    expect(screen.getByRole("status")).not.toHaveTextContent("可再次尝试");
    expect(screen.getByRole("button", { name: "重抽卡牌，还剩 2 次" })).toBeEnabled();
    expect(screen.getByRole("button", { name: /循史牌/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /破局牌/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /天外牌/ })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "重抽卡牌，还剩 2 次" }));
    expect(screen.getByRole("status")).toHaveTextContent("正在为这一刻换一手牌");
    expect(screen.queryByText("这手牌没洗出来，再 Roll 一次。")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(380));
    expect(onRoll).toHaveBeenCalledOnce();
  });
});
