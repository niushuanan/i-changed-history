import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import type { TravelerProfile } from "../game/types";
import { SeedPickerScreen } from "./SeedPickerScreen";
import { buildTravelerProfile } from "../game/profile";

const profile: TravelerProfile = buildTravelerProfile({ energy: "E", perception: "N", judgment: "T", tactics: "J" });

describe("living history filmstrip", () => {
  afterEach(() => cleanup());

  it("synchronizes the fifty-event rail and chronological card strip", async () => {
    const user = userEvent.setup();
    render(<SeedPickerScreen onSelect={vi.fn()} onChangeProfile={vi.fn()} profile={profile} />);

    expect(screen.getAllByRole("article")).toHaveLength(50);
    const years = screen.getAllByTestId("history-card-year").map((node) => Number(node.getAttribute("data-year")));
    expect(years).toEqual([...years].sort((left, right) => left - right));

    await user.click(screen.getByRole("button", { name: `定位到公元 ${years[10]} 年` }));
    expect(screen.getByRole("button", { name: `定位到公元 ${years[10]} 年` })).toHaveAttribute("aria-current", "step");

    const carousel = screen.getByLabelText("按时间排列的历史瞬间");
    fireEvent.scroll(carousel, { target: { scrollLeft: 344 * 20 } });
    expect(screen.getByRole("button", { name: `定位到公元 ${years[20]} 年` })).toHaveAttribute("aria-current", "step");
  });
});
