import React, { useState, useEffect } from 'react';
import './App.css';
import './Spinner.css';

// --- A simple loading spinner component ---
const Spinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
  </div>
);

// A helper function to format the date
const formatDate = (dateObj) => {
  return dateObj.toISOString().split('T')[0];
}

export default function Apod({ apiKey }) {
  const [date, setDate] = useState(new Date());
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApodData = async () => {
      setLoading(true);
      setError(null);
      setApodData(null);

      const formattedDate = formatDate(date);

      try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${formattedDate}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || errorData.error?.message || `HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setApodData(data);
      } catch (err) {
        setError(`Failed to fetch data for ${formattedDate}. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) {
      fetchApodData();
    } else {
      setError("NASA API Key is not available.");
    }
  }, [date, apiKey]);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value + 'T00:00:00');
    setDate(newDate);
  }

  return (
    <>
      <header className="app-header">
        <h1>Astronomy Picture of the Day</h1>
      </header>

      <div className="date-picker-section">
        <h2>Select a Date</h2>
        <input
          type="date"
          className="date-input"
          value={formatDate(date)}
          onChange={handleDateChange}
          max={formatDate(new Date())}
        />
      </div>

      <main>
        {loading && <Spinner />}
        {error && <div className="error-message"><strong>Error: </strong><span>{error}</span></div>}
        {apodData && (
           <div className="apod-card">
            <div className="card-header">
              <h2>{apodData.title}</h2>
            </div>
            {apodData.media_type === 'image' ? (
              <img src={apodData.hdurl || apodData.url} alt={apodData.title} className="apod-image" onError={(e) => { e.target.onerror = null; e.target.src = apodData.url; }} />
            ) : (
              <div className="video-container">
                <iframe src={apodData.url} title={apodData.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            )}
            <div className="card-body">
              <p className="apod-date">Date: {apodData.date}</p>
              <p className="apod-explanation">{apodData.explanation}</p>
              {apodData.copyright && <p className="apod-copyright">Copyright: {apodData.copyright}</p>}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
