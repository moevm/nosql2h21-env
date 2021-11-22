import React, { Component } from 'react'
import './TableSubstancesWindow.css';


class TableSubstancesWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            substances: props.substances
        }
    }

    updateSubstancesState(event) {
        let substances = this.state.substances
        let index = substances.findIndex((element) => {
            return element.name === event.target.value
        })
        substances[index].check = event.target.checked
        this.setState({substances: substances})
    }

    render() {
        return (
            <div id={'substances-div'}>
                <h2>Выберите вещества</h2>
                <table id='substances-table'>
                    <tbody>
                        <tr>
                            {this.state.substances.map((option) => {
                                return (
                                    <td className={'substances-td'}>
                                        <label className={'substances-label'}>
                                            <input type='checkbox' value={option.name} checked={option.check}
                                                   onChange={(event) => this.updateSubstancesState(event)}/>
                                            {option.name}
                                        </label>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>

                <button className={'modal-window__confirm'}
                        onClick={() => {this.props.callback(this.state.substances)}}>Подтвердить</button>
                <button className={'modal-window__close'}
                        onClick={() => {this.props.callback()}}>x</button>
            </div>
        )
    };
}

export default TableSubstancesWindow;
