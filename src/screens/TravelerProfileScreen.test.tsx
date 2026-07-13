import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TravelerProfileScreen } from "./TravelerProfileScreen";

describe("traveler personality calibration screen", () => {
  it("starts the score on the first gesture and completes without a long form", async () => {
    const user = userEvent.setup();
    const onStartExperience = vi.fn();
    const onSubmit = vi.fn();
    render(<TravelerProfileScreen onStartExperience={onStartExperience} onSubmit={onSubmit} />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /开始人格校准/ }));
    expect(onStartExperience).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("button", { name: /独自核实|暗中布网|结成同盟|公开施压/ })).toHaveLength(4);

    await user.click(screen.getByRole("button", { name: /暗中布网/ }));
    expect(screen.getAllByRole("button", { name: /锁定物证|小范围试验|隐藏模式|全新可能/ })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: /隐藏模式/ }));
    expect(screen.getAllByRole("button", { name: /总体后果|一致规则|具体的人|建立共识/ })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: /总体后果/ }));
    expect(screen.getAllByRole("button", { name: /锁定行动顺序|阶段目标|突发变量|多条退路/ })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: /突发变量/ }));

    expect(screen.getByText("INTP")).toBeVisible();
    expect(screen.getByText("因果侦探")).toBeVisible();
    expect(screen.getByText(/每幕专属行动/)).toBeVisible();
    expect(screen.getByText("三次直接改写")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /进入五十个历史瞬间/ }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ typeCode: "INTP" }));
  });
});
