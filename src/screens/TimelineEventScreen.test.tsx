import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { TimelineEventScreen } from "./TimelineEventScreen";

const gameStyles = readFileSync("src/styles/game.css", "utf8");

describe("clear change event screen", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });
  const openingTurn = parseTimelineTurn(JSON.stringify(turnFixture));

  it("keeps the complete history comparison behind a compact secondary entry", () => {
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
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.queryByText("因果回执")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "历史对照" })).not.toBeInTheDocument();
    const comparisonTrigger = screen.getByRole("button", { name: "查看历史对照" });
    expect(comparisonTrigger).toHaveTextContent("你的时间线 · 正史原本 · 改变原因");
    fireEvent.click(comparisonTrigger);

    const dialog = screen.getByRole("dialog", { name: "历史对照" });
    const proof = within(dialog).getByRole("region", { name: "历史对照" });
    expect(within(proof).queryByText(/扶植年幼继承人/)).not.toBeInTheDocument();
    expect(within(proof).queryByText("你的决定")).not.toBeInTheDocument();
    expect(within(proof).queryByText("重大节点")).not.toBeInTheDocument();
    expect(within(proof).getByText(turn.worldStateChange)).toBeVisible();
    expect(within(proof).getByText(turn.divergenceProof)).toBeVisible();
    expect(within(proof).getByText("你的时间线")).toBeVisible();
    expect(within(proof).getByText("正史原本")).toBeVisible();
    expect(within(proof).getByText("为何改变")).toBeVisible();
    expect(screen.queryByText(/AI 辅助创作|AI 生成 · V4 Flash/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("世界指标")).not.toBeInTheDocument();
    expect(screen.queryByText(/意识接力：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/历史锚点：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/INTP|ENFP|微调|改制|断裂/)).not.toBeInTheDocument();
    expect(screen.queryByText(/你与黄盖/)).not.toBeInTheDocument();
    expect(screen.queryByText(/巡哨抵近前半刻/)).not.toBeInTheDocument();
    expect(document.querySelectorAll(".choice-card")).toHaveLength(3);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/直接改写结果/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重抽卡牌，还剩 3 次" })).toBeVisible();
    expect(within(proof).getByText(/粮仓账本改变了长安市民的米价/)).toBeVisible();
    expect(container.querySelector(".event-screen")).toHaveAttribute("data-density", "compact");
    expect(screen.getByRole("button", { name: "关闭历史对照" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "关闭历史对照" }));
    expect(screen.queryByRole("dialog", { name: "历史对照" })).not.toBeInTheDocument();
  });

  it("removes free input and exposes three rolls", () => {
    const onRoll = vi.fn();
    render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={onRoll}
      onExit={vi.fn()}
    />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/直接改写|钦定历史/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /循史牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /破局牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /天外牌/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "重抽卡牌，还剩 3 次" })).toHaveTextContent("ROLL · 3");
    expect(screen.getByText(/上划出牌，长按预览/)).toBeVisible();
    expect(screen.queryByText("抽一张，改写这一刻")).not.toBeInTheDocument();
    expect(screen.queryByText("上划选择")).not.toBeInTheDocument();
    expect(screen.queryByText("按住读牌")).not.toBeInTheDocument();
  });

  it("moves the complete event surface into its exit transition before committing", () => {
    vi.useFakeTimers();
    const onChoose = vi.fn();
    const { container } = render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={onChoose}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    const card = screen.getByRole("button", { name: /破局牌/ });
    act(() => {
      fireEvent.pointerDown(card, { clientY: 220, pointerId: 11 });
      fireEvent.pointerMove(card, { clientY: 125, pointerId: 11 });
      fireEvent.pointerUp(card, { clientY: 125, pointerId: 11 });
    });

    expect(container.querySelector(".event-screen")).toHaveClass("is-card-committing");
    expect(onChoose).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1_300));
    expect(onChoose).toHaveBeenCalledWith("B");
  });

  it("uses touch-first cards with project-owned generated artwork", () => {
    const { container } = render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(container.querySelectorAll(".choice-card img")).toHaveLength(3);
    expect(container.querySelector('img[src="/assets/cards/choice-regular.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/cards/choice-radical.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/cards/choice-surreal.png"]')).toBeInTheDocument();
    expect(gameStyles).toContain("touch-action: none");
    expect(gameStyles).toContain(".choice-card.is-armed");
    expect(gameStyles).toContain(".choice-card.is-pressing");
    expect(gameStyles).toContain("/assets/cards/frame-regular-v2.webp");
    expect(gameStyles).toContain("/assets/cards/frame-radical-v2.webp");
    expect(gameStyles).toContain("/assets/cards/frame-surreal-v2.webp");
  });

  it("renders event time and location as separate caption rows", () => {
    const { container } = render(<TimelineEventScreen
      turn={openingTurn}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    const caption = container.querySelector(".event-scene__caption");
    expect(caption).toBeInTheDocument();
    expect(caption?.querySelector(".event-scene__time")).toHaveTextContent(openingTurn.yearLabel);
    expect(caption?.querySelector(".event-scene__location")).toHaveTextContent(openingTurn.location);
  });

  it("switches to dense layout when a continuation contains the maximum useful copy", () => {
    const fullNarrative = "前".repeat(75) + "。" + "情".repeat(75) + "。" + "险".repeat(77) + "。";
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
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(container.querySelector(".event-screen")).toHaveAttribute("data-density", "dense");
    expect(fullNarrative).toHaveLength(230);
    expect(screen.getByText(fullNarrative)).toBeVisible();
    expect(screen.queryByText(fullCausalBridge, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText(fullWorldChange)).not.toBeInTheDocument();
    expect(screen.queryByText(fullRealHistory)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "查看历史对照" }));
    expect(screen.getByText(fullCausalBridge, { exact: false })).toBeVisible();
    expect(screen.getByText(fullWorldChange)).toBeVisible();
    expect(screen.getByText(fullRealHistory)).toBeVisible();
  });

  it("uses the dense layout for a realistic rich opening so the history anchor stays in view", () => {
    const richOpening = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      narrative: "1939年9月1日凌晨，柏林最高统帅部，你手中握着刚签发的白色方案进攻口令，窗外能听见远处引擎的预热声。希特勒要求你立刻将口令传往波兰边境，而内政部伪造的格莱维茨电台攻击报告已准备就绪，英法使馆尚未收到任何警告。作为通信军官，你有权扣下口令二十分钟，但逾期不传将以叛国罪被处决；你必须决定是否让战争车轮启动。",
    }));

    const { container } = render(<TimelineEventScreen
      turn={richOpening}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(container.querySelector(".event-screen")).toHaveAttribute("data-density", "dense");
    expect(container.querySelector(".event-screen")).toHaveAttribute("data-history-mode", "opening");
    expect(container.querySelector(".event-screen")).toHaveAttribute("data-layout", "image-overlay");
    expect(screen.queryByRole("region", { name: "真实历史切入口" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "查看正史切入口" }));
    expect(screen.getByRole("dialog", { name: "正史切入口" })).toBeVisible();
    expect(screen.getByRole("region", { name: "真实历史切入口" })).toBeVisible();
  });

  it("keeps a compact card face while preserving the complete canonical decision for details", () => {
    const fullAction = "趁董卓车队入城前调弓弩手封锁宣阳门并扣住吕布亲兵";
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? {
        ...choice,
        label: fullAction,
        displayLabel: "封锁宣阳门",
      } : choice),
    }));

    render(<TimelineEventScreen
      turn={turn}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.getByRole("button", { name: /循史牌，封锁宣阳门/ })).toBeVisible();
    expect(screen.queryByText(fullAction)).not.toBeInTheDocument();
  });

  it("shows the model-authored short face instead of deriving another visible sentence", () => {
    const canonical = "召集所有仍然忠于朝廷的边军将领公开核验军令来源并要求他们在日落之前重新宣誓效忠";
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? {
        ...choice,
        label: canonical,
        displayLabel: "核验边军军令",
        actionSpec: { actor: "你", action: "公开核验军令", target: "边军将领", deadline: "日落前" },
      } : choice),
    }));

    render(<TimelineEventScreen
      turn={turn}
      deviation={0}
      rollCount={0}
      rollLoading={false}
      muted
      onChoose={vi.fn()}
      onRoll={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.getByText("核验边军军令")).toBeVisible();
    expect(screen.getByRole("button", { name: /循史牌，核验边军军令/ })).toBeVisible();
    expect(screen.queryByText(canonical)).not.toBeInTheDocument();
  });
});
