import React, { Component } from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import "./MultiRangeSlider.css";


class MultiRangeSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minVal: props.min,
            maxVal: props.max,
            minValCurr: props.current_min,
            maxValCurr: props.current_max,
            mouseDown: false
        };

        this.minValRef = React.createRef();
        this.maxValRef = React.createRef();
        this.range = React.createRef();

        this.setMinValCurr = this.setMinValCurr.bind(this);
        this.setMaxValCurr = this.setMaxValCurr.bind(this);
        this.setMouseDown = this.setMouseDown.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.minVal !== this.props.min || this.state.maxVal !== this.props.max) {
            this.setState({
                minVal: this.props.min,
                maxVal: this.props.max,
                minValCurr: this.props.current_min,
                maxValCurr: this.props.current_max
            });
        }
    }

    setMinValCurr(value) {
        this.setState({minValCurr: value}, () => {
            this.callback();
        });
    }

    setMaxValCurr(value) {
        this.setState({maxValCurr: value}, () => {
            this.callback();
        });
    }

    setMouseDown(check) {
        this.setState({mouseDown: check}, () => {
            this.callback();
        });
    }

    callback() {
        this.props.onChange(this.state.minValCurr, this.state.maxValCurr, this.state.mouseDown);
    }

    render() {
        return (
            <div className="container">
                <input
                    type="range"
                    min={this.state.minVal}
                    max={this.state.maxVal}
                    value={this.state.minValCurr}
                    ref={this.minValRef}
                    onChange={(event) => {
                        const value = Math.min(+event.target.value, +this.state.maxValCurr);
                        this.setMinValCurr(value);
                        event.target.value = value.toString();
                    }}
                    onMouseDown={() => {this.setMouseDown(true)}}
                    onMouseUp={() => {this.setMouseDown(false)}}
                    className={classnames("thumb thumb--zindex-3", {
                        "thumb--zindex-5": this.state.minValCurr > this.state.maxVal - 100
                    })}
                />
                <input
                    type="range"
                    min={this.state.minVal}
                    max={this.state.maxVal}
                    value={this.state.maxValCurr}
                    ref={this.maxValRef}
                    onChange={(event) => {
                        const value = Math.max(+event.target.value, +this.state.minValCurr);
                        this.setMaxValCurr(value);
                        event.target.value = value.toString();
                    }}
                    onMouseDown={() => {this.setMouseDown(true)}}
                    onMouseUp={() => {this.setMouseDown(false)}}
                    className="thumb thumb--zindex-4"
                />

                <div className="slider">
                    <div className="slider__track" />
                    <div ref={this.range} className="slider__range" />
                    <div className="slider__left-value">{this.state.minValCurr}</div>
                    <div className="slider__right-value">{this.state.maxValCurr}</div>
                </div>
            </div>
        );
    }
}

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    current_min: PropTypes.number.isRequired,
    current_max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;
