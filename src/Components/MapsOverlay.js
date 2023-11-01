import React from "react";
import Map from "./Maps/map.tsx";
import { useJsApiLoader } from "@react-google-maps/api";
import Navbar from "./Navbar/Navbar.js";

const MapsOverlay = ({
  car_park_details,
  car_park_availability,
  selected,
  setSelected,
  setShowPage,
}) => {
  // load GoogleMaps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="maps-overlay-page">
      <div className="maps-overlay-maps">
        <Map
          car_park_availability={car_park_availability}
          car_park_details={car_park_details}
        ></Map>
      </div>
      <Navbar
        selected={selected}
        setSelected={setSelected}
        setShowPage={setShowPage}
      />
    </div>
  );
};

export default MapsOverlay;
