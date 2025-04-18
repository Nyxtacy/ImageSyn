// src/components/Login.js
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('jwt', data.token);
      navigate('/gallery', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome to ImageSyn</h2>
      <p style={styles.subtitle}>Sign in to your account</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
            required
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '35px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    backgroundColor: '#1e2124',
    color: '#e2e8f0',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#94a3b8',
    fontSize: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #2d3748',
    backgroundColor: '#2d3748',
    color: '#ffffff',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    '::placeholder': {
      color: '#64748b',
    },
    ':focus': {
      borderColor: '#6366f1',
    }
  },
  button: {
    padding: '14px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '10px',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  error: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
  },
};
