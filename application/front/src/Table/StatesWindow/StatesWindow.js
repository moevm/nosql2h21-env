import React, { Component } from 'react'
import './StatesWindow.css';


class StatesWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            states: JSON.parse(JSON.stringify(props.states))
        }
    }

    updateStatesState(event) {
        let states = this.state.states
        let index = states.findIndex((element) => {
            return element.name === event.target.value
        })
        states[index].check = event.target.checked
        this.setState({states: states})
    }

    get_line(states) {
        let line = []
        for (let option of states) {
            line.push(
                <td className={'states-td'}>
                    <label>
                        <input type='checkbox' value={option.name} checked={option.check}
                               onChange={(event) => this.updateStatesState(event)}/>
                        {option.name}
                    </label>
                </td>
            )
        }
        return <tr>{line}</tr>
    }

    get_lines() {
        let lines = []
        let i = 0
        while (i + 5 < this.state.states.length) {
            lines.push(this.get_line(this.state.states.slice(i, i + 5)))
            i += 5
        }
        if (i < this.state.states.length) {
            lines.push(this.get_line(this.state.states.slice(i, this.state.states.length)))
        }
        return <tbody>{lines}</tbody>
    }

    render() {
        return (
            <div id={'states-div'}>
                <h2>Выберите штаты</h2>
                <table id='states-table'>
                    {this.get_lines()}
                </table>

                <button className={'modal-window__confirm'}
                        onClick={() => {this.props.callback(this.state.states)}}>Подтвердить</button>
                <button className={'modal-window__close'}
                        onClick={() => {this.props.callback()}}>x</button>
            </div>
        )
    };
}

export default StatesWindow;
