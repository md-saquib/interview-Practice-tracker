import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities.js';
import ActivityList from '../components/ActivityList.jsx';
import Button from '../../../shared/components/Button.jsx';

const FILTERS = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

/**
 * ActivitiesPage — /activities
 * Shows all activities with status filter tabs.
 */
export default function ActivitiesPage() {
  const { activities, toggleComplete, deleteActivity } = useActivities();
  const [filter, setFilter] = useState('all');

  const filtered = activities.filter((a) => {
    if (filter === 'completed') return a.completed;
    if (filter === 'pending')   return !a.completed;
    return true;
  });

  // Sort: most recently created first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Activities</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'} total
          </p>
        </div>
        <Link to="/activities/new">
          <Button variant="primary" className="w-full sm:w-auto">
            + New Activity
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-md
              ${filter === f.value
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <ActivityList
        activities={sorted}
        onToggle={toggleComplete}
        onDelete={deleteActivity}
        emptyMessage={
          filter === 'all'
            ? 'No activities yet. Start tracking your prep!'
            : `No ${filter} activities.`
        }
      />
    </div>
  );
}
