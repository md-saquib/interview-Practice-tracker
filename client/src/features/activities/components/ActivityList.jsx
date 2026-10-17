import { useNavigate } from 'react-router-dom';
import ActivityCard from './ActivityCard.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';

/**
 * ActivityList — renders a list of ActivityCards.
 *
 * @param {object}    props
 * @param {Activity[]} props.activities
 * @param {function}  props.onToggle   (id) => void
 * @param {function}  props.onDelete   (id) => void
 * @param {boolean}   [props.showEditButton]
 * @param {string}    [props.emptyMessage]
 */


export default function ActivityList({
  activities,
  onToggle,
  onDelete,
  showEditButton = true,
  emptyMessage = 'No activities yet. Start tracking your prep!',
}) {
  const navigate = useNavigate();

  if (activities.length === 0) {
    return (
      <EmptyState
        message={emptyMessage}
        ctaLabel="Add Activity"
        ctaTo="/activities/new"
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={showEditButton ? (id) => navigate(`/activities/${id}/edit`) : undefined}
        />
      ))}
    </div>
  );
}
