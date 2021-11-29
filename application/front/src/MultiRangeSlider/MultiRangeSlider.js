import React, { useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import "./MultiRangeSlider.css";


const MultiRangeSlider = ({ min, max, current_min, current_max, onChange }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const [minValCurr, setMinValCurr] = useState(current_min);
    const [maxValCurr, setMaxValCurr] = useState(current_max);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - minVal) / (maxVal - minVal)) * 100),
        [minVal, maxVal]
    );

    useEffect(() => {
        setMinVal(min)
        setMaxVal(max)
        setMinValCurr(current_min)
        setMaxValCurr(current_max)
    }, [min, max, current_min, current_max]);

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minValCurr);
            const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minValCurr, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxValCurr);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxValCurr, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minValCurr, max: maxValCurr });
    }, [minValCurr, maxValCurr, onChange]);

    return (
        <div className="container">
            <input
                type="range"
                min={min}
                max={max}
                value={minValCurr}
                ref={minValRef}
                onChange={(event) => {
                    const value = Math.min(+event.target.value, +maxValCurr);
                    setMinValCurr(value);
                    event.target.value = value.toString();
                }}
                className={classnames("thumb thumb--zindex-3", {
                    "thumb--zindex-5": minValCurr > max - 100
                })}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxValCurr}
                ref={maxValRef}
                onChange={(event) => {
                    const value = Math.max(+event.target.value, +minValCurr);
                    setMaxValCurr(value);
                    event.target.value = value.toString();
                }}
                className="thumb thumb--zindex-4"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value">{minValCurr}</div>
                <div className="slider__right-value">{maxValCurr}</div>
            </div>
        </div>
    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;
