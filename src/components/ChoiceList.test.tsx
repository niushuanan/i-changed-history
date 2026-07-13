import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTimelineTurn } from "../game/schema";
import { turnFixture } from "../test/fixtures";
import { ChoiceList } from "./ChoiceList";

describe("traveler ability choices", () => {
  afterEach(() => cleanup());

  it("hides verbose intent and lets the profile preview one tailored consequence", async () => {
    const user = userEvent.setup();
    const choices = parseTimelineTurn(JSON.stringify(turnFixture)).choices;
    render(<ChoiceList choices={choices} abilityTitle="因果侦探" previewMode="system" onChoose={vi.fn()} />);

    expect(screen.queryByText(choices[0].intent)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "用因果侦探预判代价" }));
    expect(screen.getByText(/结构变化：摄政制度被正式确立/)).toBeVisible();
    expect(screen.getByText(/制度代价：宫廷派系掌握幼主/)).toBeVisible();
  });
});
