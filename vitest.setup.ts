import { act, cleanup } from "@testing-library/react";
import { configMocks, mockIntersectionObserver } from "jsdom-testing-mocks";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// The mock never fires on its own: a test that needs entry calls `mockIntersectionObserver` itself.
// The library throws outside jsdom, and this file runs for the `node` tests too.
if (typeof window !== "undefined") {
  // Before the mock, which registers its teardown through these on the way up.
  configMocks({ beforeAll, beforeEach, afterEach, afterAll, act });
  mockIntersectionObserver();
}

afterEach(() => {
  cleanup();
});
