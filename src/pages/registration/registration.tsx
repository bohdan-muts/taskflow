import { createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { AppDispatch } from '../../store/store';
import { setUser } from '../../store/slices/authSlice';
import AuthForm from '../../components/forms/authForm';

const Registration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const registerWithEmail = async (data: { email: string; password: string }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const token = await getIdToken(userCredential.user, true);
      dispatch(setUser({ user: userCredential.user, token }));
      navigate('/login');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="registration">
      <AuthForm
        title="Registration"
        buttonText="Register"
        onSubmit={registerWithEmail}
        redirectText="Login"
        redirectLink="/login"
      />
    </div>
  );
};

export default Registration;