import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { endingFixture } from "../test/fixtures";
import { alternatePresentSchema } from "../game/schema";
import { AlternatePresentScreen } from "./AlternatePresentScreen";

afterEach(cleanup);
const result = alternatePresentSchema.parse(endingFixture);

describe("alternate present export", () => {
  it("shows progress and completion while saving the front page", async () => {
    let finish: ((value: "downloaded") => void) | undefined;
    const onSave = vi.fn(() => new Promise<"downloaded">((resolve) => {
      finish = resolve;
    }));
    const user = userEvent.setup();
    render(
      <AlternatePresentScreen
        result={result}
        deviation={64}
        onSave={onSave}
        onRestart={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    expect(screen.getByRole("button", { name: "正在生成报告" })).toBeDisabled();

    finish?.("downloaded");
    expect(await screen.findByRole("button", { name: "报告已保存" })).toBeEnabled();
  });

  it("keeps the export action retryable after a render failure", async () => {
    const user = userEvent.setup();
    render(
      <AlternatePresentScreen
        result={result}
        deviation={64}
        onSave={vi.fn().mockRejectedValue(new Error("render failed"))}
        onRestart={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    expect(await screen.findByRole("status")).toHaveTextContent("报告生成失败，请重试");
    expect(screen.getByRole("button", { name: "重新保存报告" })).toBeEnabled();
  });

  it("pages between the biography and the changed 2026", async () => {
    const user = userEvent.setup();
    render(
      <AlternatePresentScreen
        result={result}
        deviation={64}
        onSave={vi.fn().mockResolvedValue("downloaded")}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText("白话本纪")).toBeVisible();
    expect(screen.getByText("史臣曰 · 文言")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "被改变的 2026" }));
    expect(screen.getByText(result.worldName)).toBeVisible();
    expect(screen.queryByText(/人格|第一反应/)).not.toBeInTheDocument();
  });

  it("renders the complete AI-authored chronicle instead of an abbreviated display copy", async () => {
    const completeNarrative = "主角死后，旧部将他留下的仓册重新抄写，地方官府把战时配给改成常设制度，商路沿线又把公开账簿变成议事凭据，普通人第一次能凭票追问粮食去向。";
    const completeResult = alternatePresentSchema.parse({
      ...endingFixture,
      posthumousChronicle: endingFixture.posthumousChronicle.map((item, index) => index === 0
        ? { ...item, narrative: completeNarrative }
        : item),
    });
    const user = userEvent.setup();
    render(
      <AlternatePresentScreen
        result={completeResult}
        deviation={64}
        onSave={vi.fn().mockResolvedValue("downloaded")}
        onRestart={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "被改变的 2026" }));
    expect(screen.getByText(completeNarrative)).toBeVisible();
  });
});
