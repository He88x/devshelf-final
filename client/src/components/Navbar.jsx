import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <NavLink to="/resources">
        DevShelf
      </NavLink>

      <NavLink to="/resources">
        Resources
      </NavLink>

      <NavLink to="/snippets">
        Snippets
      </NavLink>

      <NavLink to="/tasks">
        Tasks
      </NavLink>

      <span>
        {user?.userName}
      </span>

      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;