import React, { Component } from 'react'
import { columns } from '../columnsOptions'
import './TableColumnsWindow.css';


class TableColumnsWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns
        }
    }

    updateColumnsState(event) {
        let columns = this.state.columns
        columns[event.target.value] = event.target.checked
        this.setState({columns})
    }

    render() {
        return (
            <div id={'columns-div'}>
                <h2>Выберите колонки для отображения</h2>
                <table id='columns-table'>
                    <tbody>
                        <tr>
                            {columns.slice(0, 3).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onClick={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                )
                            })}
                        </tr>

                        <tr>
                        {columns.slice(3, 7).map((option) => {
                            return (
                                <td className={'columns-td'}>
                                    <label>
                                        <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                               onClick={(event) => this.updateColumnsState(event)}/>
                                        {option.label}
                                    </label>
                                </td>
                            )
                        })}
                        </tr>

                        <tr>
                        {columns.slice(7, 8).map((option) => {
                            return (
                                <td className={'columns-td'}>
                                    <label>
                                        <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                               onClick={(event) => this.updateColumnsState(event)}/>
                                        {option.label}
                                    </label>
                                </td>
                            )
                        })}
                        </tr>

                        <tr>
                        {columns.slice(8, 13).map((option) => {
                            return (
                                <td className={'columns-td'}>
                                    <label>
                                        <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                               onClick={(event) => this.updateColumnsState(event)}/>
                                        {option.label}
                                    </label>
                                </td>
                            )
                        })}
                        </tr>

                        <tr>
                        {columns.slice(13, 18).map((option) => {
                            return (
                                <td className={'columns-td'}>
                                    <label>
                                        <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                               onClick={(event) => this.updateColumnsState(event)}/>
                                        {option.label}
                                    </label>
                                </td>
                            )
                        })}
                        </tr>

                        <tr>
                            {columns.slice(18, 23).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onClick={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                )
                            })}
                        </tr>

                        <tr>
                            {columns.slice(23, 28).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}/>
                                            {option.label}
                                        </label>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>

                <button className={'modal-window__confirm'}
                        onClick={() => {this.props.callback(this.state.columns)}}>Подтвердить</button>
                <button className={'modal-window__close'}
                        onClick={() => {this.props.callback()}}>x</button>
            </div>
        )
    };
}

export default TableColumnsWindow;
