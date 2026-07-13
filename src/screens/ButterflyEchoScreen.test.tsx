import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EchoState } from "../game/reducer";
import { ButterflyEchoScreen } from "./ButterflyEchoScreen";

const echo: EchoState = {
  source: "ai_choice",
  choiceLabel: "暗中警告吕布有伏兵",
  directResult: "吕布勒马迟疑，勒令亲兵搜索城门两侧",
  unexpectedCost: "伏兵暴露，王允计划流产",
  beneficiary: "吕布暂时安全",
  payer: "王允及其密谋者",
  stepImpact: 3,
  nextDeviation: 3,
};

describe("decision result screen", () => {
  afterEach(() => cleanup());

  it("leads with the concrete result and uses plain readable language", () => {
    render(
      <ButterflyEchoScreen
        echo={echo}
        isFinal={false}
        onContinue={vi.fn()}
        onExit={vi.fn()}
      />,
    );

    expect(screen.getByText("这件事已经发生")).toBeVisible();
    expect(screen.getByRole("heading", { name: echo.directResult })).toBeVisible();
    expect(screen.getByText(`你刚才选择了：${echo.choiceLabel}`)).toBeVisible();
    expect(screen.getByText(`代价是：${echo.unexpectedCost}`)).toBeVisible();
    expect(screen.getByText("受益者")).toBeVisible();
    expect(screen.getByText("承担者")).toBeVisible();
    expect(screen.getByRole("button", { name: "看看接下来发生什么" })).toBeEnabled();

    expect(screen.queryByText(/因果回响|世界已回应|偏离|获益|付出|继续推演/)).not.toBeInTheDocument();
  });

  it("keeps a legacy player-authored confirmation free of invented analysis", () => {
    render(
      <ButterflyEchoScreen
        echo={{ ...echo, source: "custom_action", canonStatus: "玩家钦定", causalMechanism: "密令通过驿骑传遍各郡" }}
        isFinal
        onContinue={vi.fn()}
        onExit={vi.fn()}
      />,
    );

    expect(screen.getByText("你写下的结果已经发生")).toBeVisible();
    expect(screen.getByRole("heading", { name: echo.directResult })).toBeVisible();
    expect(screen.getByRole("button", { name: "查看最终历史" })).toBeEnabled();
    expect(screen.queryByText(/你刚才选择了|它会这样传开|代价是|受益者|承担者|玩家钦定|因果|偏离/)).not.toBeInTheDocument();
  });
});
