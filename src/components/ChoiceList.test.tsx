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
        rollUsed={false}
      />,
    );

    expect(screen.getByRole("button", { name: /循史牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /破局牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /天外牌/ })).toBeVisible();
    expect(container.querySelectorAll(".choice-card img")).toHaveLength(3);
    expect(container.querySelectorAll(".choice-card__surface")).toHaveLength(3);
    expect(container.querySelector(".choice-roll__deck img")).toHaveAttribute(
      "src",
      "/assets/picker/vermilion-cloth-v2.webp",
    );
    expect(screen.queryByText(/人格|ENFP|INTP/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "立即重抽三张预生成卡牌" })).toBeEnabled();
  });

  it("commits exactly one card only after an upward swipe crosses the threshold", () => {
    const onChoose = vi.fn();
    render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={onChoose}
        onRoll={vi.fn()}
        rollUsed={false}
      />,
    );

    const card = screen.getByRole("button", { name: /循史牌/ });
    fireEvent.pointerDown(card, { clientY: 220, pointerId: 1 });
    fireEvent.pointerMove(card, { clientY: 190, pointerId: 1 });
    fireEvent.pointerUp(card, { clientY: 190, pointerId: 1 });
    act(() => vi.advanceTimersByTime(250));
    expect(onChoose).not.toHaveBeenCalled();

    fireEvent.pointerDown(card, { clientY: 220, pointerId: 2 });
    fireEvent.pointerMove(card, { clientY: 130, pointerId: 2 });
    fireEvent.pointerUp(card, { clientY: 130, pointerId: 2 });
    expect(onChoose).not.toHaveBeenCalled();
    expect(card).toHaveClass("is-committing");
    expect(card.closest(".rogue-choice-table")).toHaveClass("is-committing");
    act(() => vi.advanceTimersByTime(430));
    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onChoose).toHaveBeenCalledWith("A");
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
        rollUsed={false}
      />,
    );

    const card = screen.getByRole("button", { name: /循史牌/ });
    fireEvent.pointerDown(card, { clientY: 220, pointerId: 1 });
    act(() => vi.advanceTimersByTime(450));

    const dialog = screen.getByRole("dialog", { name: "核验边军军令详细信息" });
    expect(dialog).toHaveTextContent(canonical);
    expect(dialog).toHaveTextContent("公开核验军令");
    expect(dialog).toHaveTextContent(detailedChoices[0].instantEcho.unexpectedCost);
    expect(dialog.querySelector(".choice-detail__art img")).toHaveAttribute(
      "src",
      "/assets/cards/choice-regular.png",
    );
    expect(onChoose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "关闭卡牌详情" }));
    expect(dialog.closest(".choice-detail-backdrop")).toHaveClass("is-closing");
    act(() => vi.advanceTimersByTime(220));
    expect(dialog).not.toBeInTheDocument();
    expect(card).toHaveFocus();
  });

  it("reveals the prepared second trio once and never asks the model to wait", () => {
    const onRoll = vi.fn();
    const { rerender } = render(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollUsed={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "立即重抽三张预生成卡牌" }));
    expect(onRoll).not.toHaveBeenCalled();
    expect(document.querySelector(".rogue-choice-table")).toHaveClass("is-collecting");
    act(() => vi.advanceTimersByTime(270));
    expect(onRoll).toHaveBeenCalledTimes(1);

    rerender(
      <ChoiceList
        choices={choices}
        muted
        onChoose={vi.fn()}
        onRoll={onRoll}
        rollUsed
      />,
    );
    const usedButton = screen.getByRole("button", { name: "本节点已经重抽过一次" });
    expect(usedButton).toBeDisabled();
    fireEvent.click(usedButton);
    act(() => vi.runOnlyPendingTimers());
    expect(onRoll).toHaveBeenCalledTimes(1);
  });
});
