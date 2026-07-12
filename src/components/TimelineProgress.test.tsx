import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineProgress } from "./TimelineProgress";

describe("twelve-node progress", () => {
  it("shows all twelve nodes and the current time jump", () => {
    render(<TimelineProgress chapter={8} deviation={42} />);
    const timeline = screen.getByRole("list", { name: "十二节点时间线" });
    expect(within(timeline).getAllByRole("listitem")).toHaveLength(12);
    expect(screen.getAllByText("一百年后")[0]).toBeVisible();
    expect(within(timeline).getByText("8").closest("li")).toHaveAttribute("aria-current", "step");
  });
});
