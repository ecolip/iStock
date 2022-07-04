/* eslint-disable no-undef */
/* eslint-disable no-shadow */
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import Loading from '../Loading';
import api from '../../utils/api';

const containerStyle = {
  width: '100%',
  height: '700px',
};
const LoadContainer = styled.div`
  padding-top: 250px;
`;
const Text = styled.div`
  color: #181A20;
  font-size: 13px;
  font-weight: bold;
`;
const Div = styled.div`
  color: #EAECEF;
`;

function MyComponent({ address, name }) {
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [bankPosition, setBankPosition] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const libRef = useRef(['places', 'drawing', 'geometry']);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libRef.current,
    language: navigator.language.toLowerCase() || 'zh-tw',
    version: '3.49',
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const fetchBankGeocode = () => {
    api.getLatAndLng(address).then((res) => {
      const { location } = res.results[0].geometry;
      setBankPosition(location);
    });
  };

  const fetchDirection = (UserPosition) => {
    const directionService = new google.maps.DirectionService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    const request = {
      origin: UserPosition,
      destination: bankPosition,
      travelMode: 'DRIVING',
    };
    directionsDisplay.setMap(map);
    directionService.route(request, (result, status) => {
      if (status === 'OK') {
        // 回傳路線上每個步驟的細節
        console.log(result);
        directionsDisplay.setDirections(result);
      } else {
        console.log(status);
      }
    });
    // const directionDisplay = new google.maps.DirectionService();
    // directionService.setMap(map);
    // directionDisplay.setMap(map);
  };

  const fetchUserPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(pos);
        setZoom(14);
        fetchDirection(pos);
      });
    } else {
      // Browser doesn't support Geolocation
      alert('未允許或遭遇錯誤！');
    }
  };

  useEffect(() => {
    fetchBankGeocode();
  }, [address]);

  useEffect(() => {
    fetchUserPosition();
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={bankPosition}
      zoom={zoom}
      onLoad={onLoad}
    >
      <Marker
        position={bankPosition}
        title="券商位置"
        map={map}
        // icon={{
        //   url: '../../imgs/bank.svg',
        //   scaledSize: new window.google.maps.Size(50, 50),
        //   anchor: new window.google.maps.Point(50, 50),
        // }}
      >
        <InfoWindow position={bankPosition}>
          <Div>
            <Text>{name}</Text>
            <Text>{address}</Text>
          </Div>
        </InfoWindow>
      </Marker>
      {userPosition && (
        <Marker position={userPosition} title="你的位置" map={map}>
          <InfoWindow position={userPosition}>
            <Div>
              <Text>你的位置</Text>
            </Div>
          </InfoWindow>
        </Marker>
      )}
    </GoogleMap>
  ) : <LoadContainer><Loading /></LoadContainer>;
}

MyComponent.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default React.memo(MyComponent);
