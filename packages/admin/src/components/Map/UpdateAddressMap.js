import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import Map from "./Map";

function CustomMapRender(props) {
  const { handleAddress, storeLoc, coordinates } = props;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA8rAognY_er_ntnJTozxYdwv1T_p0EL8A",
    libraries: ["places"],
  });



  return (
    <div>
      {isLoaded ? (
        <Map
          handleAddress={handleAddress}
          storeLoc={storeLoc}
          coordinates={coordinates}
        />
      ) : (
        <div>Error loading map</div>
      )}
    </div>
  );
}

export default React.memo(CustomMapRender);
