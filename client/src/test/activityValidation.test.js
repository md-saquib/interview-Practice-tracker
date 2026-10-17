import { describe, it, expect } from 'vitest';
import { validateActivity } from '../features/activities/utils/activityValidation.js';

// ─── TC-006: empty title ─────────────────────────────────────────────────────

describe('validateActivity', () => {
  it('TC-006: returns title error for whitespace-only title', () => {
    const errors = validateActivity({ title: '   ', date: '2026-10-10', category: 'DSA' });
    expect(errors.title).toBe('Title is required.');
    expect(errors.date).toBeUndefined();
  });

  it('TC-007: returns no errors for a valid activity', () => {
    const errors = validateActivity({ title: 'Practiced DP', date: '2026-10-10', category: 'DSA' });
    expect(errors).toEqual({});
  });

  it('returns title error for empty string', () => {
    const errors = validateActivity({ title: '', date: '2026-10-10', category: 'DSA' });
    expect(errors.title).toBe('Title is required.');
  });

  it('returns date error when date is missing', () => {
    const errors = validateActivity({ title: 'Practice', date: '', category: 'DSA' });
    expect(errors.date).toBe('Date is required.');
  });

  it('returns date error for invalid date format', () => {
    const errors = validateActivity({ title: 'Practice', date: '10-10-2026', category: 'DSA' });
    expect(errors.date).toBe('Please enter a valid date.');
  });

  it('returns title error for title exceeding 200 chars', () => {
    const longTitle = 'a'.repeat(201);
    const errors = validateActivity({ title: longTitle, date: '2026-10-10', category: 'DSA' });
    expect(errors.title).toBe('Title must be 200 characters or fewer.');
  });

  it('can return multiple errors simultaneously', () => {
    const errors = validateActivity({ title: '', date: '', category: 'DSA' });
    expect(errors.title).toBeDefined();
    expect(errors.date).toBeDefined();
  });
});
