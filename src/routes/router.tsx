import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout (maket components)/layout';
import MainPage from '../pages/mainPage/mainPage';
import Login from '../pages/login/login';
import PrivateRoute from '../routes/privateRoute';
import Registration from '../pages/registration/registration';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute>
            <MainPage/>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/registration',
    element: <Registration/>,
  },
]);