import { isValidDateString } from '../../../shared/utils/dateUtils.js';

/**
 * Validate an activity form submission.
 *
 * @param {{ title: string, date: string, category: string }} data
 * @returns {Record<string, string>} errors — empty object means valid.
 */
export function validateActivity(data) {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required.';
  } else if (data.title.trim().length > 200) {
    errors.title = 'Title must be 200 characters or fewer.';
  }

  if (!data.date) {
    errors.date = 'Date is required.';
  } else if (!isValidDateString(data.date)) {
    errors.date = 'Please enter a valid date.';
  }

  return errors;
}
