import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Page from "./page";

describe("Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("Renders normally", () => {
    render(Page());

    expect(screen).toBeDefined();
  });
});
