import React, { useCallback, useState, useEffect, useRef } from "react";
import { GoogleMap, StandaloneSearchBox, Marker } from "@react-google-maps/api";
let openLocationCode = require("open-location-code").OpenLocationCode;
openLocationCode = new openLocationCode();
const {get} = require("lodash");

function Map(props) {
  const { handleAddress, storeLoc, coordinates } = props;
  const searchBoxRef = useRef(null);

  const [mapLocation, setMapLocation] = useState({
    bounds: null,
    center: {
      lat: 12.998410555533955,
      lng: 80.20282586889495,
    },
  });

  const [addressAndMarker, setMarkerAndAddress] = useState({
    position: null,
    formatted_address: null,
  });

  useEffect(() => {
    if (addressAndMarker.position) handleAddress(addressAndMarker);
    if (storeLoc && !addressAndMarker.position && !coordinates) {
      let geocoder = new window.google.maps.Geocoder();
      let pos = { lat: storeLoc[1], lng: storeLoc[0] };
      geocoder.geocode(
        {
          latLng: pos,
        },
        (responses) => {
          if (responses && responses.length) {
            let firstResponse = responses[0];

            setMarkerAndAddress({
              position: firstResponse.geometry.location,
              formatted_address: firstResponse.formatted_address,
            });
          }
        }
      );
      let center = {
        lat: storeLoc[1],
        lng: storeLoc[0],
      };
      setMapLocation({ center: center });
    }
  }, [addressAndMarker, handleAddress, storeLoc, coordinates]);

  const getAddressFromCoordinates = (geocoder, latCenter, lngCenter) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat: latCenter, lng: lngCenter } },
        (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              resolve(results[0]);
            }
          } else {
            reject(status);
          }
        }
      );
    });
  };

  const decodeCoordinatesFromPlusCode = (code) => {
    return openLocationCode.decode(code);
  };

  const onLoad = function onLoad(mapInstance) {};

  const onLoadSearchBox = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = async () => {
    const places = searchBoxRef.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    const place = places[0];
    let decodedCoordinates, decodedAddress;

    if (place && place.types && place.types[0] === "plus_code") {
      decodedCoordinates = decodeCoordinatesFromPlusCode(
        place.plus_code.global_code
      );
      if (
        decodedCoordinates.latitudeCenter &&
        decodedCoordinates.longitudeCenter
      ) {
        const geocoder = new window.google.maps.Geocoder();
        decodedAddress = await getAddressFromCoordinates(
          geocoder,
          decodedCoordinates.latitudeCenter,
          decodedCoordinates.longitudeCenter
        );
      }
    }
    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    const nextMarker = {
      position: place.geometry.location,
      formatted_address: decodedAddress
        ? decodedAddress.formatted_address
        : place.formatted_address,
    };

    const nextCenter = get(nextMarker, "position", mapLocation.center);

    setMapLocation({
      center: nextCenter,
    });

    setMarkerAndAddress(nextMarker);
  };

  const onDragMarker = useCallback((event) => {
    let geocoder = new window.google.maps.Geocoder();

    let pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    geocoder.geocode(
      {
        latLng: pos,
      },
      (responses) => {
        if (responses && responses.length) {
          let firstResponse = responses[0];

          setMarkerAndAddress({
            position: firstResponse.geometry.location,
            formatted_address: firstResponse.formatted_address,
          });
        }
      }
    );
  }, []);

  return (
    <GoogleMap
      onLoad={onLoad}
      zoom={10}
      mapContainerStyle={{
        height: "400px",
        width: "100%",
        zIndex: "100000 !important",
      }}
      center={mapLocation.center}
    >
      <StandaloneSearchBox
        onLoad={onLoadSearchBox}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search Your Place"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
            left: "50%",
            marginLeft: "-120px",
          }}
        />
      </StandaloneSearchBox>
      <Marker
        position={addressAndMarker.position}
        draggable={true}
        onDragEnd={onDragMarker}
        title={addressAndMarker.formatted_address}
      />
    </GoogleMap>
  );
}

export default React.memo(Map);
