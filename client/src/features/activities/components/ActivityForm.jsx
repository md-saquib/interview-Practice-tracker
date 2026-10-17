import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/components/Input.jsx';
import Select from '../../../shared/components/Select.jsx';
import Button from '../../../shared/components/Button.jsx';
import { CATEGORIES, DEFAULT_CATEGORY } from '../activity.constants.js';
import { validateActivity } from '../utils/activityValidation.js';
import { getTodayString } from '../../../shared/utils/dateUtils.js';

/**
 * ActivityForm — controlled form used for both create and edit flows.
 *
 * @param {object}   props
 * @param {object}   [props.initialValues]  Pre-filled values for edit mode.
 * @param {function} props.onSubmit         Called with validated form data.
 * @param {string}   [props.submitLabel]    Label for the submit button.
 */
export default function ActivityForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save Activity',
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title:    initialValues.title    ?? '',
    date:     initialValues.date     ?? getTodayString(),
    category: initialValues.category ?? DEFAULT_CATEGORY,
    notes:    initialValues.notes    ?? '',
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateActivity(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit({ ...form, title: form.title.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input
        id="title"
        name="title"
        label="Title *"
        type="text"
        placeholder="e.g. Solved 3 LeetCode mediums"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        maxLength={200}
        autoFocus
      />

      <Input
        id="date"
        name="date"
        label="Date *"
        type="date"
        value={form.date}
        onChange={handleChange}
        error={errors.date}
      />

      <Select
        id="category"
        name="category"
        label="Category"
        value={form.category}
        onChange={handleChange}
        options={categoryOptions}
        error={errors.category}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Notes <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Any reflections or resources…"
          maxLength={500}
          rows={3}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm
            text-gray-900 placeholder-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
