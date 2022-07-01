/* eslint-disable no-shadow */
import React, { useState, useEffect, useCallback } from 'react';
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
  height: '800px',
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
  const [position, setPosition] = useState({ lat: 25.0551326, lng: 121.533286 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const geocode = () => {
    api.getLatAndLng(address).then((res) => {
      const { location } = res.results[0].geometry;
      setPosition(location);
    });
  };

  useEffect(() => {
    geocode();
  }, [address]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
      onLoad={onLoad}
    >
      <Marker position={position} title="券商位置" map={map}>
        <InfoWindow position={position}>
          <Div>
            <Text>{name}</Text>
            <Text>{address}</Text>
          </Div>
        </InfoWindow>
      </Marker>
      {/* <Div>loading</Div> */}
    </GoogleMap>
  ) : <LoadContainer><Loading /></LoadContainer>;
}

MyComponent.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default React.memo(MyComponent);
