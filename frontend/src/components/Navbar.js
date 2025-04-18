// Updated Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('jwt');
  
  const logout = () => {
    localStorage.removeItem('jwt');
    navigate('/login', { replace: true });
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate(isLoggedIn ? '/gallery' : '/login', { replace: true })}>
        <span style={styles.logo}>ImageSyn</span>
      </div>
      <div style={styles.navLinks}>
        {isLoggedIn ? (
          <>
            <Link to="/gallery" style={styles.link}>Gallery</Link>
            <Link to="/upload" style={styles.link}>Upload</Link>
            <button onClick={logout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.buttonLink}>Login</Link>
            <Link to="/register" style={styles.buttonLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1d21',
    padding: '15px 30px',
    borderRadius: '8px',
    marginBottom: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  brand: {
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  logo: {
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#e2e8f0',
    textDecoration: 'none',
    margin: '0 16px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#8b5cf6',
    }
  },
  button: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  buttonLink: {
    backgroundColor: '#6366f1',
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    marginLeft: '12px',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};