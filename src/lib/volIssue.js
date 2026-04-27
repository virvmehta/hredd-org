import { STATIC_SETTINGS } from './staticData.js';

const ROMAN = [[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];

function toRoman(n) {
  let out = '';
  for (const [v, r] of ROMAN) { while (n >= v) { out += r; n -= v; } }
  return out || 'I';
}

function formatMonth(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
}

export function getVolLabel(settings) {
  const s = settings || STATIC_SETTINGS;
  const vol = s.vol || 'VOL I';
  const issue = s.issue || 5;
  const month = formatMonth(s.issueDate) || 'APRIL 2026';
  return `${vol} · NO ${toRoman(issue)} · ${month}`;
}

export const DEFAULT_VOL = getVolLabel(STATIC_SETTINGS);
