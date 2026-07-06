/**
 * Compute the masthead volume and issue string.
 * Volume: current year minus 2025, rendered as a Roman numeral.
 * Issue: count of distinct calendar months in the current volume year
 * that contain at least one published article.
 * Date: the build month and year, upper-cased for the strip.
 * Example output: "VOL I \u00B7 NO III \u00B7 JULY 2026"
 */

function toRoman(num) {
  const table = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let out = '';
  for (const [value, glyph] of table) {
    while (num >= value) {
      out += glyph;
      num -= value;
    }
  }
  return out || 'I';
}

export function computeVolIssue(articles) {
  const now = new Date();
  const year = now.getFullYear();
  const volume = toRoman(Math.max(1, year - 2025));

  const months = new Set();
  for (const a of articles || []) {
    if (!a.publishedAt) continue;
    const d = new Date(a.publishedAt);
    if (d.getFullYear() === year) months.add(d.getMonth());
  }
  const issue = toRoman(Math.max(1, months.size));

  const dateStr = now
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    .toUpperCase();

  return `VOL ${volume} \u00B7 NO ${issue} \u00B7 ${dateStr}`;
}
