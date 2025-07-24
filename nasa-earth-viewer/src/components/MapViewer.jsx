// nasa-earth-viewer/src/components/MapViewer.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapViewer({ location, date, layer }) {
  const mapRef = useRef(null);
  const nasaLayerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([20, 0], 2);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
  }, []);

  useEffect(() => {
    if (!location || !date || !layer) return;

    geocode(location).then((coords) => {
      if (!coords) return;

      const map = mapRef.current;

      if (nasaLayerRef.current) {
        map.removeLayer(nasaLayerRef.current);
      }

      // 1. Revert to the correct static TileMatrixSet name
      const nasaTileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

      const nasaLayer = L.tileLayer(nasaTileUrl, {
        attribution: "Imagery © NASA GIBS",
        tileSize: 256,
        // 2. This option is critical to prevent 404 errors for higher zoom levels
        maxZoom: 9,
        // It's also good practice to set a minZoom
        minZoom: 1, 
      });

      nasaLayer.addTo(map);
      nasaLayerRef.current = nasaLayer;
      map.flyTo([coords.lat, coords.lon], 7);
    });
  }, [location, date, layer]);

  async function geocode(location) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length === 0) throw new Error("Location not found.");
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Could not find that location.");
      return null;
    }
  }

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}