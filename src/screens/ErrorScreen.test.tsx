import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorScreen } from "./ErrorScreen";

afterEach(cleanup);

describe("ErrorScreen", () => {
  it("makes a failed ending explicit that the four decisions are still saved", () => {
    render(
      <ErrorScreen
        error={{
          code: "invalid_structure",
          message: "AI 返回的结局结构仍不完整，请重新生成结局。",
          retry: { kind: "ending" },
        }}
        onRetry={vi.fn()}
        onRestart={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "你的四次决定都已保存" })).toBeVisible();
    expect(screen.getByRole("button", { name: "继续生成结局" })).toBeEnabled();
    expect(screen.queryByText("这条时间线还没有断")).not.toBeInTheDocument();
  });
});
