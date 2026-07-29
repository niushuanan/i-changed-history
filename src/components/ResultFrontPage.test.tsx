import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { alternatePresentSchema } from "../game/schema";
import { endingFixture } from "../test/fixtures";
import { ResultFrontPage } from "./ResultFrontPage";

afterEach(cleanup);

describe("ResultFrontPage", () => {
  it("shows one natural-language life story without repeating the four decisions", () => {
    const result = alternatePresentSchema.parse(endingFixture);
    render(<ResultFrontPage result={result} page="biography" />);

    expect(screen.getByText("一生纪事")).toBeVisible();
    expect(screen.getByText(result.lifeStory)).toBeVisible();
    expect(screen.queryByText("一生四决")).not.toBeInTheDocument();
    expect(screen.queryByText("史臣曰 · 文言")).not.toBeInTheDocument();
  });

  it("shows the authoritative death age only once for legacy generated places", () => {
    const result = alternatePresentSchema.parse({
      ...endingFixture,
      deathScene: {
        ...endingFixture.deathScene,
        place: `${endingFixture.deathScene.yearLabel} · ${endingFixture.deathScene.age}岁 · ${endingFixture.deathScene.place}`,
      },
    });
    render(<ResultFrontPage result={result} page="biography" />);

    expect(screen.getByText(
      `${endingFixture.deathScene.yearLabel} · ${endingFixture.deathScene.age} 岁 · ${endingFixture.deathScene.place}`,
    )).toBeVisible();
    expect(screen.queryByText(new RegExp(`${endingFixture.deathScene.age}\\s*岁.*${endingFixture.deathScene.age}\\s*岁`))).not.toBeInTheDocument();
  });

  it("renders the three ordinary-life details as one natural paragraph", () => {
    const result = alternatePresentSchema.parse(endingFixture);
    render(<ResultFrontPage result={result} page="world" />);

    const section = screen.getByRole("region", { name: "2026，普通人的一天" });
    const paragraph = within(section).getByLabelText("2026普通人的一天");
    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveTextContent(result.ordinaryLife2026.join("；"));
    expect(screen.queryByText("AI 生成 · V4 Flash")).not.toBeInTheDocument();
    expect(within(section).queryByRole("list")).not.toBeInTheDocument();
  });
});
