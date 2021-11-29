import React, { Component } from 'react'
import MultiRangeSlider from '../MultiRangeSlider';
import './Statistics.css';
import $ from "jquery";


const chart_types = {
    dot: 'Точечная',
    histogram: 'Гистограмма'
}


class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            substances: {
                NO2: true,
                CO: false,
                SO2: false,
                O3: false
            },

            types: {
                dot: true,
                histogram: false
            }
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

    updateTypes(event) {
        if (!event.target.checked) {
            return
        }

        let types = {
            dot: false,
            histogram: false
        }
        types[event.target.value] = true
        this.setState({types: types})
    }

    render() {
        return (
            <div>
                <div id={'statistics-box-left'}>
                    <div id={'statistics-container'}>

                    </div>
                    <div id={'statistics-slider-box'}>
                        <MultiRangeSlider
                            min={this.years.min}
                            max={this.years.max}
                            current_min={this.years.current_min}
                            current_max={this.years.current_max}
                            onChange={({ min, max }) => this.updateYears(min, max)}
                        />
                    </div>
                </div>
                <div id={'statistics-box-right'}>
                    <div className={'statistics-radio-box'}>
                        {Object.keys(this.state.substances).map((name) => {
                            return (
                                <div className={'statistics-radio-wrapper'}>
                                    <label key={name}>
                                        <input type='radio' value={name} checked={this.state.substances[name]}
                                               onChange={(e) => {this.updateSubstances(e)}}
                                               className={'statistics-radio-input'}
                                               name={'substance-radio'}/>
                                        {name}
                                    </label>
                                </div>
                            )
                        })}
                    </div>

                    <div className={'statistics-radio-box'}>
                        {Object.keys(this.state.types).map((name) => {
                            return (
                                <div className={'statistics-radio-wrapper'}>
                                    <label key={name}>
                                        <input type='radio' value={name} checked={this.state.types[name]}
                                               onChange={(e) => {this.updateTypes(e)}}
                                               className={'statistics-radio-input'}
                                               name={'types-radio'}/>
                                        {chart_types[name]}
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

export default Statistics;
