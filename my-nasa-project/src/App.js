import React, { useState } from 'react';
import './App.css';
import Apod from './Apod';
import MarsRover from './MarsRover';

export default function App() {
  const my_NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
  const [page, setPage] = useState('apod');

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <nav className="main-nav">
          <button onClick={() => setPage('apod')} className={page === 'apod' ? 'active' : ''}>Picture of the Day</button>
          <button onClick={() => setPage('mars')} className={page === 'mars' ? 'active' : ''}>Mars Rover Photos</button>
        </nav>

        {page === 'apod' && <Apod apiKey={my_NASA_API_KEY} />}
        {page === 'mars' && <MarsRover apiKey={my_NASA_API_KEY} />}
      </div>
    </div>
  );
}