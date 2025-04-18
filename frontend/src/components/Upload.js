// src/components/Upload.js
import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }
    setLoading(true);
    setError(null);
    const data = new FormData();
    data.append('photo', file);
    try {
      await API.post('/photos/upload', data);
      setFile(null);
      setPreview(null);
      // Success notification instead of alert
      showNotification('Image uploaded successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {notification.show && (
        <div style={notification.type === 'success' ? styles.successNotification : styles.errorNotification}>
          <div style={styles.notificationContent}>
            {notification.type === 'success' ? (
              <svg style={styles.notificationIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg style={styles.notificationIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <span style={styles.notificationText}>{notification.message}</span>
            <button 
              onClick={() => setNotification({ ...notification, show: false })} 
              style={styles.notificationClose}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <h2 style={styles.title}>Upload a New Image</h2>
      <p style={styles.subtitle}>Share your creation with the community</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.uploadArea}>
          {preview ? (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Preview" style={styles.preview} />
              <button 
                type="button" 
                onClick={() => {setFile(null); setPreview(null);}}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ) : (
            <div style={styles.dropzone}>
              <div style={styles.dropzoneContent}>
                <svg style={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p style={styles.dropzoneText}>Drag and drop your image here or click to browse</p>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                style={styles.fileInput}
                disabled={loading}
                accept="image/*"
              />
            </div>
          )}
        </div>
        
        <button type="submit" style={styles.button} disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '35px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    backgroundColor: '#1e2124',
    color: '#e2e8f0',
    position: 'relative',
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
    alignItems: 'center',
  },
  uploadArea: {
    width: '100%',
    marginBottom: '20px',
  },
  dropzone: {
    position: 'relative',
    padding: '20px',
    border: '2px dashed #4b5563',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#2d3748',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  uploadIcon: {
    color: '#8b5cf6',
    width: '48px',
    height: '48px',
    marginBottom: '16px',
  },
  dropzoneText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: '14px',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
  },
  preview: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'contain',
    maxHeight: '300px',
  },
  removeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  button: {
    padding: '14px 20px',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '10px',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
  },
  error: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    width: '100%',
  },
  // Notification styles
  successNotification: {
    position: 'absolute',
    top: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    color: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    animation: 'slideDown 0.3s ease-out forwards',
  },
  errorNotification: {
    position: 'absolute',
    top: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    animation: 'slideDown 0.3s ease-out forwards',
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
  },
  notificationIcon: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
    flexShrink: 0,
  },
  notificationText: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '500',
  },
  notificationClose: {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 5px',
  }
};

// Add animation for the notification
document.head.appendChild(document.createElement('style')).innerHTML = `
  @keyframes slideDown {
    from {
      top: -60px;
      opacity: 0;
    }
    to {
      top: 10px;
      opacity: 1;
    }
  }
`;