import React, { useState, useEffect } from 'react';
import './App.css';
import './Spinner.css';

const Spinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
  </div>
);

export default function MarsRover({ apiKey }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarsPhotos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${apiKey}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch');
        }
        const data = await response.json();
        setPhotos(data.latest_photos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) {
      fetchMarsPhotos();
    } else {
      setError("NASA API Key is not available.");
      setLoading(false);
    }
  }, [apiKey]);

  return (
    <>
      <header className="app-header">
        <h1>Mars Rover Latest Photos</h1>
        <p>From the Curiosity Rover</p>
      </header>

      <main>
        {loading && <Spinner />}
        {error && <div className="error-message"><strong>Error: </strong><span>{error}</span></div>}
        
        <div className="photo-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-card">
              <img src={photo.img_src} alt={`Mars rover photo ${photo.id}`} className="photo-image" />
              <div className="photo-info">
                <p><strong>Date:</strong> {photo.earth_date}</p>
                <p><strong>Camera:</strong> {photo.camera.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
