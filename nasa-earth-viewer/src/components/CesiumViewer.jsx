// nasa-earth-viewer/src/components/CesiumViewer.jsx

import { useEffect, useRef } from "react";
import {
  Viewer,
  Ion,
  UrlTemplateImageryProvider,
  Cartesian3,
  WebMercatorTilingScheme,
} from "cesium/Source/Cesium.js";
import "cesium/Build/Cesium/Widgets/widgets.css";

const layerConfigs = {
  MODIS_Terra_CorrectedReflectance_TrueColor: { maxLevel: 9 },
  VIIRS_SNPP_CorrectedReflectance_TrueColor: { maxLevel: 8 },
  MODIS_Terra_Aerosol: { maxLevel: 9 },
};

export default function CesiumViewer({ location, date, layer }) {
  const viewerRef = useRef(null);
  const imageryLayerRef = useRef(null);

  useEffect(() => {
    //token
    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

    if (!viewerRef.current) {
      viewerRef.current = new Viewer("cesiumContainer", {
        baseLayerPicker: false,
        terrainProvider: undefined,
      });
    }
  }, []);

  useEffect(() => {
    if (!location || !date || !layer) return;
    const config = layerConfigs[layer];
    if (!config) {
      console.error("No configuration for layer:", layer);
      return; // Do nothing if the layer isn't configured
    }

    geocode(location).then((coords) => {
      if (!coords) return;

      const viewer = viewerRef.current;

      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          Number(coords.lon),
          Number(coords.lat),
          1000000
        ),
      });

      if (imageryLayerRef.current) {
        viewer.imageryLayers.remove(imageryLayerRef.current, true);
      }

      const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

      const provider = new UrlTemplateImageryProvider({
        url: tileUrl,
        // Use the dynamic maximumLevel from our config
        maximumLevel: config.maxLevel,
        // Set a minimum level to prevent issues when zoomed out
        minimumLevel: 1,
        // Explicitly set the tiling scheme for consistency
        tilingScheme: new WebMercatorTilingScheme(),
        credit: "NASA GIBS",
      });

      const imageryLayer = viewer.imageryLayers.addImageryProvider(provider);
      imageryLayerRef.current = imageryLayer;
    });
  }, [location, date, layer]);

  async function geocode(place) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      place
    )}&format=json&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length === 0) return null;
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (err) {
      console.error("Geocoding failed", err);
      return null;
    }
  }

  return (
    <div id="cesiumContainer" style={{ height: "600px", width: "100%" }}></div>
  );
}