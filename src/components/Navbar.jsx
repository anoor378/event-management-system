import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/events" className="brand">EventHub</Link>
      <Link to="/events">Events</Link>
      {isAuthenticated ? (
        <>
          <Link to="/my-events">My Events</Link>
          <span className="spacer user">Hi, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="spacer">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}