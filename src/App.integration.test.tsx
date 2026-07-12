import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { endingFixture, turnFixture } from "./test/fixtures";
import { parseAlternatePresent, parseTimelineTurn } from "./game/schema";

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

const chapterNames = ["裂缝", "余震", "新秩序", "世界线", "此刻"] as const;

function turnFor(chapter: 1 | 2 | 3 | 4 | 5) {
  return parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    timelineName: "无王航线",
    chapter,
    chapterName: chapterNames[chapter - 1],
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
      (_scenario, _playedTurns, chapter: 2 | 3 | 4 | 5) => Promise.resolve(turnFor(chapter)),
    );
    engine.generateEnding.mockResolvedValue(completedEnding());
  });

  afterEach(() => cleanup());

  it("plays five AI choices from a real card into an alternate 2026", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "哎！我改变了历史" })).toBeVisible();
    expect(screen.getAllByRole("button", { name: /改写这段历史：/ })).toHaveLength(5);
    await user.click(screen.getAllByRole("button", { name: /改写这段历史：/ })[0]);

    for (let chapter = 1; chapter <= 5; chapter += 1) {
      expect(await screen.findByRole("heading", { name: `第${chapter}幕局势` })).toBeVisible();
      await user.click(screen.getByRole("button", { name: /公开完整遗诏/ }));
      expect(await screen.findByRole("heading", { name: "蝴蝶效应" })).toBeVisible();
      expect(screen.getByText("继业者暂停争夺")).toBeVisible();
      const continueButton = await screen.findByRole("button", { name: /继续时间线|查看平行世界/ });
      await waitFor(() => expect(continueButton).toBeEnabled());
      await user.click(continueButton);
    }

    expect(await screen.findByRole("heading", { name: "公议纪元" })).toBeVisible();
    for (const detail of endingFixture.ordinaryLife2026) expect(screen.getByText(detail)).toBeVisible();
    expect(screen.getByText(/历史偏离度/)).toBeVisible();
    expect(screen.getByRole("button", { name: "保存这张头版" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "再改一次历史" })).toBeEnabled();
  });

  it("keeps rejected custom text and supports a free intervention in chapter two", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "自己写一条历史裂缝" }));
    const premise = screen.getByRole("textbox", { name: "历史裂缝" });
    await user.type(premise, "如果1966年的中国发生变化");
    await user.click(screen.getByRole("button", { name: "开始改写" }));
    expect(screen.getByText("请避开中国近现代史，换一个时间或地点。")).toBeVisible();
    expect(premise).toHaveValue("如果1966年的中国发生变化");

    await user.clear(premise);
    await user.type(premise, "如果古罗马普及蒸汽动力");
    await user.click(screen.getByRole("button", { name: "开始改写" }));
    expect(await screen.findByRole("heading", { name: "第1幕局势" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: /公开完整遗诏/ }));
    await user.click(await screen.findByRole("button", { name: "继续时间线" }));
    expect(await screen.findByRole("heading", { name: "第2幕局势" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "自己改写这一步" }));
    await user.type(screen.getByRole("textbox", { name: "本幕干预" }), "让各地城市共同保管道路税");
    await user.click(screen.getByRole("radio", { name: "改写" }));
    await user.click(screen.getByRole("button", { name: "写入时间线" }));

    expect(await screen.findByText("你的干预已写入时间线")).toBeVisible();
    await waitFor(() => expect(engine.generateNextTurn).toHaveBeenLastCalledWith(
      "如果古罗马普及蒸汽动力",
      expect.any(Array),
      3,
      expect.objectContaining({
        intervention: { text: "让各地城市共同保管道路税", deviationClass: "reform" },
      }),
    ));
  });
});
