/**
 * Pure date utilities — no React imports.
 * All date strings are in "YYYY-MM-DD" local format to avoid UTC-offset bugs.
 */

/**
 * Return today as a local "YYYY-MM-DD" string.
 */
export function getTodayString() {
  const d = new Date();
  return toDateString(d);
}

/**
 * Convert a Date object to "YYYY-MM-DD" using LOCAL time (not UTC).
 */
export function toDateString(d) {
  const year  = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a "YYYY-MM-DD" string into a LOCAL Date (avoids UTC midnight shift).
 */
export function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Return the Monday–Sunday week bounds for the given "YYYY-MM-DD" date string.
 * Week starts on Monday (BR-004).
 *
 * @param {string} dateString  "YYYY-MM-DD"
 * @returns {{ start: string, end: string }}
 */
export function getWeekBounds(dateString) {
  const date = parseDateString(dateString);
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, …, 6=Sat

  // Number of days to subtract to reach the Monday of this week
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: toDateString(monday),
    end:   toDateString(sunday),
  };
}

/**
 * Returns true if activityDateString falls within the same Mon–Sun week
 * as referenceDateString.
 *
 * @param {string} activityDateString   "YYYY-MM-DD"
 * @param {string} referenceDateString  "YYYY-MM-DD"
 */
export function isSameWeek(activityDateString, referenceDateString) {
  const bounds = getWeekBounds(referenceDateString);
  return activityDateString >= bounds.start && activityDateString <= bounds.end;
}

/**
 * Format a "YYYY-MM-DD" string into a human-readable label (e.g., "Oct 6, 2026").
 */
export function formatDateLabel(dateString) {
  const date = parseDateString(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

/**
 * Return a formatted week label, e.g. "Week of Oct 6 – Oct 12, 2026".
 */
export function formatWeekLabel(dateString) {
  const { start, end } = getWeekBounds(dateString);
  const startDate = parseDateString(start);
  const endDate   = parseDateString(end);

  const startLabel = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel   = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });

  return `Week of ${startLabel} – ${endLabel}`;
}

/**
 * Validate a date string. Returns true if it is a real YYYY-MM-DD local date.
 */
export function isValidDateString(dateString) {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = parseDateString(dateString);
  // Check that the date round-trips correctly (catches Feb 30 etc.)
  return toDateString(date) === dateString;
}
