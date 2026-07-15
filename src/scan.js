// Pure TODO scanner — no vscode dependency, so it's unit-testable.

const DEFAULT_TAGS = ["TODO", "FIXME", "HACK", "XXX", "BUG", "NOTE"];

/**
 * Scan text for tagged comments. Tags are matched case-sensitively on a word
 * boundary (the usual all-caps convention). Returns one item per match:
 * { tag, line (0-based), col (0-based), message }.
 */
function scanText(text, tags = DEFAULT_TAGS) {
  const safe = tags.filter((t) => /^[A-Z0-9]+$/i.test(t));
  if (safe.length === 0) return [];
  const re = new RegExp(`\\b(${safe.join("|")})\\b[:\\s-]*(.*)$`);
  const out = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = re.exec(lines[i]);
    if (m) {
      out.push({
        tag: m[1],
        line: i,
        col: m.index,
        message: m[2].trim(),
      });
    }
  }
  return out;
}

function countByTag(items) {
  const counts = {};
  for (const it of items) counts[it.tag] = (counts[it.tag] || 0) + 1;
  return counts;
}

module.exports = { scanText, countByTag, DEFAULT_TAGS };
