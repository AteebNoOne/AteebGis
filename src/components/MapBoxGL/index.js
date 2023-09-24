import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the Mapbox CSS

export const MapboxGLComponent = ({ customCords }) => {
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZG9jZ2lzIiwiYSI6ImNsank3dWwyMzAyazczZHBkdzh3azB3eXcifQ.EHVWuqomBeNlfJRQZCWt1A"; // Replace with your Mapbox access token
    // console.log(customCords[0][0])
    const map = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/streets-v11", // Replace with your desired map style
      center: customCords.length > 0 ? customCords[0] : [], // Replace with the initial center coordinates
      zoom: 13, // Replace with the initial zoom level
    });

    // Add your polygon data and customize the appearance
    const polygonData = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [customCords],
      },
    };

    map.on("load", () => {
      map.addLayer({
        id: "polygon",
        type: "fill",
        source: {
          type: "geojson",
          data: polygonData,
        },
        paint: {
          "fill-color": "#ff0000", // Replace with your desired fill color
          "fill-opacity": 0.5, // Replace with your desired fill opacity
        },
      });
    });

    return () => {
      map.remove(); // Clean up the map on component unmount
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div id="map-container" style={{ width: "100%", height: "70vh" }}></div>
  );
};
