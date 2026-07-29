import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TimelineProgress } from "./TimelineProgress";

describe("four-node progress", () => {
  it("shows all four nodes and the current time jump", () => {
    render(<TimelineProgress chapter={3} onExit={vi.fn()} />);
    const timeline = screen.getByRole("list", { name: "四节点时间线" });
    expect(within(timeline).getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByText("人生转折")[0]).toBeVisible();
    expect(screen.queryByText(/历史改变|改写 42%|新世界线/)).not.toBeInTheDocument();
    expect(within(timeline).getByText("3").closest("li")).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "退出本次推演" }).closest(".timeline-progress")).toBeVisible();
  });
});
