// Updated App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('jwt') ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div style={styles.pageContainer}>
      <Router>
        <div style={styles.contentWrapper}>
          <Navbar />
          <div style={styles.appContainer}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/upload"
                element={<PrivateRoute><Upload /></PrivateRoute>}
              />
              <Route
                path="/gallery"
                element={<PrivateRoute><Gallery /></PrivateRoute>}
              />
              <Route path="*" element={<Navigate to="/gallery" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#111214', // Darker background for the entire page
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    fontFamily: 'Roboto, Arial, sans-serif',
    color: '#e2e8f0',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px',
  },
  appContainer: {
    backgroundColor: '#16181c', // Darker gray box
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    minHeight: 'calc(100vh - 180px)',
    maxHeight: 'calc(100vh - 180px)',
    overflow: 'auto', // Allow scrolling
  },
};

export default App;