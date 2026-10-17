import { useNavigate, useParams } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities.js';
import ActivityForm from '../components/ActivityForm.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';

/**
 * EditActivityPage — /activities/:activityId/edit
 * Pre-fills ActivityForm with existing activity data.
 */
export default function EditActivityPage() {
  const { activityId } = useParams();
  const { getActivityById, updateActivity } = useActivities();
  const navigate = useNavigate();

  const activity = getActivityById(activityId);

  // Activity not found — show friendly fallback (FR-011 error case)
  if (!activity) {
    return (
      <EmptyState
        message="Activity not found. It may have been deleted."
        ctaLabel="Back to Activities"
        ctaTo="/activities"
      />
    );
  }

  function handleSubmit(formData) {
    updateActivity(activityId, formData);
    navigate('/activities');
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Edit Activity</h1>
        <p className="text-sm text-gray-500 mt-0.5">Update your activity details.</p>
      </div>
      <ActivityForm
        initialValues={activity}
        onSubmit={handleSubmit}
        submitLabel="Update Activity"
      />
    </div>
  );
}
