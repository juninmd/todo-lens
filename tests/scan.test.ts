import { test, expect } from "bun:test";
import { scanText, countByTag, DEFAULT_TAGS } from "../src/scan.js";

const SAMPLE = `function x() {
  // TODO: refactor this mess
  const y = 1; // FIXME broken on empty input
  return y; // just a note, not a NOTE tag inline
}
// HACK - temporary
`;

test("scanText finds tagged lines with correct line numbers", () => {
  const items = scanText(SAMPLE);
  const tags = items.map((i) => i.tag);
  expect(tags).toContain("TODO");
  expect(tags).toContain("FIXME");
  expect(tags).toContain("HACK");
  const todo = items.find((i) => i.tag === "TODO");
  expect(todo.line).toBe(1);
  expect(todo.message).toBe("refactor this mess");
});

test("scanText is case-sensitive on tags (ignores lowercase 'note')", () => {
  const items = scanText("// this is a note about stuff\n// NOTE real one");
  expect(items.length).toBe(1);
  expect(items[0].tag).toBe("NOTE");
});

test("scanText respects a custom tag set", () => {
  const items = scanText("// REVIEW check this\n// TODO nope", ["REVIEW"]);
  expect(items.length).toBe(1);
  expect(items[0].tag).toBe("REVIEW");
});

test("scanText handles no matches and empty tags", () => {
  expect(scanText("nothing here").length).toBe(0);
  expect(scanText("// TODO x", []).length).toBe(0);
});

test("countByTag aggregates", () => {
  const items = scanText("// TODO a\n// TODO b\n// BUG c");
  expect(countByTag(items)).toEqual({ TODO: 2, BUG: 1 });
});

test("DEFAULT_TAGS exported", () => {
  expect(DEFAULT_TAGS).toContain("FIXME");
});
