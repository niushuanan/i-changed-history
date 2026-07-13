import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { TimelineEventScreen } from "./TimelineEventScreen";

describe("clear change event screen", () => {
  afterEach(() => cleanup());
  const openingTurn = parseTimelineTurn(JSON.stringify(turnFixture));

  it("moves compact change proof below the decisions and removes repeated labels", () => {
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[1].instantEcho,
      rippleLens: "livelihood",
      causalBridge: "摄政命令经粮仓账本改变了长安市民的米价",
    }));
    render(<TimelineEventScreen
      turn={turn}
      deviation={18}
      lastChoiceLabel="扶植年幼继承人"
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.queryByText("因果回执")).not.toBeInTheDocument();
    const proof = screen.getByRole("region", { name: "历史已经改变" });
    expect(within(proof).getByText(/扶植年幼继承人/)).toBeVisible();
    expect(within(proof).queryByText("你的决定")).not.toBeInTheDocument();
    expect(within(proof).queryByText("重大节点")).not.toBeInTheDocument();
    expect(within(proof).getByText(turn.worldStateChange)).toBeVisible();
    expect(within(proof).getByText(turn.divergenceProof)).toBeVisible();
    expect(screen.getByText("DeepSeek 实时生成")).toBeVisible();
    expect(screen.queryByLabelText("世界指标")).not.toBeInTheDocument();
    expect(screen.queryByText(/意识接力：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/历史锚点：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/INTP|ENFP|微调|改制|断裂/)).not.toBeInTheDocument();
    expect(screen.queryByText(/你与黄盖/)).not.toBeInTheDocument();
    expect(screen.queryByText(/巡哨抵近前半刻/)).not.toBeInTheDocument();
    expect(document.querySelectorAll(".choice-item")).toHaveLength(3);
    expect(screen.getByRole("button", { name: /直接改写结果/ })).toHaveTextContent("不限次数");
    expect(within(proof).getByText(/粮仓账本改变了长安市民的米价/)).toBeVisible();
    const decisions = screen.getByRole("group", { name: "本幕决定" });
    expect(decisions.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("validates free action length while keeping result rewrites unlimited", async () => {
    const onCustomAction = vi.fn();
    render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      onChoose={vi.fn()}
      onCustomAction={onCustomAction}
      onExit={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: /直接改写结果/ }));
    expect(screen.getByRole("dialog", { name: "钦定历史结果" })).toBeVisible();
    expect(screen.getByText(/本局不限次数/)).toBeVisible();
    expect(screen.getByText(/将直接成为这条时间线的既成事实/)).toBeVisible();
    expect(screen.getByRole("button", { name: "写入时间线" })).toBeDisabled();
  });

  it("switches to dense layout when a continuation contains the maximum useful copy", () => {
    const denseTurn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[0].instantEcho,
      narrative: "史".repeat(56),
      causalBridge: "因".repeat(44),
      turningPointStakes: "势".repeat(44),
      worldStateChange: "变".repeat(44),
      divergenceProof: "证".repeat(56),
    }));
    const { container } = render(<TimelineEventScreen
      turn={denseTurn}
      deviation={36}
      lastChoiceLabel={"玩家上一项不可撤销的重大决定".repeat(2)}
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(container.querySelector(".event-screen")).toHaveAttribute("data-density", "dense");
  });
});
