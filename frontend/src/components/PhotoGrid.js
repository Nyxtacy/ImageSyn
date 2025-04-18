// components/PhotoGrid.js
import React, { useState } from 'react';
import '../components/Gallery.css'; // Import the CSS

function PhotoGrid({ photos, onDelete, onLike, currentUserId }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Function to open the modal with selected photo
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  // Function to close the modal
  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  // Function to handle direct download of the image
  const downloadImage = async (url, filename) => {
    try {
      // Fetch the image
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Set the download attribute to force download instead of navigation
      link.download = filename || 'image';
      
      // Append to the document, trigger the click, then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      {/* Grid of photo thumbnails - 5 columns per row */}
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo._id} className="grid-item">
            <img 
              src={photo.url} 
              alt="Gallery item" 
              className="grid-image"
              onClick={() => openPhotoModal(photo)}
            />
            <div className="image-overlay">
              <div className="image-actions">
                <button 
                  className="action-button download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(photo.url, photo.filename);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                
                {/* Only show delete button if the photo belongs to current user */}
                {photo.user === currentUserId && (
                  <button 
                    className="action-button delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(photo._id);
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal/Lightbox */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={closePhotoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePhotoModal}>×</button>
            <img src={selectedPhoto.url} alt="Enlarged view" className="modal-image" />
            
            <div className="modal-actions">
              <button 
                className="modal-button download-button"
                onClick={() => downloadImage(selectedPhoto.url, selectedPhoto.filename)}
              >
                Download
              </button>
              
              {selectedPhoto.user === currentUserId && (
                <button 
                  className="modal-button delete-button"
                  onClick={() => {
                    onDelete(selectedPhoto._id);
                    closePhotoModal();
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGrid;