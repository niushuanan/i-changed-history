import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatHistoricalYear } from "../data/historicalYear";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { themeForSeed } from "../data/historyCatalog";
import { VISUAL_ASSETS } from "../data/visualAssets";
import { HistoryGridCard, HISTORY_THEME_LABELS } from "./HistoryGridCard";

const sampleSeed = HISTORY_SEEDS[0];

afterEach(cleanup);

describe("HistoryGridCard", () => {
  it("renders the local image and compact history details inside one button", () => {
    render(<HistoryGridCard seed={sampleSeed} isCurrent={false} onSelect={() => undefined} />);

    const card = screen.getByRole("button", { name: new RegExp(sampleSeed.eventName) });
    const image = within(card).getByRole("img", { name: sampleSeed.eventName });

    expect(image).toHaveAttribute("src", `/assets/history/${sampleSeed.id}.webp`);
    expect(within(card).getByText(formatHistoricalYear(sampleSeed.year))).toBeInTheDocument();
    expect(within(card).getByText(sampleSeed.eventName)).toBeInTheDocument();
    expect(within(card).getByText(sampleSeed.location)).toBeInTheDocument();
    expect(within(card).getByText(HISTORY_THEME_LABELS[themeForSeed(sampleSeed)])).toBeInTheDocument();
  });

  it("passes the exact seed back when the card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<HistoryGridCard seed={sampleSeed} isCurrent={false} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: new RegExp(sampleSeed.eventName) }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(sampleSeed);
  });

  it("marks the current history item for assistive technology", () => {
    render(<HistoryGridCard seed={sampleSeed} isCurrent onSelect={() => undefined} />);

    expect(screen.getByRole("button", { name: new RegExp(sampleSeed.eventName) })).toHaveAttribute("aria-current", "true");
  });

  it("falls back to the local visual-tone asset when the history image fails", () => {
    render(<HistoryGridCard seed={sampleSeed} isCurrent={false} onSelect={() => undefined} />);
    const image = screen.getByRole("img", { name: sampleSeed.eventName });

    fireEvent.error(image);

    expect(image).toHaveAttribute("src", VISUAL_ASSETS[sampleSeed.visualTone]);
  });
});
