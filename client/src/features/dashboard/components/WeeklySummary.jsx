/**
 * WeeklySummary — derives and displays completion stats.
 * Values are computed from the activities prop (BR-009) — never stored separately.
 *
 * @param {Activity[]} activities  Already filtered to the current week.
 */
export default function WeeklySummary({ activities }) {
  const total     = activities.length;
  const completed = activities.filter((a) => a.completed).length;
  const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Weekly Progress
      </h3>

      {/* Stat grid */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <Stat label="Total" value={total} />
        <Stat label="Done" value={completed} highlight />
        <Stat label="Pending" value={total - completed} />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Completion</span>
          <span aria-live="polite">{pct}%</span>
        </div>
        <div
          className="h-2.5 w-full rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of this week's activities completed`}
        >
          <div
            className="h-2.5 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight = false }) {
  return (
    <div className="text-center">
      <p
        className={`text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
