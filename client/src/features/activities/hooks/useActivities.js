import { useState } from 'react';
import { loadActivities, saveActivities } from '../services/activityService.js';
import { generateId } from '../../../shared/utils/idUtils.js';
import { getTodayString } from '../../../shared/utils/dateUtils.js';
import { DEFAULT_CATEGORY } from '../activity.constants.js';

/**
 * useActivities — central CRUD hook for the activity list.
 *
 * Initialises from localStorage once on mount. Every mutation syncs to storage.
 * Components must NOT call activityService directly.
 */
export function useActivities() {
  // Lazy initialiser: runs loadActivities only on first render.
  const [activities, setActivities] = useState(() => loadActivities());

  /** Persist a new array and update state atomically. */
  function persist(newList) {
    saveActivities(newList);
    setActivities(newList);
  }

  /**
   * Add a new activity.
   * @param {{ title: string, date: string, category: string, notes?: string }} data
   */
  function addActivity(data) {
    const newActivity = {
      id:        generateId(),
      title:     data.title.trim(),
      date:      data.date,
      category:  data.category || DEFAULT_CATEGORY,
      completed: false,
      notes:     (data.notes || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    persist([...activities, newActivity]);
    return newActivity;
  }

  /**
   * Update an existing activity by id.
   * @param {string} id
   * @param {Partial<Activity>} changes
   */
  function updateActivity(id, changes) {
    const updated = activities.map((a) =>
      a.id === id
        ? { ...a, ...changes, updatedAt: new Date().toISOString() }
        : a
    );
    persist(updated);
  }

  /**
   * Toggle the completed flag for an activity.
   * @param {string} id
   */
  function toggleComplete(id) {
    const updated = activities.map((a) =>
      a.id === id
        ? { ...a, completed: !a.completed, updatedAt: new Date().toISOString() }
        : a
    );
    persist(updated);
  }

  /**
   * Delete an activity by id.
   * @param {string} id
   */
  function deleteActivity(id) {
    persist(activities.filter((a) => a.id !== id));
  }

  /**
   * Find a single activity by id.
   * @param {string} id
   * @returns {Activity|undefined}
   */
  function getActivityById(id) {
    return activities.find((a) => a.id === id);
  }

  return {
    activities,
    addActivity,
    updateActivity,
    toggleComplete,
    deleteActivity,
    getActivityById,
  };
}
