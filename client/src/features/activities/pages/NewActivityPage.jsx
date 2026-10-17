import { useNavigate } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities.js';
import ActivityForm from '../components/ActivityForm.jsx';

/**
 * NewActivityPage — /activities/new
 * Renders the activity creation form.
 */
export default function NewActivityPage() {
  const { addActivity } = useActivities();
  const navigate = useNavigate();

  function handleSubmit(formData) {
    addActivity(formData);
    navigate('/activities');
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">New Activity</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Log an interview preparation activity.
        </p>
      </div>
      <ActivityForm onSubmit={handleSubmit} submitLabel="Save Activity" />
    </div>
  );
}
