import React, { Component } from 'react'
import MultiRangeSlider from '../MultiRangeSlider';
import './Map.css';
import $ from "jquery";


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

    async get_map_data() {
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
    }

    componentDidMount() {
        $.get('/years', {}, (res) => {
            let years = res
            years.current_min = years.min
            years.current_max = years.max
            this.years = years
            this.forceUpdate()
        })
        this.get_map_data();
    }

    updateYears(current_min, current_max) {
        this.years.current_min = current_min
        this.years.current_max = current_max
        this.get_map_data()
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
        this.get_map_data();
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
                            onChange={({ min, max }) => this.updateYears(min, max)}
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
