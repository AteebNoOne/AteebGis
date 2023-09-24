import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = 'pk.eyJ1IjoiZG9jZ2lzIiwiYSI6ImNsank3dWwyMzAyazczZHBkdzh3azB3eXcifQ.EHVWuqomBeNlfJRQZCWt1A'; // Replace with your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9jZ2lzIiwiYSI6ImNsamsxaGJ2ODBmOW4zZm5vdmk3cHFlamUifQ.GYcelFLC7CJATOyFko3D0A"; // Replace with your Mapbox access token

const LocationInput = ({ destination, currentLocation }) => {
  const mapContainerRef = useRef(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  // const [showMap, setShowMap] = useState(true);
  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0],
        zoom: 3,
      });

      mapInstance.on("click", handleMapClick);

      setMap(mapInstance);
    };

    initializeMap();
    if (map) {
      map.remove();
    }
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);
  useEffect(() => {
    console.log("destination", destination);
    console.log("current Location", currentLocation);
    if (map && destination?.lat && destination?.lng) {
      // Add a marker for the destination
      new mapboxgl.Marker()
        .setLngLat([destination.lng, destination.lat])
        .addTo(map);
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [currentLocation.lng, currentLocation.lat],
              [destination.lng, destination.lat],
            ],
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b9ddd",
          "line-width": 5,
          "line-opacity": 0.8,
        },
      });
    }
  }, [map, destination]);
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  useEffect(() => {
    if (map && coordinates) {
      // Remove the previous marker, if any
      if (marker) {
        marker.remove();
      }

      // Create a new marker at the given coordinates
      const newMarker = new mapboxgl.Marker()
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(map);

      setMarker(newMarker);

      // Fly to the marker's location on the map
      map.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 14,
      });
    }
  }, [map, coordinates]);
  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    setCoordinates({ latitude: lat, longitude: lng });
    // setShowMap(!showMap)
  };

  const handlePick = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      setLocation(`${latitude}, ${longitude}`);
      copyToClipboard(`${latitude}, ${longitude}`);
      // map.remove();
      // setMap(null);
    }
  };
  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude+" "+longitude)
          setLocation(`${latitude}, ${longitude}`);
          setCoordinates({ latitude, longitude });
          setCurrentCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      {/* <input
        type="text"
        value={location}
        onChange={handleLocationChange}
        onClick={handleInputClick}
      /> */}
      {/* <button onClick={handleSearch}>Search</button> */}

      <div id="map" ref={mapContainerRef} style={{ height: "400px" }}></div>
      {coordinates && (
        <div>
          <p>
            Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
          </p>
          <button onClick={handlePick}>Copy</button>
          

        </div>
      )}
      <button onClick={getCurrentLocation} style={{marginTop:'15px'}}>Get Current Location</button>
    </div>
  );
};

export default LocationInput;
