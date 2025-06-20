import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, loading } = useSelector((state: any) => state.auth);
  return { isAuthenticated: !!user, loading };
};

export default useAuth;