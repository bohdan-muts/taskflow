import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavLink } from 'react-router-dom';
import { TFormData } from '../../types/types';
import { IAuthFormProps } from '../../interfaces/interfaces';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password required'),
});

const AuthForm: React.FC<IAuthFormProps> = ({ title, buttonText, onSubmit, redirectText, redirectLink, showGoogleLogin, onGoogleLogin }) => {

  const { register, handleSubmit, formState: { errors } } = useForm<TFormData>({ resolver: yupResolver(schema) });

  return (
    <section className="auth-form">
      <h2 className="title">{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" placeholder="Email" {...register('email')} style={{margin: '0 0 10px 0'}}/>
        {errors.email && <p className="error">{errors.email.message}</p>}
        <input type="password" placeholder="Password" {...register('password')} style={{margin: '0 0 10px 0'}}/>
        {errors.password && <p className="error">{errors.password.message}</p>}
        <button type="submit" className="btn">{buttonText}</button>
      </form>

      {showGoogleLogin && onGoogleLogin && (
        <button className="btn" onClick={onGoogleLogin}>Login with Google</button>
      )}

      {redirectLink && redirectText && (
        <>
          <p>Or</p>
          <NavLink className="btn" to={redirectLink}>{redirectText}</NavLink>
        </>
      )}
    </section>
  );
};

export default AuthForm;
