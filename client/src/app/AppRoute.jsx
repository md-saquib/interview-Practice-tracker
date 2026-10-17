import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';
import ActivitiesPage from '../features/activities/pages/ActivitiesPage.jsx';
import NewActivityPage from '../features/activities/pages/NewActivityPage.jsx';
import EditActivityPage from '../features/activities/pages/EditActivityPage.jsx';
import NotFound from '../shared/components/NotFound.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'activities',
        element: <ActivitiesPage />,
      },
      {
        path: 'activities/new',
        element: <NewActivityPage />,
      },
      {
        path: 'activities/:activityId/edit',
        element: <EditActivityPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);


const AppRoute = () => {
  
  return <RouterProvider router={router} />
}

export default AppRoute 
