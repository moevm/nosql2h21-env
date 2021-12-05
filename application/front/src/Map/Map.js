import React, { Component } from 'react'
import MultiRangeSlider from '../MultiRangeSlider';
import './Map.css';
import $ from 'jquery';
import { debounce } from 'throttle-debounce'
import prefix from '../prefix'


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
        };

        this.years = Object.assign({}, this.props.years);
        this.years.current_min = this.years.min
        this.years.current_max = this.years.max

        this.promises = [];

        this.states_data = {};
    }

    componentDidMount() {
        $.get(prefix + '/states', {}, async (states) => {
            for (const state of states) {
                this.promises.push(
                    $.get(prefix + '/geolocation', {address: state}, (res) => {
                        this.states_data[state] = res || {};
                    })
                );
            }
        });

        $("#map-container").html('LOADING...');
    }


    fetch_data =  debounce(500, false, () => {
        $("#map-container").html('LOADING...');

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
            $.get(prefix + '/map', {substance: substance, interval: interval}, (res) => {
                for (const state in res) {
                    this.states_data[state].mean = res[state];
                }

                let res_str = "";
                for (const state in this.states_data) {
                    res_str += `<p>${state}: {latitude: ${this.states_data[state]['latitude']}, 
                            longitude: ${this.states_data[state]['longitude']}, mean: ${this.states_data[state]['mean']}}</p>`;
                }
                $("#map-container").html(res_str);

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

                    </div>
                    <div id={'map-slider-box'}>
                        <MultiRangeSlider
                            min={this.years.min}
                            max={this.years.max}
                            current_min={this.years.current_min}
                            current_max={this.years.current_max}
                            onChange={({ min, max, mouseDown}) => this.updateYears(min, max, mouseDown)}
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
