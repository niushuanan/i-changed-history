import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { TimelineEventScreen } from "./TimelineEventScreen";

describe("clear change event screen", () => {
  afterEach(() => cleanup());

  it("shows proof of change and removes dashboard noise", () => {
    const turn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "一日余波",
      previousEcho: turnFixture.choices[1].instantEcho,
    }));
    render(<TimelineEventScreen
      turn={turn}
      deviation={18}
      lastChoiceLabel="扶植年幼继承人"
      abilityTitle="系统拆解"
      onChoose={vi.fn()}
      onExit={vi.fn()}
    />);

    expect(screen.getByText("因果回执")).toBeVisible();
    const proof = screen.getByRole("region", { name: "历史改变证据" });
    expect(within(proof).getByText(/扶植年幼继承人/)).toBeVisible();
    expect(within(proof).getByText(/摄政制度被正式确立/)).toBeVisible();
    expect(screen.getByText("DeepSeek 实时生成")).toBeVisible();
    expect(screen.queryByLabelText("世界指标")).not.toBeInTheDocument();
    expect(screen.queryByText(/意识接力：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/历史锚点：/)).not.toBeInTheDocument();
    expect(screen.getByText("微调")).toBeVisible();
    expect(screen.getByText("改制")).toBeVisible();
    expect(screen.getByText("断裂")).toBeVisible();
    expect(document.querySelectorAll(".choice-item")).toHaveLength(3);
  });
});
