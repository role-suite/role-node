import { afterEach, describe, expect, it, vi } from "vitest";

import { logger } from "../../src/shared/logger.js";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes info messages to console.log", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logger.info("test-info", { value: 1 });

    expect(logSpy).toHaveBeenCalledOnce();
    expect(logSpy.mock.calls[0][0]).toContain('"level":"info"');
    expect(logSpy.mock.calls[0][0]).toContain('"message":"test-info"');
  });

  it("writes error messages to console.error", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logger.error("test-error", { value: 2 });

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toContain('"level":"error"');
    expect(errorSpy.mock.calls[0][0]).toContain('"message":"test-error"');
  });
});
