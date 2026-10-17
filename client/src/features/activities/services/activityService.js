import { STORAGE_KEY } from '../../../shared/constants/index.js';

/**
 * Load all activities from localStorage.
 * Returns an empty array on parse failure or missing key (BR-011, BR-012).
 *
 * @returns {import('./types').Activity[]}
 */
export function loadActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[activityService] Failed to parse localStorage data. Resetting.', err);
    return [];
  }
}

/**
 * Persist the full activity array to localStorage.
 * Silently catches storage errors (e.g. quota exceeded) — BR-012.
 *
 * @param {import('./types').Activity[]} activities
 */
export function saveActivities(activities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.warn('[activityService] Could not save to localStorage.', err);
  }
}
