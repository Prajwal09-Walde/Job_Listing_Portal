import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Menu, X, User, LayoutDashboard, LogOut, PlusCircle, Search } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-icon">
            <Briefcase size={20} />
          </div>
          <span className="logo-text">Job<span>Portal</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
          <li><Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>Browse Jobs</Link></li>
          {user?.role === 'employer' && (
            <li><Link to="/post-job" className={`nav-link ${isActive('/post-job') ? 'active' : ''}`}>Post a Job</Link></li>
          )}
          <li><Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link></li>
        </ul>

        {/* Desktop Auth */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu" onMouseLeave={() => setDropdownOpen(false)}>
              <button
                className="user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="user-menu-btn"
              >
                <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span className="role-badge">{user.role}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={15} /> My Profile
                  </Link>
                  {user.role === 'employer' && (
                    <Link to="/post-job" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <PlusCircle size={15} /> Post a Job
                    </Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" className="mobile-link" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user?.role === 'employer' && (
            <Link to="/post-job" className="mobile-link" onClick={() => setMenuOpen(false)}>Post a Job</Link>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button className="mobile-link danger-link" onClick={handleLogout}>Sign Out</button>
            </>
          )}
          {!user && (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-secondary" style={{width:'100%', justifyContent:'center'}} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
