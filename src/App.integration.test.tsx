import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { endingFixture, turnFixture } from "./test/fixtures";
import { parseAlternatePresent, parseTimelineTurn } from "./game/schema";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./game/timelinePlan";

const engine = vi.hoisted(() => ({
  generateNextTurn: vi.fn(),
  generateRerolledChoices: vi.fn(),
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

async function enterDrawnHistory(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "开始抽取" }));
  await user.click(screen.getByRole("button", { name: "随机抽一个开局" }));
  const entry = await screen.findByRole("button", { name: /闯入这一刻：/ });
  await user.click(entry);
}

describe("complete four-decision player journey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Math, "random").mockReturnValue(0.12);
    engine.generateNextTurn.mockImplementation(
      (_scenario, _playedTurns, chapter: Exclude<DecisionChapter, 1>) => Promise.resolve(turnFor(chapter)),
    );
    engine.generateRerolledChoices.mockResolvedValue(turnFixture.choices);
    engine.generateEnding.mockResolvedValue(completedEnding());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("introduces the complete player-facing rules on entry", () => {
    render(<App />);

    expect(screen.getByRole("dialog", { name: "抽一段历史，亲手改写它" })).toBeVisible();
    expect(screen.getByText("先抽一个历史开局")).toBeVisible();
    expect(screen.getByText("每一幕，只选一张牌")).toBeVisible();
    expect(screen.getByText("不满意，就 Roll 换牌")).toBeVisible();
    expect(screen.getByText("四次选择，走完一生")).toBeVisible();
  });

  it("plays one protagonist through four decisions, unlocks the history, and reaches 2026", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterDrawnHistory(user);

    for (let chapter = 1; chapter <= 4; chapter += 1) {
      expect(await screen.findByRole("list", { name: "四节点时间线" })).toBeVisible();
      const firstChoice = screen.getByRole("group", { name: "本幕决定" })
        .querySelector<HTMLButtonElement>("button.choice-card");
      expect(firstChoice).not.toBeNull();
      fireEvent.pointerDown(firstChoice!, { clientY: 220, pointerId: chapter });
      fireEvent.pointerMove(firstChoice!, { clientY: 120, pointerId: chapter });
      fireEvent.pointerUp(firstChoice!, { clientY: 120, pointerId: chapter });
      expect(await screen.findByText("这件事已经发生")).toBeVisible();
      const continueButton = await screen.findByRole("button", { name: /看看接下来发生什么|查看最终历史/ });
      await waitFor(() => expect(continueButton).toBeEnabled());
      await user.click(continueButton);
      if (chapter < 4) {
        expect(await screen.findByText("场景已经完成")).toBeVisible();
        await user.click(screen.getByRole("button", { name: /下一步/ }));
      }
    }

    expect(await screen.findByRole("heading", { name: "沈砚列传" })).toBeVisible();
    expect(screen.getByText("一生四决")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "被改变的 2026" }));
    expect(screen.getByRole("heading", { name: "公议纪元" })).toBeVisible();
    expect(screen.getByLabelText("2026普通人的一天")).toHaveTextContent(endingFixture.ordinaryLife2026.join("；"));

    await user.click(screen.getByRole("button", { name: "再改一次历史" }));
    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemradio", { name: /已解锁档案/ }));
    expect(screen.getByRole("heading", { name: "已解锁 1 个瞬间" })).toBeVisible();
  });

  it("uses one prepared Roll and two live AI Rolls without exposing free text", async () => {
    const user = userEvent.setup();
    render(<App />);
    await enterDrawnHistory(user);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("固定历史开场")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "重抽卡牌，还剩 3 次" }));
    expect(await screen.findByRole("button", { name: "重抽卡牌，还剩 2 次" }, { timeout: 2000 })).toBeVisible();
    expect(engine.generateRerolledChoices).not.toHaveBeenCalled();

    const secondRoll = screen.getByRole("button", { name: "重抽卡牌，还剩 2 次" });
    await waitFor(() => expect(secondRoll).toBeEnabled());
    await user.click(secondRoll);
    await waitFor(() => expect(engine.generateRerolledChoices).toHaveBeenCalledTimes(1));

    const thirdRoll = await screen.findByRole(
      "button",
      { name: "重抽卡牌，还剩 1 次" },
      { timeout: 2500 },
    );
    await waitFor(() => expect(thirdRoll).toBeEnabled());
    await user.click(thirdRoll);
    await waitFor(() => expect(engine.generateRerolledChoices).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole(
      "button",
      { name: "本节点三次重抽已经用完" },
      { timeout: 2500 },
    )).toBeDisabled();
  });

  it("keeps audio, archive, and the rules announcement in one secondary menu", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "开始抽取" }));

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: /声音/ }));
    expect(score.toggleMuted).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitem", { name: /游戏说明/ }));
    expect(screen.getByRole("dialog", { name: "抽一段历史，亲手改写它" })).toBeVisible();
  });
});
