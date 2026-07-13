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
        playerResult={result}
        instinctResult={{ ...result, worldName: "本能纪元" }}
        playerDeviation={64}
        instinctDeviation={51}
        onSave={onSave}
        onRestart={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "保存历史报告" }));
    expect(screen.getByRole("button", { name: "正在生成报告" })).toBeDisabled();

    finish?.("downloaded");
    expect(await screen.findByRole("button", { name: "报告已保存" })).toBeEnabled();
  });

  it("keeps the export action retryable after a render failure", async () => {
    const user = userEvent.setup();
    render(
      <AlternatePresentScreen
        playerResult={result}
        instinctResult={{ ...result, worldName: "本能纪元" }}
        playerDeviation={64}
        instinctDeviation={51}
        onSave={vi.fn().mockRejectedValue(new Error("render failed"))}
        onRestart={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "保存历史报告" }));
    expect(await screen.findByRole("status")).toHaveTextContent("报告生成失败，请重试");
    expect(screen.getByRole("button", { name: "重新保存报告" })).toBeEnabled();
  });

  it("pages between the player's world and the profile-instinct world", async () => {
    const user = userEvent.setup();
    render(
      <AlternatePresentScreen
        playerResult={result}
        instinctResult={{ ...result, worldName: "本能纪元" }}
        playerDeviation={64}
        instinctDeviation={51}
        onSave={vi.fn().mockResolvedValue("downloaded")}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByText(result.worldName)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "如果你始终听从第一反应" }));
    expect(screen.getByText("本能纪元")).toBeVisible();
  });
});
