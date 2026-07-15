import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { browseHistorySeeds } from "../data/historySeeds";
import { formatHistoricalYear } from "../data/historicalYear";
import { EMPTY_FILTERS } from "../data/historyCatalog";
import type { HistorySeed } from "../game/types";
import {
  DEFAULT_PICKER_CONTEXT,
  SeedPickerScreen,
  type PickerContext,
} from "./SeedPickerScreen";

const cards = browseHistorySeeds();
const initialContext: PickerContext = {
  mode: "filmstrip",
  activeSeedId: cards[0].id,
  filters: EMPTY_FILTERS,
};

function PickerHarness({
  onSelect = vi.fn(),
  onToggleMute = vi.fn(),
  muted = false,
}: {
  onSelect?: (seed: HistorySeed) => void;
  onToggleMute?: () => void;
  muted?: boolean;
}) {
  const [context, setContext] = useState<PickerContext>(initialContext);

  return (
    <>
      <output data-testid="active-seed-id">{context.activeSeedId}</output>
      <SeedPickerScreen
        context={context}
        muted={muted}
        onContextChange={setContext}
        onSelect={onSelect}
        onToggleMute={onToggleMute}
      />
    </>
  );
}

describe("living history browser", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => cleanup());

  it("defaults to only the complete chronological one-hundred-card filmstrip", () => {
    expect(DEFAULT_PICKER_CONTEXT).toEqual(initialContext);
    render(<PickerHarness />);

    expect(screen.getByRole("button", { name: "首页设置" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu", { name: "首页设置菜单" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(100);
    expect(screen.getByText("（滑动可切换不同的历史瞬间）")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "一百个历史年份" })).toBeVisible();
    const years = screen.getAllByTestId("history-card-year").map((node) => Number(node.getAttribute("data-year")));
    expect(years).toEqual([...years].sort((left, right) => left - right));
    expect(screen.getAllByText(formatHistoricalYear(years[0])).length).toBeGreaterThan(0);
    expect(screen.queryByText(String(years[0]))).not.toBeInTheDocument();
  });

  it("uses the artistic product wordmark without the old instructional subtitle", () => {
    render(<PickerHarness />);

    const heading = screen.getByRole("heading", { level: 1, name: "哎！我改变了历史？" });
    expect(heading).toHaveClass("seed-picker__wordmark");
    expect(heading.querySelector("img")).toHaveAttribute("src", "/assets/brand/history-wordmark.png");
    expect(screen.queryByText("选择你要闯入的瞬间")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "首页设置" })).toHaveClass("picker-tool");
  });

  it("uses the selected mobile-game card anatomy without hiding the complete entry brief", () => {
    render(<PickerHarness />);

    const firstCard = screen.getAllByRole("article")[0];
    const scene = within(firstCard).getByTestId("history-card-scene");
    expect(scene.querySelectorAll("img")).toHaveLength(1);

    const yearRail = within(firstCard).getByTestId("history-card-year-rail");
    expect(yearRail).toHaveTextContent(cards[0].dateLabel);
    expect(within(yearRail).getByTestId("history-card-year-era")).toHaveTextContent(cards[0].year < 0 ? "公元前" : "公元");
    expect(within(yearRail).getByTestId("history-card-year-number")).toHaveTextContent(String(Math.abs(cards[0].year)));
    expect(within(yearRail).getByTestId("history-card-year-suffix")).toHaveTextContent("年");
    expect(within(firstCard).getByTestId("history-card-position")).toHaveTextContent(`1 / ${cards.length}`);

    const dossier = within(firstCard).getByTestId("history-card-dossier");
    expect(dossier).toHaveAttribute("aria-label", "闯入信息");
    expect(dossier).toHaveTextContent(cards[0].eventName);
    expect(dossier).toHaveTextContent(cards[0].location);
    expect(dossier).toHaveTextContent(cards[0].role);
    expect(dossier).toHaveTextContent(cards[0].decision);
    expect(dossier).toHaveTextContent(cards[0].urgency);

    const action = within(firstCard).getByTestId("history-card-action");
    expect(action).toHaveAccessibleName(`闯入这一刻：${cards[0].eventName}`);
    expect(dossier).not.toContainElement(action);
    expect(dossier.nextElementSibling).toBe(action);
  });

  it("keeps the complete positive-era calendar detail visible on its year rail", () => {
    const detailedCardIndex = cards.findIndex((seed) => (
      seed.year > 0
      && seed.dateLabel.startsWith(`${seed.year}年`)
      && seed.dateLabel !== `${seed.year}年`
    ));
    expect(detailedCardIndex).toBeGreaterThanOrEqual(0);
    render(<PickerHarness />);

    const detailedSeed = cards[detailedCardIndex];
    const year = within(screen.getAllByRole("article")[detailedCardIndex]).getByTestId("history-card-year");
    expect(year).toHaveTextContent(detailedSeed.dateLabel);
    expect(year.tagName).toBe("DIV");
    expect(year).not.toHaveAttribute("datetime");
  });

  it("consolidates filmstrip, grid, and audio into one dismissible settings menu", async () => {
    const user = userEvent.setup();
    const onToggleMute = vi.fn();
    render(<PickerHarness onToggleMute={onToggleMute} />);

    const settings = screen.getByRole("button", { name: "首页设置" });
    await user.click(settings);

    expect(settings).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "首页设置菜单" })).toBeVisible();
    expect(screen.getByRole("menuitemradio", { name: /胶片/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: /表格/ })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("menuitemcheckbox", { name: /声音/ })).toHaveAttribute("aria-checked", "true");

    const filmstripItem = screen.getByRole("menuitemradio", { name: /胶片/ });
    const gridItem = screen.getByRole("menuitemradio", { name: /表格/ });
    const audioItem = screen.getByRole("menuitemcheckbox", { name: /声音/ });
    expect(filmstripItem).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(gridItem).toHaveFocus();
    await user.keyboard("{End}");
    expect(audioItem).toHaveFocus();
    await user.keyboard("{Home}");
    expect(filmstripItem).toHaveFocus();

    await user.click(audioItem);
    expect(onToggleMute).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu", { name: "首页设置菜单" })).not.toBeInTheDocument();

    await user.click(settings);
    expect(screen.getByRole("menuitemradio", { name: /胶片/ })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(settings).toHaveAttribute("aria-expanded", "false");
    expect(settings).toHaveFocus();
    expect(screen.queryByRole("menu", { name: "首页设置菜单" })).not.toBeInTheDocument();
  });

  it("dismisses the settings menu when keyboard focus tabs away", async () => {
    const user = userEvent.setup();
    render(<PickerHarness />);

    const settings = screen.getByRole("button", { name: "首页设置" });
    await user.click(settings);
    expect(screen.getByRole("menuitemradio", { name: /胶片/ })).toHaveFocus();
    await user.tab();
    expect(screen.queryByRole("menu", { name: "首页设置菜单" })).not.toBeInTheDocument();
    expect(settings).not.toHaveFocus();

    await user.click(settings);
    expect(screen.getByRole("menuitemradio", { name: /胶片/ })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.queryByRole("menu", { name: "首页设置菜单" })).not.toBeInTheDocument();
  });

  it("keeps the eleventh item current while switching filmstrip to grid and back", async () => {
    const user = userEvent.setup();
    const target = cards[10];
    render(<PickerHarness />);

    await user.click(screen.getByRole("button", { name: `定位到${formatHistoricalYear(target.year)}` }));
    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /表格/ }));
    const currentGridCard = screen.getByRole("button", { name: new RegExp(target.eventName) });
    expect(currentGridCard).toHaveAttribute("aria-current", "true");
    expect(currentGridCard.scrollIntoView).toHaveBeenCalled();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByRole("navigation", { name: "一百个历史年份" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /胶片/ }));
    expect(screen.getByRole("button", { name: `定位到${formatHistoricalYear(target.year)}` })).toHaveAttribute("aria-current", "step");
    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);
  });

  it("synchronizes card scrolling with the stable active seed id", () => {
    render(<PickerHarness />);

    const carousel = screen.getByLabelText("按时间排列的历史瞬间");
    fireEvent.scroll(carousel, { target: { scrollLeft: 312 * 20 } });

    expect(screen.getByRole("button", { name: `定位到${formatHistoricalYear(cards[20].year)}` })).toHaveAttribute("aria-current", "step");
    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(cards[20].id);
  });

  it("preserves a clicked timeline target throughout smooth scrolling, then resumes gesture sync", async () => {
    const user = userEvent.setup();
    const target = cards.at(-1)!;
    render(<PickerHarness />);

    const carousel = screen.getByLabelText("按时间排列的历史瞬间");
    Object.defineProperty(carousel, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });

    await user.click(screen.getByRole("button", { name: `定位到${formatHistoricalYear(target.year)}` }));
    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);

    for (const intermediateIndex of [20, 60, 90]) {
      fireEvent.scroll(carousel, { target: { scrollLeft: 312 * intermediateIndex } });
      expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);
    }

    fireEvent.scroll(carousel, { target: { scrollLeft: 312 * (cards.length - 1) } });
    fireEvent.pointerDown(carousel);
    fireEvent.scroll(carousel, { target: { scrollLeft: 312 * 15 } });

    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(cards[15].id);
  });

  it("commits the exact filmstrip seed to the shared context when entering it", () => {
    const onSelect = vi.fn();
    const target = cards[1];
    render(<PickerHarness onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: `闯入这一刻：${target.eventName}` }));

    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);
    expect(onSelect).toHaveBeenCalledWith(target);
  });

  it("searches and combines time, region, and theme filters with AND", async () => {
    const user = userEvent.setup();
    render(<PickerHarness />);
    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /表格/ }));

    expect(screen.getByRole("searchbox", { name: "搜索历史瞬间" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "时间" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "地域" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "属性" })).toBeVisible();
    expect(screen.getByText("100 个结果")).toBeVisible();

    await user.type(screen.getByRole("searchbox", { name: "搜索历史瞬间" }), "马拉松");
    await user.selectOptions(screen.getByRole("combobox", { name: "时间" }), "bce");
    await user.selectOptions(screen.getByRole("combobox", { name: "地域" }), "world");
    await user.selectOptions(screen.getByRole("combobox", { name: "属性" }), "military");

    expect(screen.getByText("1 个结果")).toBeVisible();
    expect(screen.getByRole("button", { name: /马拉松战役/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: /亚历山大高加米拉/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.getByText("100 个结果")).toBeVisible();
    expect(screen.getByRole("searchbox", { name: "搜索历史瞬间" })).toHaveValue("");
    expect(screen.queryByRole("button", { name: "清除筛选" })).not.toBeInTheDocument();
  });

  it("preserves a filtered-out active seed and restores its current marker after clearing", async () => {
    const user = userEvent.setup();
    const target = cards[10];
    render(<PickerHarness />);

    await user.click(screen.getByRole("button", { name: `定位到${formatHistoricalYear(target.year)}` }));
    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /表格/ }));
    const initiallyCurrentCard = screen.getByRole("button", { name: new RegExp(target.eventName) });
    const scrollIntoView = vi.mocked(initiallyCurrentCard.scrollIntoView);
    scrollIntoView.mockClear();
    await user.type(screen.getByRole("searchbox", { name: "搜索历史瞬间" }), "不存在的历史瞬间");

    expect(screen.getByText("没有符合条件的历史瞬间")).toBeVisible();
    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);
    expect(scrollIntoView).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "清除筛选" }));

    expect(screen.getByRole("button", { name: new RegExp(target.eventName) })).toHaveAttribute("aria-current", "true");
    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("updates the active seed before selecting the exact grid item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const target = cards[12];
    render(<PickerHarness onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /表格/ }));

    await user.click(screen.getByRole("button", { name: new RegExp(target.eventName) }));

    expect(screen.getByTestId("active-seed-id")).toHaveTextContent(target.id);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(target);
  });
});
