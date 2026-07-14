import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { formatHistoricalYear } from "../data/historicalYear";
import { SeedPickerScreen } from "./SeedPickerScreen";

describe("living history filmstrip", () => {
  afterEach(() => cleanup());

  it("synchronizes the one-hundred-event rail and chronological card strip", async () => {
    const user = userEvent.setup();
    render(<SeedPickerScreen onSelect={vi.fn()} />);

    expect(screen.getAllByRole("article")).toHaveLength(100);
    expect(screen.getByText("（滑动可切换不同的历史瞬间）")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "一百个历史年份" })).toBeVisible();
    const years = screen.getAllByTestId("history-card-year").map((node) => Number(node.getAttribute("data-year")));
    expect(years).toEqual([...years].sort((left, right) => left - right));
    expect(screen.getAllByText(formatHistoricalYear(years[0])).length).toBeGreaterThan(0);
    expect(screen.queryByText(String(years[0]))).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: `定位到${formatHistoricalYear(years[10])}` }));
    expect(screen.getByRole("button", { name: `定位到${formatHistoricalYear(years[10])}` })).toHaveAttribute("aria-current", "step");

    const carousel = screen.getByLabelText("按时间排列的历史瞬间");
    fireEvent.scroll(carousel, { target: { scrollLeft: 312 * 20 } });
    expect(screen.getByRole("button", { name: `定位到${formatHistoricalYear(years[20])}` })).toHaveAttribute("aria-current", "step");
  });
});
