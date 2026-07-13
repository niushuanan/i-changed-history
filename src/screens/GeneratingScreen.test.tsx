import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GeneratingScreen } from "./GeneratingScreen";

describe("history developing room", () => {
  afterEach(() => cleanup());
  it("uses the opening archive art for early nodes", () => {
    render(<GeneratingScreen chapter={1} ending={false} onCancel={vi.fn()} />);
    expect(screen.getByRole("img", { name: "历史现场正在显影" })).toHaveAttribute("src", "/assets/generating-opening.webp");
    expect(screen.getByRole("heading", { name: "历史显影室" })).toBeVisible();
  });

  it("uses the social relay art after the immediate aftermath", () => {
    render(<GeneratingScreen chapter={6} ending={false} onCancel={vi.fn()} />);
    expect(screen.getByRole("img", { name: "历史因果正在接力" })).toHaveAttribute("src", "/assets/generating-relay.webp");
    expect(screen.getByText("寻找意外落点")).toBeVisible();
    expect(screen.getByTestId("developing-motion")).toBeInTheDocument();
    expect(screen.getAllByTestId("causal-pulse")).toHaveLength(4);
  });

  it("uses the 2026 convergence art for the ending", () => {
    render(<GeneratingScreen chapter={11} ending onCancel={vi.fn()} />);
    expect(screen.getByRole("img", { name: "平行世界正在汇入 2026" })).toHaveAttribute("src", "/assets/generating-2026.webp");
    expect(screen.getByText("汇入 2026")).toBeVisible();
  });

  it("shows that a player-declared result is being written into canon", () => {
    render(<GeneratingScreen chapter={2} ending={false} customAction onCancel={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "写入新正史" })).toBeVisible();
    expect(screen.getByText("锁定玩家钦定结果")).toBeVisible();
    expect(screen.getByText("寻找因果传播媒介")).toBeVisible();
    expect(screen.getByText("计算受益者与隐藏代价")).toBeVisible();
    expect(screen.queryByText("核对现场可用资源")).not.toBeInTheDocument();
  });
});
