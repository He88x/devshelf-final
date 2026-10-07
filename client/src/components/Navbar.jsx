import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink
          to="/resources"
          className="brand"
          onClick={handleNavigation}
        >
          <span className="brand-mark">D</span>
          <span>DevShelf</span>
        </NavLink>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">
          Workspace
        </p>

        <nav className="sidebar-nav">
          <NavLink
            to="/resources"
            onClick={handleNavigation}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="sidebar-icon">▣</span>
            <span>Resources</span>
          </NavLink>

          <NavLink
            to="/snippets"
            onClick={handleNavigation}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="sidebar-icon">&lt;/&gt;</span>
            <span>Snippets</span>
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={handleNavigation}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <span className="sidebar-icon">✓</span>
            <span>Tasks</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.userName?.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{user?.userName}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Navbar;