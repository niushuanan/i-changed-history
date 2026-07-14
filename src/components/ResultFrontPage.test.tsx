import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { alternatePresentSchema } from "../game/schema";
import { endingFixture } from "../test/fixtures";
import { ResultFrontPage } from "./ResultFrontPage";

afterEach(cleanup);

describe("ResultFrontPage", () => {
  it("renders the three ordinary-life details as one natural paragraph", () => {
    const result = alternatePresentSchema.parse(endingFixture);
    render(<ResultFrontPage result={result} page="world" />);

    const section = screen.getByRole("region", { name: "2026，普通人的一天" });
    const paragraph = within(section).getByLabelText("2026普通人的一天");
    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveTextContent(result.ordinaryLife2026.join("；"));
    expect(within(section).queryByRole("list")).not.toBeInTheDocument();
  });
});
