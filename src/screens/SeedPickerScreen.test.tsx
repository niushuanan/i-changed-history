import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { SeedPickerScreen } from "./SeedPickerScreen";

describe("living history filmstrip", () => {
  afterEach(() => cleanup());

  it("synchronizes the fifty-event rail and chronological card strip", async () => {
    const user = userEvent.setup();
    render(<SeedPickerScreen onSelect={vi.fn()} />);

    expect(screen.getAllByRole("article")).toHaveLength(50);
    expect(screen.getByText("（滑动可切换不同的历史瞬间）")).toBeVisible();
    const years = screen.getAllByTestId("history-card-year").map((node) => Number(node.getAttribute("data-year")));
    expect(years).toEqual([...years].sort((left, right) => left - right));

    await user.click(screen.getByRole("button", { name: `定位到公元 ${years[10]} 年` }));
    expect(screen.getByRole("button", { name: `定位到公元 ${years[10]} 年` })).toHaveAttribute("aria-current", "step");

    const carousel = screen.getByLabelText("按时间排列的历史瞬间");
    fireEvent.scroll(carousel, { target: { scrollLeft: 312 * 20 } });
    expect(screen.getByRole("button", { name: `定位到公元 ${years[20]} 年` })).toHaveAttribute("aria-current", "step");
  });
});
