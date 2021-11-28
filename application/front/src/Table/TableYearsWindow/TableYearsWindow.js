import React, { Component } from 'react'
import MultiRangeSlider from "../../MultiRangeSlider";
import './TableYearsWindow.css';


class TableYearsWindow extends Component {
    constructor(props) {
        super(props);
        this.years = JSON.parse(JSON.stringify(props.years))
    }

    updateYears(min, max) {
        this.years.current_min = min
        this.years.current_max = max
    }

    render() {
        return (
            <div id={'years-div'}>
                <h2>Выберите года</h2>

                <MultiRangeSlider
                    min={this.years.min}
                    max={this.years.max}
                    current_min={this.years.current_min}
                    current_max={this.years.current_max}
                    onChange={({ min, max }) => this.updateYears(min, max)}
                />

                <button className={'modal-window__confirm'}
                        onClick={() => {this.props.callback(this.years)}}>Подтвердить</button>
                <button className={'modal-window__close'}
                        onClick={() => {this.props.callback()}}>x</button>
            </div>
        )
    };
}

export default TableYearsWindow;
