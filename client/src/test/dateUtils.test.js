import { describe, it, expect } from 'vitest';
import {
  getWeekBounds,
  isSameWeek,
  isValidDateString,
  formatWeekLabel,
  getTodayString,
  toDateString,
} from '../shared/utils/dateUtils.js';

// ─── getWeekBounds ───────────────────────────────────────────────────────────

describe('getWeekBounds', () => {
  it('TC-001: Monday input returns Mon–Sun of same week', () => {
    // 2026-10-12 is a Monday
    const result = getWeekBounds('2026-10-12');
    expect(result).toEqual({ start: '2026-10-12', end: '2026-10-18' });
  });

  it('TC-002: Sunday input returns the Mon–Sun that contains it', () => {
    // 2026-10-11 is a Sunday — belongs to Mon Oct 5 – Sun Oct 11 week
    const result = getWeekBounds('2026-10-11');
    expect(result).toEqual({ start: '2026-10-05', end: '2026-10-11' });
  });

  it('TC-003: year boundary — 2027-01-01 (Friday)', () => {
    const result = getWeekBounds('2027-01-01');
    expect(result).toEqual({ start: '2026-12-28', end: '2027-01-03' });
  });

  it('handles a Wednesday mid-week', () => {
    // 2026-10-14 is a Wednesday
    const result = getWeekBounds('2026-10-14');
    expect(result).toEqual({ start: '2026-10-12', end: '2026-10-18' });
  });

  it('handles month-end overflow (Oct 31 Saturday)', () => {
    // Oct 31 2026 is a Saturday; Mon of that week is Oct 26
    const result = getWeekBounds('2026-10-31');
    expect(result).toEqual({ start: '2026-10-26', end: '2026-11-01' });
  });
});

// ─── isSameWeek ──────────────────────────────────────────────────────────────

describe('isSameWeek', () => {
  it('TC-004: activity on same day as reference returns true', () => {
    expect(isSameWeek('2026-10-10', '2026-10-10')).toBe(true);
  });

  it('TC-005: activity from previous week returns false', () => {
    // Oct 4 is a Sunday, belongs to the week Mon Sep 28 – Sun Oct 4
    expect(isSameWeek('2026-10-04', '2026-10-10')).toBe(false);
  });

  it('returns true for Monday of the same week', () => {
    expect(isSameWeek('2026-10-05', '2026-10-10')).toBe(true);
  });

  it('returns true for Sunday of the same week', () => {
    expect(isSameWeek('2026-10-11', '2026-10-10')).toBe(true);
  });

  it('returns false for the next week', () => {
    expect(isSameWeek('2026-10-12', '2026-10-10')).toBe(false);
  });
});

// ─── isValidDateString ───────────────────────────────────────────────────────

describe('isValidDateString', () => {
  it('returns true for a valid date', () => {
    expect(isValidDateString('2026-10-10')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidDateString('')).toBe(false);
  });

  it('returns false for invalid format', () => {
    expect(isValidDateString('10-10-2026')).toBe(false);
  });

  it('returns false for Feb 30', () => {
    expect(isValidDateString('2026-02-30')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidDateString(undefined)).toBe(false);
  });
});

// ─── getTodayString ──────────────────────────────────────────────────────────

describe('getTodayString', () => {
  it('returns a valid YYYY-MM-DD string', () => {
    const result = getTodayString();
    expect(isValidDateString(result)).toBe(true);
  });
});
