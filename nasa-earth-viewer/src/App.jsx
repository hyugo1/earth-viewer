// nasa-earth-viewer/src/App.jsx

import "./App.css";
import MapViewer from "./components/MapViewer";
import CesiumViewer from "./components/CesiumViewer";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Returns yesterday's date in UTC format (YYYY-MM-DD).
 * This is used to set a maximum date for the date input,
 * preventing users from selecting today or future dates.
 * @returns {string} Yesterday's date in YYYY-MM-DD format.
 *  */
function getYesterdayUTC() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

function App() {
  const [showCesium, setShowCesium] = useState(false);
  const [inputLocation, setInputLocation] = useState("Mount Fuji");
  const [location, setLocation] = useState("Mount Fuji");

  const [date, setDate] = useState(getYesterdayUTC);

  const [layer, setLayer] =
    useState("MODIS_Terra_CorrectedReflectance_TrueColor");
  const [showClouds, setShowClouds] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef();

  useEffect(() => {
    if (!inputLocation || inputLocation.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const delay = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          inputLocation
        )}&format=json&limit=5`,
        { signal: controller.signal }
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [inputLocation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="App">
      <h2>NASA Earth Viewer</h2>

      <div className="search-wrapper">
        <div className="input-group" ref={inputRef}>
          <input
            type="text"
            placeholder="e.g. Mount Fuji"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((s) => (
                <li
                  key={s.place_id}
                  onClick={() => {
                    setInputLocation(s.display_name);
                    setLocation(s.display_name);
                    setSuggestions([]);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="search-btn"
          onClick={() => {
            setLocation(inputLocation);
            setSuggestions([]);
          }}
        >
          🔍 Search
        </button>
      </div>

      <div className="controls">
        {/* --- Date Input --- */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={getYesterdayUTC()}
        />

        <select value={layer} onChange={(e) => setLayer(e.target.value)}>
          <option value="MODIS_Terra_CorrectedReflectance_TrueColor">
            MODIS True Color
          </option>
          <option value="VIIRS_SNPP_CorrectedReflectance_TrueColor">
            VIIRS SNPP
          </option>
          <option value="MODIS_Terra_Aerosol">MODIS Aerosol</option>
        </select>

        <label className="toggle-option">
          <input
            type="checkbox"
            checked={showClouds}
            onChange={(e) => setShowClouds(e.target.checked)}
          />
          Show Cloud Layer
        </label>

        <button
          className="toggle-btn"
          onClick={() => setShowCesium(!showCesium)}
        >
          {showCesium ? "Switch to 2D Map" : "Switch to 3D View"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showCesium ? (
          <motion.div
            key="cesium"
            className="map-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CesiumViewer
              location={location}
              date={date}
              layer={layer}
              showClouds={showClouds}
            />
          </motion.div>
        ) : (
          <motion.div
            key="leaflet"
            className="map-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MapViewer
              location={location}
              date={date}
              layer={layer}
              showClouds={showClouds}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer">
        <p>Made with 💙 using NASA GIBS and CesiumJS</p>
        <p>
          Imagery ©{" "}
          <a
            href="https://earthdata.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            NASA EarthData
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;