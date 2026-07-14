import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { endingFixture, turnFixture } from "./test/fixtures";
import { parseAlternatePresent, parseTimelineTurn } from "./game/schema";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./game/timelinePlan";

const engine = vi.hoisted(() => ({
  generateNextTurn: vi.fn(),
  adjudicateCustomAction: vi.fn(),
  generateEnding: vi.fn(),
}));

const score = vi.hoisted(() => ({
  start: vi.fn().mockResolvedValue(true),
  stop: vi.fn(),
  setChapter: vi.fn(),
  isMuted: vi.fn(() => false),
  setMuted: vi.fn((muted: boolean) => muted),
  toggleMuted: vi.fn(() => true),
  dispose: vi.fn(),
}));

vi.mock("./game/engine", () => engine);
vi.mock("./services/audio", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./services/audio")>();
  return { ...actual, createEpicAudioController: () => score };
});
vi.mock("./services/storage", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./services/storage")>();
  return { ...actual, loadGameSnapshot: () => null, saveGameSnapshot: () => true };
});

import { App } from "./App";

function turnFor(chapter: DecisionChapter) {
  const node = getTimelineNode(chapter, 208);
  return parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    timelineName: "无王航线",
    chapter,
    chapterName: CHAPTER_NAMES[chapter],
    protagonistAge: node.protagonistAge,
    lifeStage: node.lifeStage,
    yearLabel: `第${chapter}幕纪年`,
    headline: `第${chapter}幕局势`,
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
  }));
}

function completedEnding() {
  return parseAlternatePresent(JSON.stringify({
    ...endingFixture,
    historyTimeline: endingFixture.historyTimeline.map((item) => ({
      ...item,
      playerChoice: "立刻放出第一批火船",
    })),
  }));
}

describe("complete player journey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    engine.generateNextTurn.mockImplementation(
      (_scenario, _playedTurns, chapter: Exclude<DecisionChapter, 1>) => Promise.resolve(turnFor(chapter)),
    );
    engine.generateEnding.mockResolvedValue(completedEnding());
  });

  afterEach(() => cleanup());

  it("plays one protagonist through twelve decisions, death, and a 2026 legacy report", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "哎！我改变了历史？" })).toBeVisible();
    expect(score.start).not.toHaveBeenCalled();
    expect(screen.getAllByRole("button", { name: /闯入这一刻：/ })).toHaveLength(100);
    await user.click(screen.getByRole("button", { name: "闯入这一刻：罗马大火开始蔓延" }));
    expect(score.start).toHaveBeenCalledTimes(1);

    for (let chapter = 1; chapter <= 12; chapter += 1) {
      expect(await screen.findByRole("heading", { name: chapter === 1 ? "罗马大火开始蔓延" : `第${chapter}幕局势` })).toBeVisible();
      expect(screen.getByRole("list", { name: "十二节点时间线" })).toBeVisible();
      const decisionGroup = screen.getByRole("group", { name: "本幕决定" });
      const firstChoice = decisionGroup.querySelector<HTMLButtonElement>("button.choice-action");
      expect(firstChoice).not.toBeNull();
      await user.click(firstChoice!);
      expect(screen.getByText("这件事已经发生")).toBeVisible();
      const continueButton = await screen.findByRole("button", { name: /看看接下来发生什么|查看最终历史/ });
      await waitFor(() => expect(continueButton).toBeEnabled());
      await user.click(continueButton);
    }

    expect(await screen.findByRole("heading", { name: "沈砚列传" })).toBeVisible();
    expect(screen.getByText("白话本纪")).toBeVisible();
    expect(screen.getByText("史臣曰 · 文言")).toBeVisible();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(12);
    await user.click(screen.getByRole("button", { name: "被改变的 2026" }));
    expect(screen.getByRole("heading", { name: "公议纪元" })).toBeVisible();
    expect(screen.getByLabelText("2026普通人的一天")).toHaveTextContent(endingFixture.ordinaryLife2026.join("；"));
    expect(screen.getByRole("button", { name: "保存这一页" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "再改一次历史" })).toBeEnabled();
  });

  it("unlocks the score for keyboard-first play", async () => {
    render(<App />);

    fireEvent.keyDown(screen.getByRole("heading", { name: "哎！我改变了历史？" }), { key: "Enter" });

    await waitFor(() => expect(score.start).toHaveBeenCalledTimes(1));
  });

  it("keeps free text inside the unlimited player-canon result action", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/直接改写结果/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "闯入这一刻：罗马大火开始蔓延" }));
    expect(await screen.findByText("固定历史开场")).toBeVisible();
    expect(engine.generateNextTurn).not.toHaveBeenCalled();
    expect(screen.getAllByText(/城市水道和消防队的值夜主管/).length).toBeGreaterThan(0);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /直接改写结果，不限次数/ })).toBeVisible();
  });

  it("always exposes one chronological one-hundred-moment filmstrip and exits an active run", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByText(/人格|INTP|因果侦探/)).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /闯入这一刻：/ })).toHaveLength(100);
    expect(screen.getAllByRole("button", { name: /定位到公元/ })).toHaveLength(100);
    expect(screen.queryByText(/展开全部|收回精选|为你的画像精选|换一批/)).not.toBeInTheDocument();
    const dates = screen.getAllByTestId("history-card-year").map((node) => Number(node.getAttribute("data-year")));
    expect(dates).toEqual([...dates].sort((left, right) => left - right));
    await user.click(screen.getAllByRole("button", { name: /闯入这一刻：/ })[0]);

    expect(await screen.findByRole("button", { name: "退出本次推演" })).toBeVisible();
    expect(await screen.findByText("固定历史开场")).toBeVisible();
    expect(screen.queryByText(/人格|INTP|因果侦探/)).not.toBeInTheDocument();
  });

  it("restores grid mode, query, and current seed after exiting an active run", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "网格" }));
    const search = screen.getByRole("searchbox", { name: "搜索历史瞬间" });
    await user.type(search, "罗马大火");
    const seedCard = screen.getByRole("button", { name: /罗马大火开始蔓延/ });
    await user.click(seedCard);

    expect(await screen.findByText("固定历史开场")).toBeVisible();
    expect(engine.generateNextTurn).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "退出本次推演" }));

    expect(screen.getByRole("button", { name: "网格" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("searchbox", { name: "搜索历史瞬间" })).toHaveValue("罗马大火");
    expect(screen.getByRole("button", { name: /罗马大火开始蔓延/ })).toHaveAttribute("aria-current", "true");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
