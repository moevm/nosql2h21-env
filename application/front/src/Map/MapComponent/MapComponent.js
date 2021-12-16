import React from 'react';
import './MapComponent.css';
import { MapContainer, TileLayer, Marker, Popup, MapConsumer } from 'react-leaflet';
import L from "leaflet";
import "leaflet.heat";

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.heat = null;
  }

  render() {
    let default_position = [37.5726028, -85.1551411];
    let states_data = this.props ? this.props.states_data : [];
    let markers = [];
    for (let state of states_data) {
      markers.push(
        <Marker key={state.name} position={[state.latitude, state.longitude]}>
          <Popup>
            {state.name}, <br /> {state.mean} 
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
        <MapConsumer>
          {(map) => {
            if (!this.heat) {
              this.heat = L.heatLayer([], {radius: 100}).addTo(map);
            } 
            let intensities = this.props.states_data ? this.props.states_data.map(state => {
              return state.mean;
            }) : [1.0];
            let maxIntensity = Math.max(...intensities);
            console.log(maxIntensity)
            let points = this.props.states_data ? this.props.states_data.map(state => {
              return [state.latitude, state.longitude, state.mean / maxIntensity]
            }) : [];
            
            this.heat.setLatLngs(points);
            return null;
          }}
        </MapConsumer>
      </MapContainer>
    );
  }
}

export default MapComponent;
