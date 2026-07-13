import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { TimelineEventScreen } from "./TimelineEventScreen";

describe("clear change event screen", () => {
  afterEach(() => cleanup());
  const openingTurn = parseTimelineTurn(JSON.stringify(turnFixture));
  const abilityProps = {
    abilityTitle: "因果侦探",
    abilityCode: "INTP",
    abilityPreviewMode: "system" as const,
    abilityCustomAction: "三次自由改命中可用独立推演",
  };

  it("shows proof of change and removes dashboard noise", () => {
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "一日余波",
      previousEcho: turnFixture.choices[1].instantEcho,
      rippleLens: "livelihood",
      causalBridge: "摄政命令经粮仓账本改变了长安市民的米价",
    }));
    render(<TimelineEventScreen
      turn={turn}
      deviation={18}
      lastChoiceLabel="扶植年幼继承人"
      {...abilityProps}
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
    expect(screen.getByRole("button", { name: /直接改写结果/ })).toHaveTextContent("3 次");
    expect(within(proof).getByText(/蝴蝶转向/)).toBeVisible();
    expect(within(proof).getByText(/粮仓账本改变了长安市民的米价/)).toBeVisible();
  });

  it("validates free action length and disables the entry after three uses", async () => {
    const onCustomAction = vi.fn();
    const { rerender } = render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      {...abilityProps}
      customActionsRemaining={3}
      onChoose={vi.fn()}
      onCustomAction={onCustomAction}
      onExit={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: /直接改写结果/ }));
    expect(screen.getByRole("dialog", { name: "钦定历史结果" })).toBeVisible();
    expect(screen.getByText(/将直接成为这条时间线的既成事实/)).toBeVisible();
    expect(screen.getByRole("button", { name: "写入时间线" })).toBeDisabled();

    rerender(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      {...abilityProps}
      customActionsRemaining={0}
      onChoose={vi.fn()}
      onCustomAction={onCustomAction}
      onExit={vi.fn()}
    />);
    expect(screen.getByRole("button", { name: /改写机会已用完/ })).toBeDisabled();
  });
});
