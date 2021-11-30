import React, { Component } from 'react'
import MultiRangeSlider from '../MultiRangeSlider';
import './Map.css';
import $ from 'jquery';
import { debounce } from 'throttle-debounce'


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
        }

        this.years = {
            min: 0,
            max: 0,
            current_min: 0,
            current_max: 0,
        }
    }

    componentDidMount() {
        $.get('/years', {}, (res) => {
            let years = res
            years.current_min = years.min
            years.current_max = years.max
            this.years = years
            this.forceUpdate()

            this.fetch_data();
        })

        $("#map-container").html('LOADING...');
    }


    fetch_data =  debounce(500, false, async () => {
        $("#map-container").html('LOADING...');

        let interval = this.years
        if (interval !== undefined) {
            interval = {
                min: interval.current_min,
                max: interval.current_max
            }
        }

        let substance;
        for (const key in this.state.substances) {
            if (this.state.substances[key]) {
                substance = key;
                break;
            }
        }

        let states_data = {}

        $.get('/location', {}, (res) => {
            for (const key in res) {
                states_data[key] = {address: res[key]}
            }
        });

        await $.get('/map', {substance: substance, interval: interval}, (res) => {
            for (const key in res) {
                states_data[key].mean = res[key]
            }
        });

        let res_str = "";
        for (const key in states_data) {
            res_str += `<p>${key}: {address: ${states_data[key]['address']}, mean: ${states_data[key]['mean']}}</p>`
        }
        $("#map-container").html(res_str);

        this.states_data = states_data;
    })

    updateYears(current_min, current_max, mouse_down) {
        if (!mouse_down) {
            this.years.current_min = current_min
            this.years.current_max = current_max
            this.fetch_data();
        }
    }

    updateSubstances(event) {
        if (!event.target.checked) {
            return
        }

        let substances = {
            NO2: false,
            CO: false,
            SO2: false,
            O3: false
        }
        substances[event.target.value] = true
        this.setState({substances: substances})
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
                                <div className={'map-radio-wrapper'}>
                                    <label key={name}>
                                        <input type='radio' value={name} checked={this.state.substances[name]}
                                               onChange={(e) => {this.updateSubstances(e)}}
                                               className={'map-radio-input'}
                                               name={'substance-radio'}/>
                                        {name}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    };
}

export default Map;
