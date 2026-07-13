import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { TimelineEventScreen } from "./TimelineEventScreen";

describe("clear change event screen", () => {
  afterEach(() => cleanup());
  const openingTurn = parseTimelineTurn(JSON.stringify(turnFixture));

  it("shows proof of change and removes dashboard noise", () => {
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "一日余波",
      previousEcho: turnFixture.choices[1].instantEcho,
    }));
    render(<TimelineEventScreen
      turn={turn}
      deviation={18}
      lastChoiceLabel="扶植年幼继承人"
      abilityTitle="系统拆解"
      customActionsRemaining={3}
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.getByText("因果回执")).toBeVisible();
    const proof = screen.getByRole("region", { name: "历史改变证据" });
    expect(within(proof).getByText(/扶植年幼继承人/)).toBeVisible();
    expect(within(proof).getByText(/摄政制度被正式确立/)).toBeVisible();
    expect(screen.getByText("DeepSeek 实时生成")).toBeVisible();
    expect(screen.queryByLabelText("世界指标")).not.toBeInTheDocument();
    expect(screen.queryByText(/意识接力：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/历史锚点：/)).not.toBeInTheDocument();
    expect(screen.getByText("微调")).toBeVisible();
    expect(screen.getByText("改制")).toBeVisible();
    expect(screen.getByText("断裂")).toBeVisible();
    expect(document.querySelectorAll(".choice-item")).toHaveLength(3);
    expect(screen.getByRole("button", { name: /写下第四条路/ })).toHaveTextContent("3 次");
    expect(within(proof).getByText(/未结历史债/)).toBeVisible();
  });

  it("validates free action length and disables the entry after three uses", async () => {
    const onCustomAction = vi.fn();
    const { rerender } = render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      abilityTitle="系统拆解"
      customActionsRemaining={3}
      onChoose={vi.fn()}
      onCustomAction={onCustomAction}
      onExit={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: /写下第四条路/ }));
    expect(screen.getByRole("dialog", { name: "自由改命" })).toBeVisible();
    expect(screen.getByRole("button", { name: "提交改命" })).toBeDisabled();

    rerender(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      abilityTitle="系统拆解"
      customActionsRemaining={0}
      onChoose={vi.fn()}
      onCustomAction={onCustomAction}
      onExit={vi.fn()}
    />);
    expect(screen.getByRole("button", { name: /改命机会已用完/ })).toBeDisabled();
  });
});
