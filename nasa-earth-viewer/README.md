# NASA Earth Snapshot Viewer

A React application to explore NASA Earth imagery in 2D (Leaflet) and 3D (CesiumJS) views. Users can search locations, select dates, toggle cloud layers, and switch between map views.

## Features

- Search locations via OpenStreetMap Nominatim API with autocomplete suggestions.  
- Display satellite imagery from NASA GIBS for selected layers and dates.  
- Switch between 2D Leaflet map and 3D Cesium globe.  
- Toggle cloud layers and different satellite imagery layers (MODIS, VIIRS).  
- Smooth transitions using Framer Motion.  

## Technologies Used

- React 19  
- Vite 7  
- CesiumJS 1.129  
- Leaflet 1.9  
- Framer Motion 12  
- TailwindCSS 4  
- NASA GIBS API for imagery  
- OpenStreetMap Nominatim API for geocoding  

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nasa-earth-viewer.git
cd nasa-earth-viewer