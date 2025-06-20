import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }:any) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <h1>Downloading...</h1>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;