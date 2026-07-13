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

    await user.click(screen.getByRole("button", { name: /独自核实/ }));
    await user.click(screen.getByRole("button", { name: /隐藏模式/ }));
    await user.click(screen.getByRole("button", { name: /结构后果/ }));
    await user.click(screen.getByRole("button", { name: /临场变招/ }));

    expect(screen.getByText("INTP")).toBeVisible();
    expect(screen.getByText("因果侦探")).toBeVisible();
    expect(screen.getByText(/每幕专属行动/)).toBeVisible();
    expect(screen.getByText("三次自由改命")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /进入五十个历史瞬间/ }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ typeCode: "INTP" }));
  });
});
