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

    componentDidMount() {
        $.get('/years', {}, (res) => {
            let years = res
            years.current_min = years.min
            years.current_max = years.max
            this.years = years
            this.forceUpdate()
        })
    }

    updateYears(current_min, current_max) {
        this.years.current_min = current_min
        this.years.current_max = current_max
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
