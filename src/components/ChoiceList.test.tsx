import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { ChoiceList } from "./ChoiceList";

describe("roguelike history cards", () => {
  const choices = parseTimelineTurn(JSON.stringify(turnFixture)).choices;

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("shows one readable card for each risk tier without personality decorations", () => {
    const { container } = render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={vi.fn()}
        rollCount={0}
        rollLoading={false}
      />,
    );

    expect(screen.getByRole("button", { name: /循史牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /破局牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /天外牌/ })).toBeVisible();
    expect(container.querySelectorAll(".choice-card img")).toHaveLength(3);
    expect(container.querySelectorAll(".choice-card__surface")).toHaveLength(3);
    expect(container.querySelectorAll(".choice-card__hold-cue")).toHaveLength(3);
    expect(container.querySelector(".choice-roll__deck")).not.toBeInTheDocument();
    expect(container.querySelector(".choice-roll__label")).toHaveTextContent("ROLL");
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
      fireEvent.pointerUp(card, { clientY: 130, pointerId: 2 });
    });
    expect(onChoose).not.toHaveBeenCalled();
    expect(card).toHaveClass("is-committing");
    expect(card.closest(".rogue-choice-table")).toHaveClass("is-committing");
    act(() => vi.advanceTimersByTime(500));
    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onChoose).toHaveBeenCalledWith("A");
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
          action: "公开核验军令",
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
    expect(card).not.toHaveClass("is-pressing");
    expect(dialog).toHaveTextContent(canonical);
    expect(dialog).toHaveTextContent("公开核验军令");
    expect(dialog).toHaveTextContent(detailedChoices[0].instantEcho.unexpectedCost);
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

  it("reveals the prepared trio instantly, then exposes two live rolls", () => {
    const onRoll = vi.fn();
    const { rerender } = render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollCount={0}
        rollLoading={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "重抽卡牌，还剩 3 次" }));
    expect(onRoll).not.toHaveBeenCalled();
    expect(document.querySelector(".rogue-choice-table")).toHaveClass("is-collecting");
    act(() => vi.advanceTimersByTime(190));
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
    expect(screen.getByRole("button", { name: "AI 正在现场发牌" })).toBeDisabled();

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
    render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={vi.fn()}
        rollCount={1}
        rollLoading={false}
        rollError="新牌暂时没有发出来，点击 ROLL 再试。"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("新牌暂时没有发出来，点击 ROLL 再试。");
    expect(screen.getByRole("button", { name: "重抽卡牌，还剩 2 次" })).toBeEnabled();
    expect(screen.getByRole("button", { name: /循史牌/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /破局牌/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /天外牌/ })).toBeEnabled();
  });
});
