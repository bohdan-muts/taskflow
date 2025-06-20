import { useEffect } from 'react';
import { onIdTokenChanged, getIdToken, signOut } from 'firebase/auth';
import { auth, db } from './firebase/firebase';
import { useDispatch } from 'react-redux';
import { setUser, logout } from './store/slices/authSlice';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { doc, getDoc, setDoc } from "firebase/firestore";
import './styles/index.css'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser, true);
        dispatch(setUser({ user: firebaseUser, token }));
  
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email
          });
        }
  
        const timeout = setTimeout(() => {
          signOut(auth);
          dispatch(logout());
        }, 59 * 60 * 1000);
  
        return () => clearTimeout(timeout);
      } else {
        dispatch(logout());
      }
    });
  
    return () => unsubscribe();
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;