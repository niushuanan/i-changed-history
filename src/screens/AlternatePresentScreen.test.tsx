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
});
