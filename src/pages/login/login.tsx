import { signInWithPopup, signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { setUser } from '../../store/slices/authSlice';
import AuthForm from '../../components/forms/authForm';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loginWithEmail = async (data: { email: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await getIdToken(userCredential.user, true);
      dispatch(setUser({ user: userCredential.user, token }));
      navigate('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login">
      <AuthForm
        title="Login"
        buttonText="Login"
        onSubmit={loginWithEmail}
        showGoogleLogin
        onGoogleLogin={loginWithGoogle}
        redirectText="Registration"
        redirectLink="/registration"
      />
    </div>
  );
};

export default Login;
