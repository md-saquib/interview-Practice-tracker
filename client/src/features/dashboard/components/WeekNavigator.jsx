import { formatWeekLabel } from '../../../shared/utils/dateUtils.js';

/**
 * WeekNavigator — displays the current week label.
 * (Week navigation prev/next is an optional enhancement — omitted from MVP.)
 *
 * @param {string} currentDate  "YYYY-MM-DD" reference date for the week.
 */
export default function WeekNavigator({ currentDate }) {
  const label = formatWeekLabel(currentDate);

  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          Current Week
        </p>
        <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
      </div>
    </div>
  );
}
