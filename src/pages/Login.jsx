import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';
import { validateLogin } from '../utils/validators';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const redirectTo = location.state?.from?.pathname || '/events';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      dispatch(login(form));
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <p className="field-error">{errors.password}</p>}

        {error && <p className="field-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>No account yet? <Link to="/register">Register</Link></p>
    </div>
  );
}