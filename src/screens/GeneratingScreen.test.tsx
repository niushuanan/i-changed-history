import { act, cleanup, render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("heading", { name: "你的决定正在生效" })).toBeVisible();
    expect(screen.getByText("你的结果已成为事实")).toBeVisible();
    expect(screen.getByText("追踪改变如何扩散")).toBeVisible();
    expect(screen.getByText("写出世界的下一次回应")).toBeVisible();
    expect(screen.queryByText("核对现场可用资源")).not.toBeInTheDocument();
  });

  it("advances once and never resets completed stages while the model is still working", () => {
    vi.useFakeTimers();
    render(<GeneratingScreen chapter={2} ending={false} onCancel={vi.fn()} />);

    act(() => vi.advanceTimersByTime(3_000));
    const stages = screen.getAllByRole("listitem");
    expect(stages[0]).toHaveClass("is-complete");
    expect(stages[1]).toHaveClass("is-complete");
    expect(stages[2]).toHaveClass("is-active");

    act(() => vi.advanceTimersByTime(30_000));
    expect(stages[0]).toHaveClass("is-complete");
    expect(stages[1]).toHaveClass("is-complete");
    expect(stages[2]).toHaveClass("is-active");
    expect(screen.getAllByTestId("developing-track-segment")[2]).toHaveClass("is-active");
  });
});
