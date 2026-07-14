import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { ChoiceList } from "./ChoiceList";

describe("historical action choices", () => {
  afterEach(() => cleanup());

  it("shows three concrete actions without personality decorations", async () => {
    const user = userEvent.setup();
    const choices = parseTimelineTurn(JSON.stringify(turnFixture)).choices;
    const onChoose = vi.fn();
    render(<ChoiceList choices={choices} onChoose={onChoose} />);

    expect(screen.queryByText(choices[0].intent)).not.toBeInTheDocument();
    expect(screen.queryByText(/人格|ENFP|INTP/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: new RegExp(choices[0].label) }));
    expect(onChoose).toHaveBeenCalledWith("A");
  });

  it("shows the full canonical decision before committing a compact long choice", async () => {
    const user = userEvent.setup();
    const canonical = "召集所有仍然忠于朝廷的边军将领公开核验军令来源并要求他们在日落之前重新宣誓效忠";
    const choices = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? {
        ...choice,
        label: canonical,
        actionSpec: {
          actor: "你",
          action: "公开核验军令",
          target: "边军将领",
          deadline: "日落前",
        },
      } : choice),
    })).choices;
    const onChoose = vi.fn();
    render(<ChoiceList choices={choices} onChoose={onChoose} />);

    await user.click(screen.getByRole("button", { name: new RegExp(canonical) }));
    expect(onChoose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "确认完整决定" })).toHaveTextContent(canonical);

    await user.click(screen.getByRole("button", { name: "执行这项决定" }));
    expect(onChoose).toHaveBeenCalledWith("A");
  });
});
