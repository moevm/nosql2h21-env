import React, { Component } from 'react'
import MultiRangeSlider from '../MultiRangeSlider';
//import MapComponent from './MapComponent/MapComponent';
import './Map.css';
import $ from 'jquery';
import { debounce } from 'throttle-debounce'
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);


class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            substances: {
                NO2: true,
                CO: false,
                SO2: false,
                O3: false
            },
            data: [{
                type: 'scattergeo',
                locationmode: 'USA-states',
                mode:'markers',
                hoverinfo: 'text',
                lat: [37.5726028],
                lon: [-85.1551411],
                text: [1],
                marker: {
                    size: [2],
                    line: {
                        color: 'black',
                        width: 2
                    },
                }
            }],

            layout: {
                title: 'Polution Map',
                autosize: false,
                showlegend: false,
                geo: {
                    scope: 'usa',
                    projection: {
                        type: 'albers usa'
                    },
                    showland: true,
                    landcolor: 'rgb(140,162,121)',
                    subunitwidth: 1,
                    countrywidth: 1,
                    subunitcolor: 'rgb(255,255,255)',
                    countrycolor: 'rgb(255,255,255)',
                    width: 800,
                    height: 450,
                },

            }
        };

        this.years = {
            min: 0,
            max: 0,
            current_min: 0,
            current_max: 0,
        };

        this.promises = [];

        this.states_data = {};
    }

    componentDidMount() {
        $.get('/years', {}, (res) => {
            let years = res;
            years.current_min = years.min;
            years.current_max = years.max;
            this.years = years;
        })

        $.get('/states', {}, async (states) => {
            for (const state of states) {
                //this.states_data[state] = {};
                this.promises.push(
                    $.get('/geolocation', {address: state}, (res) => {

                        this.states_data[state] = res || {};
                        console.log(res);
                    })
                );
            }
            this.fetch_data();
        });

        //$("#map-container").html('LOADING...');
    }


    fetch_data =  debounce(500, false, () => {
        this.props.block(true);

        //$("#map-container").html('LOADING...');

        let interval = this.years;
        if (interval !== undefined) {
            interval = {
                min: interval.current_min,
                max: interval.current_max
            };
        }

        let substance;
        for (const key in this.state.substances) {
            if (this.state.substances[key]) {
                substance = key;
                break;
            }
        }

       Promise.all(this.promises).then(() => {
            $.get('/map', {substance: substance, interval: interval}, (res) => {
                let lat= [];
                let lon= [];
                let text= [];
                let size = [];
                let color = [];
                let s1 = 0;
                for (const state in res) {
                    this.states_data[state].mean = res[state];
                    this.states_data[state].name = state;
                }
                let str = "";
                let min = 10000000; let max = 0; let mid = 0;

                for (const state in this.states_data) {
                    if( this.states_data[state]['mean'] < min) min = this.states_data[state]['mean'];
                    if(this.states_data[state]['mean'] > max) max = this.states_data[state]['mean'];
                }
                mid = (max - min)/5;

                for (const state in this.states_data) {
                    lat.push(this.states_data[state]['latitude']);
                    lon.push(this.states_data[state]['longitude']);
                    str = this.states_data[state]['name'];
                    str += ": ";
                    str += Number(this.states_data[state]['mean']).toFixed(4);
                    text.push(str);
                    s1 = this.states_data[state]['mean'];


                    if(s1 <= min + mid)         color.push(0);
                    else if(s1 <= min + 2*mid)  color.push(0.25);
                    else if(s1 <= min + 3*mid)  color.push(0.50);
                    else if(s1 <= min + 4*mid)  color.push(0.75);
                    else                        color.push(1);


                    s1 = (Number(s1).toFixed(0));
                    if(s1 < 3) s1 = 3;
                    size.push(s1*2);
                }

                let data= [{
                    type: 'scattergeo',
                    locationmode: 'USA-states',
                    mode:'markers',
                    hoverinfo: 'text',
                    lat: lat,
                    lon: lon,
                    text: text,
                    reversescale:true,
                    marker: {
                        size: size,
                        color: color,
                        colorscale: [[0, 'rgb(203,229,243)'],
                            [0.25, 'rgb(134,231,96)'],
                            [0.50, 'rgb(255,233,0)'],
                            [0.75, 'rgb(248,135,6)'],
                            [1, 'rgb(252,0,0)']],
                        colorbar: {

                            title: 'Polution level',

                            //showticksuffix: 'last'
                        },
                        line: {width: 1, color: 'rgb(154,182,215)',},
                    }
                }]

                this.setState({data: data});


                this.props.block(false);
            });
        })
    })

    updateYears(current_min, current_max, mouse_down) {
        if (!mouse_down) {
            this.years.current_min = current_min;
            this.years.current_max = current_max;
            this.fetch_data();
        }
    }

    updateSubstances(event) {
        if (!event.target.checked) {
            return;
        }

        let substances = {
            NO2: false,
            CO: false,
            SO2: false,
            O3: false
        };
        substances[event.target.value] = true;
        this.setState({substances: substances});
        this.fetch_data();
    }


    render() {
        return (
            <div>
                <div id={'map-box-left'}>
                    <div id={'map-container'}>
                    <Plot
                        data ={this.state.data}
                        layout = {this.state.layout}
                    />
                    </div>
                    <div id={'map-slider-box'}>
                        <MultiRangeSlider
                            min={this.years.min}
                            max={this.years.max}
                            current_min={this.years.current_min}
                            current_max={this.years.current_max}
                            onChange={( min, max, mouseDown ) => this.updateYears(min, max, mouseDown)}
                        />
                    </div>
                </div>
                <div id={'map-box-right'}>
                    <div id={'map-radio-box'}>
                        {Object.keys(this.state.substances).map((name) => {
                            return (
                                <div className={'map-radio-wrapper'} key={name}>
                                    <label>
                                        <input type='radio' value={name} checked={this.state.substances[name]}
                                               onChange={(e) => {this.updateSubstances(e)}}
                                               className={'map-radio-input'}
                                               name={'substance-radio'}/>
                                        {name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };
}

export default Map;
