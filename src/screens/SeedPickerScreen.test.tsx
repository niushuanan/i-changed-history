import { useState } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_GROUPS } from "../data/historyGroups";
import type { HistorySeed } from "../game/types";
import {
  unlockHistoryGroup,
  type UnlockProgress,
} from "../services/unlockProgress";
import {
  DEFAULT_PICKER_CONTEXT,
  SeedPickerScreen,
  type PickerContext,
} from "./SeedPickerScreen";

const EMPTY_PROGRESS: UnlockProgress = {
  unlockedGroups: [],
  completedSeeds: [],
  tokens: 0,
};

function PickerHarness({
  initialProgress = EMPTY_PROGRESS,
  onSelect = vi.fn(),
  onUnlock = vi.fn(),
  onShowAnnouncement = vi.fn(),
  onToggleMute = vi.fn(),
}: {
  initialProgress?: UnlockProgress;
  onSelect?: (seed: HistorySeed) => void;
  onUnlock?: (groupId: string) => void;
  onShowAnnouncement?: () => void;
  onToggleMute?: () => void;
}) {
  const [context, setContext] = useState<PickerContext>(DEFAULT_PICKER_CONTEXT);
  const [progress, setProgress] = useState(initialProgress);
  const unlock = (groupId: string) => {
    const change = unlockHistoryGroup(progress, groupId);
    if (change.changed) {
      setProgress(change.progress);
      onUnlock(groupId);
    }
    return change.changed;
  };

  return (
    <>
      <output data-testid="picker-mode">{context.mode}</output>
      <output data-testid="active-group-id">{context.activeGroupId}</output>
      <SeedPickerScreen
        context={context}
        muted={false}
        unlockedGroupIds={progress.unlockedGroups}
        completedSeedIds={progress.completedSeeds}
        tokens={progress.tokens}
        onContextChange={setContext}
        onSelect={onSelect}
        onUnlockGroup={unlock}
        onShowAnnouncement={onShowAnnouncement}
        onToggleMute={onToggleMute}
      />
    </>
  );
}

describe("group unlock history entry", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("starts with thirteen locked groups and lets the player choose one free starting group", async () => {
    const user = userEvent.setup();
    const onUnlock = vi.fn();
    render(<PickerHarness onUnlock={onUnlock} />);

    expect(screen.getByRole("heading", { name: "哎！我改变了历史？" })).toBeVisible();
    expect(screen.getByLabelText("本作品包含人工智能生成内容")).toHaveTextContent("AI生成");
    expect(screen.getByRole("heading", { name: "先选一段你熟悉的历史" })).toBeVisible();
    expect(screen.getAllByRole("button", { name: /免费解锁剧本组/ })).toHaveLength(13);
    expect(screen.getByText("100 个真实转折点 · 13 个剧本组")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "免费解锁剧本组：三国" }));

    expect(onUnlock).toHaveBeenCalledWith("three-kingdoms");
    expect(screen.getByTestId("picker-mode")).toHaveTextContent("seeds");
    expect(screen.getByTestId("active-group-id")).toHaveTextContent("three-kingdoms");
    expect(screen.getByRole("heading", { name: "三国" })).toBeVisible();
    expect(screen.getByText(/《三国》已经解锁/)).toHaveAttribute("role", "status");
    expect(screen.getAllByRole("button", { name: /闯入：/ })).toHaveLength(8);
  });

  it("opens an unlocked group while keeping other groups disabled without a token", async () => {
    const user = userEvent.setup();
    const firstGroup = HISTORY_GROUPS[0];
    render(<PickerHarness initialProgress={{
      unlockedGroups: [firstGroup.id],
      completedSeeds: [],
      tokens: 0,
    }} />);

    expect(screen.getByRole("button", { name: `打开剧本组：${firstGroup.name}` })).toBeEnabled();
    expect(screen.getByRole("button", { name: "剧本组尚未解锁：秦汉" })).toBeDisabled();
    expect(screen.getAllByRole("button", { name: /剧本组尚未解锁/ })).toHaveLength(12);

    await user.click(screen.getByRole("button", { name: `打开剧本组：${firstGroup.name}` }));
    expect(screen.getByRole("heading", { name: firstGroup.name })).toBeVisible();
    expect(screen.getAllByRole("button", { name: /闯入：/ })).toHaveLength(firstGroup.seedIds.length);
  });

  it("spends one token, enters the chosen group, and exposes only that group's histories", async () => {
    const user = userEvent.setup();
    const firstGroup = HISTORY_GROUPS[0];
    const nextGroup = HISTORY_GROUPS[1];
    render(<PickerHarness initialProgress={{
      unlockedGroups: [firstGroup.id],
      completedSeeds: [],
      tokens: 1,
    }} />);

    await user.click(screen.getByRole("button", {
      name: `消耗 1 枚代币解锁剧本组：${nextGroup.name}`,
    }));

    expect(screen.getByRole("heading", { name: nextGroup.name })).toBeVisible();
    expect(screen.getByText("解锁代币 0")).toBeVisible();
    expect(screen.getAllByRole("button", { name: /闯入：/ })).toHaveLength(nextGroup.seedIds.length);
    expect(screen.queryByText(HISTORY_GROUPS[2].description)).not.toBeInTheDocument();
  });

  it("shows completed progress and keeps completed histories replayable", async () => {
    const user = userEvent.setup();
    const group = HISTORY_GROUPS[2];
    const completedSeedId = group.seedIds[0];
    const onSelect = vi.fn();
    render(<PickerHarness
      initialProgress={{
        unlockedGroups: [group.id],
        completedSeeds: [completedSeedId],
        tokens: 1,
      }}
      onSelect={onSelect}
    />);

    const groupButton = screen.getByRole("button", { name: `打开剧本组：${group.name}` });
    expect(within(groupButton).getByText(`1 / ${group.seedIds.length} 已通关`)).toBeVisible();
    await user.click(groupButton);

    const replay = screen.getByRole("button", {
      name: new RegExp(`再次闯入：`),
    });
    expect(replay).toHaveTextContent("已通关 · 再次闯入");
    await user.click(replay);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: completedSeedId }));
  });

  it("keeps audio and player-facing rules in the secondary settings menu", async () => {
    const user = userEvent.setup();
    const onToggleMute = vi.fn();
    const onShowAnnouncement = vi.fn();
    render(
      <PickerHarness
        onToggleMute={onToggleMute}
        onShowAnnouncement={onShowAnnouncement}
      />,
    );

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitem", { name: /游戏说明/ }));
    expect(onShowAnnouncement).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "首页设置" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: /声音/ }));
    expect(onToggleMute).toHaveBeenCalledOnce();
  });
});
