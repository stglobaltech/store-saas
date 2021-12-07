import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import Map from "./map";
import Loader from "components/loader/loader";

function CustomMapRender(props) {
  const { handleAddress, storeLoc, coordinates } = props;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return (
    <div>
      {isLoaded && !loadError ? (
        <Map
          handleAddress={handleAddress}
          storeLoc={storeLoc}
          coordinates={coordinates}
        />
      ) : (
        <>
          {loadError ? (
            <div>Error loading map! Please try after some time :(</div>
          ) : (
            <div className="text-center">
              <Loader />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(CustomMapRender);
