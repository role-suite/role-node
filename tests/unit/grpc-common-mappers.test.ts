import { describe, expect, it } from "vitest";

import {
  mapEnumValue,
  toIsoTimestamp,
  toPagination,
} from "../../src/grpc/mappers/common.js";

describe("grpc common mappers", () => {
  it("maps valid timestamps to ISO format", () => {
    expect(toIsoTimestamp("2026-01-01T00:00:00.000Z")).toBe(
      "2026-01-01T00:00:00.000Z",
    );
  });

  it("returns empty string for invalid timestamp", () => {
    expect(toIsoTimestamp("not-a-date")).toBe("");
  });

  it("maps pagination fields with hasNext", () => {
    expect(toPagination({ limit: 10, offset: 0, total: 25 })).toEqual({
      limit: 10,
      offset: 0,
      total: 25,
      hasNext: true,
    });
  });

  it("maps enum values with fallback", () => {
    const allowed = ["owner", "admin", "member"] as const;
    expect(mapEnumValue("admin", allowed, "member")).toBe("admin");
    expect(mapEnumValue("other", allowed, "member")).toBe("member");
  });
});
