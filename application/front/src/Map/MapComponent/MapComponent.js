import React from 'react';
import './MapComponent.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


class MapComponent extends React.Component {
  /*constructor(props) {
    super(props);
  }*/

  render() {
    let default_position = [37.5726028, -85.1551411];
    let states_data = this.props ? this.props.states_data : {};
    let markers = [];
    for (let state in states_data) {
      markers.push(
        <Marker position={[states_data[state].latitude, states_data[state].longitude]}>
          <Popup>
            {state}, <br /> {states_data[state].mean} 
          </Popup>
        </Marker>
      );
    }
    
    return (
      <MapContainer center={default_position} zoom={6} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        {markers}
      </MapContainer>
    );
  }
}

export default MapComponent;
