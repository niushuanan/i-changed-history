import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { TimelineEventScreen } from "./TimelineEventScreen";

describe("clear change event screen", () => {
  afterEach(() => cleanup());
  const openingTurn = parseTimelineTurn(JSON.stringify(turnFixture));

  it("places an explicit changed-versus-real history comparison below the decisions", () => {
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[1].instantEcho,
      rippleLens: "livelihood",
      causalBridge: "摄政命令经粮仓账本改变了长安市民的米价",
    }));
    const { container } = render(<TimelineEventScreen
      turn={turn}
      deviation={18}
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.queryByText("因果回执")).not.toBeInTheDocument();
    const proof = screen.getByRole("region", { name: "历史对照" });
    expect(within(proof).queryByText(/扶植年幼继承人/)).not.toBeInTheDocument();
    expect(within(proof).queryByText("你的决定")).not.toBeInTheDocument();
    expect(within(proof).queryByText("重大节点")).not.toBeInTheDocument();
    expect(within(proof).getByText(turn.worldStateChange)).toBeVisible();
    expect(within(proof).getByText(turn.divergenceProof)).toBeVisible();
    expect(within(proof).getByText("你的时间线")).toBeVisible();
    expect(within(proof).getByText("正史原本")).toBeVisible();
    expect(within(proof).getByText("为何改变")).toBeVisible();
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
    expect(container.querySelector(".event-screen")).toHaveAttribute("data-density", "compact");
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

  it("renders event time and location as separate caption rows", () => {
    const { container } = render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    const caption = container.querySelector(".event-scene__caption");
    expect(caption).toBeInTheDocument();
    expect(caption?.querySelector(".event-scene__time")).toHaveTextContent(openingTurn.yearLabel);
    expect(caption?.querySelector(".event-scene__location")).toHaveTextContent(openingTurn.location);
  });

  it("switches to dense layout when a continuation contains the maximum useful copy", () => {
    const fullNarrative = "前".repeat(44) + "。" + "情".repeat(42) + "。";
    const fullCausalBridge = "因".repeat(36);
    const fullWorldChange = "变".repeat(36);
    const fullRealHistory = "史".repeat(48);
    const denseTurn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[0].instantEcho,
      narrative: fullNarrative,
      causalBridge: fullCausalBridge,
      turningPointStakes: "势".repeat(44),
      worldStateChange: fullWorldChange,
      divergenceProof: fullRealHistory,
      choices: turnFixture.choices.map((choice, index) => ({
        ...choice,
        label: `${["调", "封", "截"][index]}`.repeat(32),
      })),
    }));
    const { container } = render(<TimelineEventScreen
      turn={denseTurn}
      deviation={36}
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(container.querySelector(".event-screen")).toHaveAttribute("data-density", "dense");
    expect(screen.getByText(fullNarrative)).toBeVisible();
    expect(screen.getByText(fullCausalBridge, { exact: false })).toBeVisible();
    expect(screen.getByText(fullWorldChange)).toBeVisible();
    expect(screen.getByText(fullRealHistory)).toBeVisible();
  });

  it("shows a complete thirty-two-character action instead of cutting it mid-sentence", () => {
    const fullAction = "趁董卓车队入城前调弓弩手封锁宣阳门并扣住吕布亲兵";
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? { ...choice, label: fullAction } : choice),
    }));

    render(<TimelineEventScreen
      turn={turn}
      deviation={0}
      onChoose={vi.fn()}
      onCustomAction={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.getByRole("button", { name: `A${fullAction}` })).toBeVisible();
  });
});
