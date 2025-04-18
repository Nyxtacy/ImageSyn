// components/Gallery.js
import React, { useState, useEffect } from 'react';
import API from '../api';
import PhotoGrid from './PhotoGrid';
import './Gallery.css';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch photos when component mounts
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/photos');
        setPhotos(data);
        
        // Get current user info
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setCurrentUserId(user._id);
        } else {
          // Fallback: fetch user info if not in localStorage
          try {
            const { data: userData } = await API.get('/profile');
            setCurrentUserId(userData._id);
          } catch (userErr) {
            console.error('Failed to get user info:', userErr);
          }
        }
      } catch (err) {
        setError('Failed to load photos. Please try again later.');
        console.error('Error fetching photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Handle photo deletion
  const handleDeletePhoto = async (photoId) => {
    try {
      await API.delete(`/photos/${photoId}`);
      // Update state to remove the deleted photo
      setPhotos(photos.filter(photo => photo._id !== photoId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo. Please try again.');
    }
  };

  // Handle photo liking
  const handleLikePhoto = async (photoId) => {
    try {
      const { data } = await API.post(`/photos/${photoId}/like`);
      // Update the likes array for the specific photo
      setPhotos(photos.map(photo => 
        photo._id === photoId ? { ...photo, likes: data } : photo
      ));
    } catch (err) {
      console.error('Error liking photo:', err);
    }
  };

  if (loading) return <div style={styles.loading}>Loading photos...</div>;
  
  if (error) return <div style={styles.error}>{error}</div>;
  
  if (photos.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h3>No photos found</h3>
        <p>Upload some images to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Image Gallery</h2>
      <PhotoGrid 
        photos={photos} 
        currentUserId={currentUserId}
        onDelete={handleDeletePhoto}
        onLike={handleLikePhoto}
      />
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    color: '#fff',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '28px',
  },
  loading: {
    textAlign: 'center',
    padding: '30px',
    color: '#94a3b8',
    fontSize: '18px',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#94a3b8',
  }
};

export default Gallery;