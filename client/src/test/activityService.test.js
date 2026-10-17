import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadActivities, saveActivities } from '../features/activities/services/activityService.js';
import { STORAGE_KEY } from '../shared/constants/index.js';

describe('activityService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // TC-010: empty storage
  it('TC-010: loadActivities returns [] when storage is empty', () => {
    const result = loadActivities();
    expect(result).toEqual([]);
  });

  // TC-008: valid JSON array
  it('TC-008: loadActivities returns parsed array for valid JSON', () => {
    const fixture = [{ id: '1', title: 'Test', date: '2026-10-10', category: 'DSA', completed: false }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fixture));
    const result = loadActivities();
    expect(result).toEqual(fixture);
  });

  // TC-009: malformed JSON
  it('TC-009: loadActivities returns [] for malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = loadActivities();
    expect(result).toEqual([]);
    warnSpy.mockRestore();
  });

  it('loadActivities returns [] when stored value is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ wrong: true }));
    const result = loadActivities();
    expect(result).toEqual([]);
  });

  it('saveActivities persists the array to localStorage', () => {
    const activities = [{ id: '1', title: 'Test' }];
    saveActivities(activities);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(raw)).toEqual(activities);
  });

  it('saveActivities does not throw when localStorage is unavailable', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => saveActivities([{ id: '1' }])).not.toThrow();
    setItemSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
