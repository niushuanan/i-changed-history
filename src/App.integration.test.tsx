import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { endingFixture, turnFixture } from "./test/fixtures";
import { parseAlternatePresent, parseTimelineTurn } from "./game/schema";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./game/timelinePlan";

const engine = vi.hoisted(() => ({
  generateOpening: vi.fn(),
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
    engine.generateOpening.mockResolvedValue(turnFor(1));
    engine.generateNextTurn.mockImplementation(
      (_scenario, _playedTurns, chapter: Exclude<DecisionChapter, 1>) => Promise.resolve(turnFor(chapter)),
    );
    engine.generateEnding.mockResolvedValue(completedEnding());
  });

  afterEach(() => cleanup());

  async function completeProfile(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole("button", { name: /开始人格校准/ }));
    await user.click(screen.getByRole("button", { name: /暗中布网/ }));
    await user.click(screen.getByRole("button", { name: /隐藏模式/ }));
    await user.click(screen.getByRole("button", { name: /总体后果/ }));
    await user.click(screen.getByRole("button", { name: /突发变量/ }));
    await user.click(screen.getByRole("button", { name: /进入五十个历史瞬间/ }));
  }

  it("plays one protagonist through twelve decisions, death, and a 2026 legacy report", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "I！我改变了历史" })).toBeVisible();
    expect(score.start).not.toHaveBeenCalled();
    await completeProfile(user);
    expect(score.start).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("button", { name: /闯入这一刻：/ })).toHaveLength(50);
    await user.click(screen.getAllByRole("button", { name: /闯入这一刻：/ })[0]);

    for (let chapter = 1; chapter <= 12; chapter += 1) {
      expect(await screen.findByRole("heading", { name: `第${chapter}幕局势` })).toBeVisible();
      expect(screen.getByRole("list", { name: "十二节点时间线" })).toBeVisible();
      await user.click(screen.getByRole("button", { name: /立刻放出第一批火船/ }));
      expect(await screen.findByRole("heading", { name: "世界已回应" })).toBeVisible();
      expect(screen.getByText("曹军左翼提前起火")).toBeVisible();
      const continueButton = await screen.findByRole("button", { name: /继续推演|查看平行世界/ });
      await waitFor(() => expect(continueButton).toBeEnabled());
      await user.click(continueButton);
    }

    expect(await screen.findByRole("heading", { name: "公议纪元" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "沈砚，70 岁" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "他死以后" })).toBeVisible();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(12);
    for (const detail of endingFixture.ordinaryLife2026) expect(screen.getByText(detail)).toBeVisible();
    expect(screen.getByText(/历史偏离度/)).toBeVisible();
    expect(screen.getByRole("button", { name: "保存历史报告" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "再改一次历史" })).toBeEnabled();
  });

  it("unlocks the score for keyboard-first play", async () => {
    render(<App />);

    fireEvent.keyDown(screen.getByRole("heading", { name: "I！我改变了历史" }), { key: "Enter" });

    await waitFor(() => expect(score.start).toHaveBeenCalledTimes(1));
  });

  it("keeps free text inside the three-use player-canon result action", async () => {
    const user = userEvent.setup();
    render(<App />);

    await completeProfile(user);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText(/直接改写结果/)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: /闯入这一刻：/ })[0]);
    await waitFor(() => expect(engine.generateOpening).toHaveBeenCalledWith(
      expect.objectContaining({ profile: expect.objectContaining({ name: "因果侦探", typeCode: "INTP" }), seed: expect.objectContaining({ year: expect.any(Number), eventName: expect.any(String) }) }),
      expect.any(Object),
    ));
    expect(await screen.findByText(/周瑜帐下负责火船的军需官/)).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /直接改写结果，剩余 3 次/ })).toBeVisible();
  });

  it("always exposes one chronological fifty-moment filmstrip and exits an active run", async () => {
    const user = userEvent.setup();
    render(<App />);

    await completeProfile(user);
    expect(screen.getByText("另一种你 · 已就绪")).toBeVisible();
    expect(screen.queryByText(/INTP|因果侦探/)).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /闯入这一刻：/ })).toHaveLength(50);
    expect(screen.getAllByRole("button", { name: /定位到公元/ })).toHaveLength(50);
    expect(screen.queryByText(/展开全部|收回精选|为你的画像精选|换一批/)).not.toBeInTheDocument();
    const dates = screen.getAllByTestId("history-card-year").map((node) => Number(node.getAttribute("data-year")));
    expect(dates).toEqual([...dates].sort((left, right) => left - right));
    await user.click(screen.getAllByRole("button", { name: /闯入这一刻：/ })[0]);

    expect(await screen.findByRole("button", { name: "退出本次推演" })).toBeVisible();
    expect(await screen.findByText("DeepSeek 实时生成")).toBeVisible();
    expect(screen.queryByText(/INTP|因果侦探/)).not.toBeInTheDocument();
  });
});
