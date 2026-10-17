import { Link } from 'react-router-dom';
import { useActivities } from '../../activities/hooks/useActivities.js';
import ActivityList from '../../activities/components/ActivityList.jsx';
import WeeklySummary from '../components/WeeklySummary.jsx';
import WeekNavigator from '../components/WeekNavigator.jsx';
import Button from '../../../shared/components/Button.jsx';
import { getTodayString, isSameWeek } from '../../../shared/utils/dateUtils.js';

/**
 * DashboardPage — /dashboard
 * Shows the current week's summary and activity list.
 */
export default function DashboardPage() {
  const { activities, toggleComplete, deleteActivity } = useActivities();
  const today = getTodayString();

  // Derived: filter to current week only (BR-009)
  const weekActivities = activities.filter((a) => isSameWeek(a.date, today));

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <WeekNavigator currentDate={today} />
        <Link to="/activities/new">
          <Button variant="primary" className="w-full sm:w-auto">
            + Add Activity
          </Button>
        </Link>
      </div>

      {/* Summary + list layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Weekly summary panel */}
        <aside className="lg:w-72 shrink-0">
          <WeeklySummary activities={weekActivities} />
        </aside>

        {/* Activity list */}
        <section className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            This Week's Activities
          </h2>
          <ActivityList
            activities={weekActivities}
            onToggle={toggleComplete}
            onDelete={deleteActivity}
            emptyMessage="No activities this week yet. Ready to start?"
          />
        </section>
      </div>
    </div>
  );
}
