import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
} from "@react-google-maps/api";
import Places from "./places.tsx";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map({ carpark }) {
  const [userLocation, setUserLocation] = useState<LatLngLiteral>();
  const [destination, setDestination] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();

  // Remove default UI
  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  //onLoad function
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  // Get current position
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch positions, retrieve position of clicked icon
  const fetchDirections = (lat, lng) => {
    if (!destination) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: userLocation,
        destination: { lat: lat, lng: lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="map">
      <div className="maps-overlay-searchbar">
        <Places
          setDestination={(position) => {
            setDestination(position);
            mapRef.current?.panTo(position);
          }}
        />
      </div>

      <GoogleMap
        zoom={13}
        center={userLocation}
        mapContainerClassName="map-container"
        options={options}
        onLoad={onLoad}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "#1976D2",
                strokeWeight: 5,
              },
            }}
          />
        )}
        {userLocation && <Marker position={userLocation} />}
        {destination && (
          <>
            {/* icon={"/images/carparkIcon.svg"} */}
            <Marker position={destination} />
            {carpark.map((item) => (
              <Marker
                key={item.id}
                position={{ lat: item.latitude, lng: item.longitude }}
                icon={"/images/carparkIcon.svg"}
                onClick={() => {
                  fetchDirections(item.latitude, item.longitude);
                }}
              />
            ))}
            <Circle center={destination} radius={200} options={closeOptions} />
            <Circle center={destination} radius={400} options={middleOptions} />
            <Circle center={destination} radius={600} options={farOptions} />
          </>
        )}
      </GoogleMap>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
