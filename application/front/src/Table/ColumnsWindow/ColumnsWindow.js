import React, { Component } from 'react'
import { columnsLabels } from '../columnsOptions'
import './ColumnsWindow.css';


class ColumnsWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: JSON.parse(JSON.stringify(props.columns))
        };
    }

    updateColumnsState(event) {
        let columns = this.state.columns;
        columns[event.target.value] = event.target.checked;
        this.setState({columns: columns});
    }

    render() {
        return (
            <div id={'columns-div'}>
                <h2>Выберите колонки для отображения</h2>
                <table id='columns-table'>
                    <tbody>
                        <tr>
                            {columnsLabels.slice(0, 3).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            {columnsLabels.slice(3, 7).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            {columnsLabels.slice(7, 8).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            {columnsLabels.slice(8, 13).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            {columnsLabels.slice(13, 18).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            {columnsLabels.slice(18, 23).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>

                        <tr>
                            {columnsLabels.slice(23, 28).map((option) => {
                                return (
                                    <td className={'columns-td'}>
                                        <label>
                                            <input type='checkbox' value={option.value} checked={this.state.columns[option.value]}
                                                   onChange={(event) => this.updateColumnsState(event)}/>
                                            {option.label}
                                        </label>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>

                <button className={'modal-window__confirm'}
                        onClick={() => {this.props.callback(this.state.columns)}}>Подтвердить</button>
                <button className={'modal-window__close'}
                        onClick={() => {this.props.callback()}}>x</button>
            </div>
        );
    };
}

export default ColumnsWindow;
