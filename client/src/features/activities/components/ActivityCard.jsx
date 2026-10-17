import Button from '../../../shared/components/Button.jsx';
import { CATEGORY_COLORS } from '../activity.constants.js';
import { formatDateLabel } from '../../../shared/utils/dateUtils.js';

/**
 * ActivityCard — displays a single activity with toggle and delete actions.
 *
 * @param {object}   props
 * @param {Activity} props.activity
 * @param {function} props.onToggle   (id) => void
 * @param {function} props.onDelete   (id) => void
 * @param {function} [props.onEdit]   (id) => void  (optional)
 */
export default function ActivityCard({ activity, onToggle, onDelete, onEdit }) {
  const { id, title, date, category, completed, notes } = activity;

  const categoryColor =
    CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-700';

  return (
    <article
      className={`rounded-lg border p-4 shadow-sm transition-colors
        ${completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}
      aria-label={`Activity: ${title}`}
    >
      {/* Top row: status badge + category + date */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* Completion status badge — color + text (not color-only) */}
        {completed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                clipRule="evenodd"
              />
            </svg>
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 16"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-3 w-3"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" />
            </svg>
            Pending
          </span>
        )}

        {/* Category badge */}
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor}`}>
          {category}
        </span>

        {/* Date — pushed to right on larger screens */}
        <span className="ml-auto text-xs text-gray-400">{formatDateLabel(date)}</span>
      </div>

      {/* Title */}
      <p
        className={`text-sm font-semibold text-gray-900 mb-1 leading-snug
          ${completed ? 'line-through text-gray-500' : ''}`}
      >
        {title}
      </p>

      {/* Notes */}
      {notes && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notes}</p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Button
          variant={completed ? 'secondary' : 'primary'}
          className="text-xs px-3 py-1"
          onClick={() => onToggle(id)}
          aria-label={completed ? `Mark "${title}" as pending` : `Mark "${title}" as completed`}
        >
          {completed ? 'Mark Pending' : 'Mark Complete'}
        </Button>

        {onEdit && (
          <Button
            variant="ghost"
            className="text-xs px-3 py-1"
            onClick={() => onEdit(id)}
            aria-label={`Edit "${title}"`}
          >
            Edit
          </Button>
        )}

        <Button
          variant="ghost"
          className="text-xs px-3 py-1 text-red-600 hover:bg-red-50"
          onClick={() => {
            if (window.confirm(`Delete "${title}"?`)) {
              onDelete(id);
            }
          }}
          aria-label={`Delete "${title}"`}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}
