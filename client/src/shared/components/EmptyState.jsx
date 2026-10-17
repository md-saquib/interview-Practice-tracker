import { Link } from 'react-router-dom';
import Button from './Button.jsx';

/**
 * EmptyState — shown when a list has no items.
 *
 * @param {string}  message   Primary message.
 * @param {string}  [ctaLabel] Text for the call-to-action button.
 * @param {string}  [ctaTo]   React Router `to` path for the CTA link.
 */
export default function EmptyState({ message, ctaLabel, ctaTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Simple calendar illustration */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
      </div>

      <p className="text-gray-500 text-sm mb-4">{message}</p>

      {ctaLabel && ctaTo && (
        <Link to={ctaTo}>
          <Button variant="primary">{ctaLabel}</Button>
        </Link>
      )}
    </div>
  );
}
