import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';
import { validateRegister } from '../utils/validators';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/events', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      dispatch(register(form));
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="field-error">{errors.name}</p>}

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <p className="field-error">{errors.password}</p>}

        {error && <p className="field-error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}