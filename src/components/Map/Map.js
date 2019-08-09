import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';

import './Map.css';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: props.data.locationsCoords.lat,
      lng: props.data.locationsCoords.lng,
    };
  }

  render() {
    return (
        <Map
          google={this.props.google}
          initialCenter={{
            lat: this.state.lat,
            lng: this.state.lng,
          }}
          className={'map'}
          zoom={11}
          id="mapContainerAnkor"
        >

          <Marker
            title={'Belarus'}
            name={'Minsk'}
            position={{ lat: this.state.lat, lng: this.state.lng }}
          />
        </Map>
    );
  }
}

MapContainer.propTypes = {
  google: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCvaIfWd-OuN9oFNCRTuUTbInrnllrw4ao',
})(MapContainer);
