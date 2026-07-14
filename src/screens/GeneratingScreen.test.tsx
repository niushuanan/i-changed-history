import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GeneratingScreen } from "./GeneratingScreen";

describe("history developing room", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });
  it("uses the opening archive art for early nodes", () => {
    render(<GeneratingScreen chapter={1} ending={false} onCancel={vi.fn()} />);
    expect(screen.getByRole("img", { name: "新的历史现场正在形成" })).toHaveAttribute("src", "/assets/generating-opening.webp");
    expect(screen.getByRole("heading", { name: "历史正在发生" })).toBeVisible();
    expect(screen.getByText("第 1 节点 · 新历史正在成形")).toBeVisible();
    expect(screen.queryByText(/因果推演/)).not.toBeInTheDocument();
  });

  it("uses the single-life continuation art after the immediate aftermath", () => {
    render(<GeneratingScreen chapter={6} ending={false} onCancel={vi.fn()} />);
    expect(screen.getByRole("img", { name: "同一个人的历史人生正在展开" })).toHaveAttribute("src", "/assets/generating-relay.webp");
    expect(screen.getByText("人生进入下一幕")).toBeVisible();
    expect(screen.getByTestId("developing-motion")).toBeInTheDocument();
    expect(screen.getAllByTestId("causal-pulse")).toHaveLength(4);
  });

  it("uses the 2026 convergence art for the ending", () => {
    render(<GeneratingScreen chapter={12} ending onCancel={vi.fn()} />);
    expect(screen.getByRole("img", { name: "主角死后的历史正在延伸到 2026" })).toHaveAttribute("src", "/assets/generating-2026.webp");
    expect(screen.getByText("书写身后历史")).toBeVisible();
  });

  it("shows that a player-declared result is being written into canon", () => {
    render(<GeneratingScreen chapter={2} ending={false} customAction onCancel={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "下一幕正在展开" })).toBeVisible();
    expect(screen.getByText("结果已经写入")).toBeVisible();
    expect(screen.getByText("新的局面正在形成")).toBeVisible();
    expect(screen.getByText("下一次抉择即将出现")).toBeVisible();
    expect(screen.getByText("下一幕即将开始")).toBeVisible();
    expect(screen.queryByText(/DeepSeek|传播|受益者|代价|世界正在回应/)).not.toBeInTheDocument();
  });

  it("uses player-facing waiting copy without naming the model", () => {
    render(<GeneratingScreen chapter={3} ending={false} progressStage="writing" onCancel={vi.fn()} />);
    expect(screen.getByText("新的历史现场即将出现")).toBeVisible();
    expect(screen.queryByText(/DeepSeek|完成后直接进入现场/)).not.toBeInTheDocument();
  });

  it("advances from actual model progress instead of a timer", () => {
    const { rerender } = render(<GeneratingScreen chapter={2} ending={false} progressStage="connected" onCancel={vi.fn()} />);
    const stages = screen.getAllByRole("listitem");
    expect(stages[0]).toHaveClass("is-active");

    rerender(<GeneratingScreen chapter={2} ending={false} progressStage="writing" onCancel={vi.fn()} />);
    expect(stages[0]).toHaveClass("is-complete");
    expect(stages[1]).toHaveClass("is-complete");
    expect(stages[2]).toHaveClass("is-active");
    expect(screen.getAllByTestId("developing-track-segment")[2]).toHaveClass("is-active");
  });

  it("shows a truthful repair state without returning to the first stage", () => {
    render(<GeneratingScreen chapter={2} ending={false} progressStage="repairing" onCancel={vi.fn()} />);
    expect(screen.getByText("正在整理这一页，已经发生的历史不会改变")).toBeVisible();
    expect(screen.getAllByRole("listitem")[2]).toHaveClass("is-active");
  });

  it("reveals only complete streamed scene fields while choices are still being validated", () => {
    render(
      <GeneratingScreen
        chapter={4}
        ending={false}
        progressStage="writing"
        draft={{ headline: "盐路突然断绝", narrative: "旧军令已经抬高盐价。商帮与守军正在城门争夺最后一批盐引。" }}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("盐路突然断绝")).toBeVisible();
    expect(screen.getByText("旧军令已经抬高盐价。商帮与守军正在城门争夺最后一批盐引。")).toBeVisible();
    expect(screen.getByText("场景仍在写成，完整校验后才能决定")).toBeVisible();
    expect(screen.queryByRole("button", { name: /选择/ })).not.toBeInTheDocument();
  });

  it("waits for the player after validation instead of changing screens automatically", () => {
    const onContinue = vi.fn();
    const { rerender } = render(
      <GeneratingScreen
        chapter={4}
        ending={false}
        progressStage="validating"
        ready={false}
        draft={{ headline: "盐路突然断绝", narrative: "旧军令已经抬高盐价。商帮与守军正在城门争夺最后一批盐引。" }}
        onContinue={onContinue}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "下一步" })).not.toBeInTheDocument();

    rerender(
      <GeneratingScreen
        chapter={4}
        ending={false}
        progressStage="validating"
        ready
        draft={{ headline: "盐路突然断绝", narrative: "旧军令已经抬高盐价。商帮与守军正在城门争夺最后一批盐引。" }}
        onContinue={onContinue}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("场景已经完成")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "下一步" }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("keeps the exact player-authored fact visible while its consequences are generated", () => {
    render(
      <GeneratingScreen
        chapter={5}
        ending={false}
        customAction
        customCanonText="我已经登基，并让全国工坊改造蒸汽机"
        draft={{ headline: "新帝召集百工", narrative: "登基诏书已经传遍州县。全国工坊正依照你的命令改造蒸汽机。" }}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("我已经登基，并让全国工坊改造蒸汽机")).toBeVisible();
    expect(screen.getByText("这条事实已经生效，后续只能推演它造成什么")).toBeVisible();
  });
});
