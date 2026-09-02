import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StreamsIndex } from "./StreamsIndex";
import { INCOME_STREAMS } from "../data/streamIndex";

describe("StreamsIndex", () => {
  it("renders the ten stream shortLabels verbatim, in stack order", () => {
    const { container } = render(<StreamsIndex />);
    const items = [...container.querySelectorAll("li")];
    expect(items.map((li) => li.textContent)).toEqual(
      INCOME_STREAMS.map((s) => s.shortLabel),
    );
  });

  it("gives each item its lighting index --i", () => {
    const { container } = render(<StreamsIndex />);
    const items = [...container.querySelectorAll<HTMLElement>("li")];
    items.forEach((li, i) => {
      expect(li.style.getPropertyValue("--i")).toBe(String(i));
    });
  });
});
