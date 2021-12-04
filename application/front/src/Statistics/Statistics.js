import React, { Component } from 'react'
import MultiRangeSlider from '../MultiRangeSlider';
import './Statistics.css';
import $ from 'jquery';
import { debounce } from 'throttle-debounce'


const chart_types = {
    dot: 'Точечная',
    histogram: 'Гистограмма'
};


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
            },

            states: []
        };

        this.years = {
            min: 0,
            max: 0,
            current_min: 0,
            current_max: 0,
        };

        this.location = "WHOLE COUNTRY";
    }

    componentDidMount() {
        $.get('/api/states', {}, (res) => {
            let states = ['WHOLE COUNTRY']
            res.forEach((value) => {
                states.push(value)
            });
            this.setState({states: states});
        });

        $.get('/api/years', {}, (res) => {
            let years = res
            years.current_min = years.min
            years.current_max = years.max
            this.years = years
            this.forceUpdate()
        })

        $("#statistics-container").html('LOADING...');
    }


    get_plots_data() {
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
        let location = this.location;


        $.get('/api/stats/plots', {substance: substance, interval: interval, state: location}, (res) => {
            let str_res = ""
            for (const key in res) {
                str_res += `<p>${key}: ${res[key]}</p>`
            }
            $("#statistics-container").html(str_res);
        })
    }

    get_hist_data() {
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

        $.get('/api/stats/hist', {substance: substance, interval: interval}, (res) => {
            let str_res = ""
            for (const key in res) {
                str_res += `<p>${key}: ${res[key]}</p>`;
            }
            $("#statistics-container").html(str_res);
        });
    }

    fetch_data = debounce(500, false, () => {
        $("#statistics-container").html('LOADING...');

        if (this.state.types.dot) {
            this.get_plots_data();
        } else {
            this.get_hist_data();
        }
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

    updateTypes(event) {
        if (!event.target.checked) {
            return;
        }

        let types = {
            dot: false,
            histogram: false
        };
        types[event.target.value] = true;
        this.setState({types: types});
        if (types.dot) {
            this.location = "WHOLE COUNTRY";
        }

        this.fetch_data();
    }

    updateLocation(event) {
        this.location = event.target.value;
        if (this.state.types.dot) {
            this.fetch_data();
        }
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
                            onChange={({ min, max, mouseDown }) => this.updateYears(min, max, mouseDown)}
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
                            );
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
                            );
                        })}
                    </div>
                    {this.state.types.dot &&
                    <div className={'statistics-radio-box'}>
                        <span>Выберите штат:</span>
                        <select className={'statistics-select'}
                                onChange={(e) => {this.updateLocation(e)}}>
                            {this.state.states.map((state) => {
                                return <option value={state}>{state}</option>
                            })}
                        </select>
                    </div>
                    }

                </div>
            </div>
        );
    };
}

export default Statistics;

