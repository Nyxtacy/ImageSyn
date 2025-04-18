// components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation states
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password requirements
    if (name === 'password') {
      setValidations({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[@$!%*?&]/.test(value),
        match: value === formData.confirmPassword && value !== ''
      });
    }
    
    if (name === 'confirmPassword') {
      setValidations(prev => ({
        ...prev,
        match: formData.password === value && value !== ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      const response = await API.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Store token and redirect
      localStorage.setItem('jwt', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.passwordRequirements}>
            <h4 style={styles.requirementsTitle}>Password Requirements:</h4>
            <ul style={styles.requirementsList}>
              <li style={validations.length ? styles.validRequirement : styles.invalidRequirement}>
                {validations.length ? "✓" : "○"} At least 8 characters
              </li>
              <li style={validations.uppercase ? styles.validRequirement : styles.invalidRequirement}>
                {validations.uppercase ? "✓" : "○"} At least 1 uppercase letter
              </li>
              <li style={validations.lowercase ? styles.validRequirement : styles.invalidRequirement}>
                {validations.lowercase ? "✓" : "○"} At least 1 lowercase letter
              </li>
              <li style={validations.number ? styles.validRequirement : styles.invalidRequirement}>
                {validations.number ? "✓" : "○"} At least 1 number
              </li>
              <li style={validations.special ? styles.validRequirement : styles.invalidRequirement}>
                {validations.special ? "✓" : "○"} At least 1 special character (@$!%*?&)
              </li>
              <li style={validations.match ? styles.validRequirement : styles.invalidRequirement}>
                {validations.match ? "✓" : "○"} Passwords match
              </li>
            </ul>
          </div>
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading || !Object.values(validations).every(v => v)}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div style={styles.linkContainer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    minHeight: 'calc(100vh - 250px)', // Account for navbar and padding
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1e2124',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    padding: '30px',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#b3b8c3',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #30363d',
    backgroundColor: '#2a2e33',
    color: '#e2e8f0',
    fontSize: '16px',
    width: '100%',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#7c4dff',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s ease',
  },
  linkContainer: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#b3b8c3',
  },
  link: {
    color: '#7c4dff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  error: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  passwordRequirements: {
    backgroundColor: '#272a30',
    padding: '15px',
    borderRadius: '6px',
  },
  requirementsTitle: {
    color: '#b3b8c3',
    margin: '0 0 10px 0',
    fontSize: '14px',
    fontWeight: '500',
  },
  requirementsList: {
    margin: 0,
    padding: '0 0 0 20px',
    listStyle: 'none',
  },
  validRequirement: {
    color: '#10b981',
    position: 'relative',
    marginBottom: '8px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
  },
  invalidRequirement: {
    color: '#b3b8c3',
    position: 'relative',
    marginBottom: '8px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
  }
};

export default Register;