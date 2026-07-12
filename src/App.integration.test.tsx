import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { endingFixture, turnFixture } from "./test/fixtures";
import { parseAlternatePresent, parseTimelineTurn } from "./game/schema";
import { CHAPTER_NAMES, type DecisionChapter } from "./game/timelinePlan";

const engine = vi.hoisted(() => ({
  generateOpening: vi.fn(),
  generateNextTurn: vi.fn(),
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
  return parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    timelineName: "无王航线",
    chapter,
    chapterName: CHAPTER_NAMES[chapter],
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
      playerChoice: "公开完整遗诏",
    })),
  }));
}

describe("complete player journey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    engine.generateOpening.mockResolvedValue(turnFor(1));
    engine.generateNextTurn.mockImplementation(
      (_scenario, _playedTurns, chapter: Exclude<DecisionChapter, 1>) => Promise.resolve(turnFor(chapter)),
    );
    engine.generateEnding.mockResolvedValue(completedEnding());
  });

  afterEach(() => cleanup());

  async function completeProfile(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByRole("textbox", { name: "你的名字" }), "林舟");
    await user.click(screen.getByRole("radio", { name: "产品 / 运营" }));
    await user.click(screen.getByRole("checkbox", { name: "谈判" }));
    await user.click(screen.getByRole("checkbox", { name: "谋略" }));
    await user.click(screen.getByRole("radio", { name: /权衡/ }));
    await user.click(screen.getByRole("button", { name: /生成我的历史坐标/ }));
  }

  it("plays five AI choices from a real card into an alternate 2026", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "I！我改变了历史" })).toBeVisible();
    await completeProfile(user);
    expect(screen.getAllByRole("button", { name: /穿越到这一分钟：/ })).toHaveLength(5);
    await user.click(screen.getAllByRole("button", { name: /穿越到这一分钟：/ })[0]);

    for (let chapter = 1; chapter <= 11; chapter += 1) {
      expect(await screen.findByRole("heading", { name: `第${chapter}幕局势` })).toBeVisible();
      expect(screen.getByRole("list", { name: "十二节点时间线" })).toBeVisible();
      await user.click(screen.getByRole("button", { name: /公开完整遗诏/ }));
      expect(await screen.findByRole("heading", { name: "蝴蝶效应" })).toBeVisible();
      expect(screen.getByText("继业者暂停争夺")).toBeVisible();
      const continueButton = await screen.findByRole("button", { name: /继续时间线|查看平行世界/ });
      await waitFor(() => expect(continueButton).toBeEnabled());
      await user.click(continueButton);
    }

    expect(await screen.findByRole("heading", { name: "公议纪元" })).toBeVisible();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(11);
    for (const detail of endingFixture.ordinaryLife2026) expect(screen.getByText(detail)).toBeVisible();
    expect(screen.getByText(/历史偏离度/)).toBeVisible();
    expect(screen.getByRole("button", { name: "保存这张头版" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "再改一次历史" })).toBeEnabled();
  });

  it("matches cards from the traveler profile and exposes no free-text route", async () => {
    const user = userEvent.setup();
    render(<App />);

    await completeProfile(user);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/自己写|自由干预/)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /穿越到这一分钟：/ })[0]);
    await waitFor(() => expect(engine.generateOpening).toHaveBeenCalledWith(
      expect.objectContaining({ profile: expect.objectContaining({ name: "林舟", occupation: "product" }), seed: expect.objectContaining({ year: expect.any(Number), eventName: expect.any(String) }) }),
      expect.any(Object),
    ));
    expect(await screen.findByText("周瑜帐下负责火船的军需官")).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
