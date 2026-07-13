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
});
