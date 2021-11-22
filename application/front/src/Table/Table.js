import React, { Component } from 'react'
import TableColumnsWindow from "./TableColumnsWindow/TableColumnsWindow";
import TableStatesWindow from "./TableStatesWindow/TableStatesWindow";
import TableSubstancesWindow from "./TableSubstancesWindow/TableSubstancesWindow";
import TableYearsWindow from "./TableYearsWindow/TableYearsWindow";
import { columnsMap } from './columnsOptions'
import './Table.css';
import $ from "jquery"



export const PAGE_STATUS = {
    DISPLAY: 0,
    COLUMNS: 1,
    STATES: 2,
    SUBSTANCES: 3,
    YEARS: 4
};


class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: PAGE_STATUS.DISPLAY,

            columns: {
                state_code: true,
                county_code: true,
                site_num: true,
                address: true,
                state: true,
                county: true,
                city: true,
                date_local: true,
                unit_NO2: true,
                mean_NO2: true,
                firstMV_NO2: true,
                firstMH_NO2: true,
                aqi_NO2: true,
                unit_O3: true,
                mean_O3: true,
                firstMV_O3: true,
                firstMH_O3: true,
                aqi_O3: true,
                unit_SO2: true,
                mean_SO2: true,
                firstMV_SO2: true,
                firstMH_SO2: true,
                aqi_SO2: true,
                unit_CO: true,
                mean_CO: true,
                firstMV_CO: true,
                firstMH_CO: true,
                aqi_CO: true
            },

        }

        this.substances =  [
            {name: 'NO2', check: true},
            {name: 'O3', check: true},
            {name: 'SO2', check: true},
            {name: 'CO', check: true}
        ]

        this.close_columns_window = this.close_columns_window.bind(this)
        this.close_states_window = this.close_states_window.bind(this)
        this.close_substances_window = this.close_substances_window.bind(this)
        this.close_years_window = this.close_years_window.bind(this)
        this.get_line = this.get_line.bind(this)
    }

    componentDidMount() {
        $.get('states', {}, (res) => {
            let states = []
            res.forEach((value) => {
                states.push({name: value, check: true})
            })
            this.states = states
        })

        $.get('years', {}, (res) => {
            let years = res
            years.current_min = years.min
            years.current_max = years.max
            this.years = years
        })
    }

    set_page_state(status) {
        this.setState({status: status})
    }

    close_columns_window(columns) {
        if (columns !== undefined) {
            this.setState({columns: columns})
        }
        this.set_page_state(PAGE_STATUS.DISPLAY)
    }

    close_states_window(states) {
        if (states !== undefined) {
            this.states = states
        }
        this.set_page_state(PAGE_STATUS.DISPLAY)
    }

    close_substances_window(substances) {
        if (substances !== undefined) {
            this.substances = substances
        }
        this.set_page_state(PAGE_STATUS.DISPLAY)
    }

    close_years_window(years) {
        if (years !== undefined) {
            this.years = years
        }
        this.set_page_state(PAGE_STATUS.DISPLAY)
    }

    get_line(line) {
        return (
            <tr className={'data-tr'}>
                {Object.keys(this.state.columns).map((name, index) => {
                    if (this.state.columns[name]) {
                        let value;
                        if (line) {
                            value = line[name]
                            return <td className={'data-td'} key={index}>{value}</td>
                        }
                        else {
                            value = columnsMap[name]
                            return <th className={'data-th'} key={index}>{value}</th>
                        }
                    }
                })}
            </tr>
        )
    }

    render() {
        let content;

        if (this.state.status === PAGE_STATUS.DISPLAY) {
            content = (
                <div id='table-box'>
                    <div id='table-box-left'>
                        <div id='table-box-left__inner'>
                            <table id='data-table' className={'table-border-none'}>
                                <tbody>
                                    {this.get_line()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id='table-box-right'>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(PAGE_STATUS.COLUMNS)}>Выбор колонок</button>
                        <br/>
                        <br/>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(PAGE_STATUS.STATES)}>Выбор штатов</button>
                        <br/>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(PAGE_STATUS.SUBSTANCES)}>Выбор веществ</button>
                        <br/>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(PAGE_STATUS.YEARS)}>Выбор годов</button>
                    </div>
                </div>
            )
        }
        else if (this.state.status === PAGE_STATUS.COLUMNS) {
            content = <TableColumnsWindow columns={this.state.columns} callback={this.close_columns_window}/>
        }
        else if (this.state.status === PAGE_STATUS.STATES) {
            content = <TableStatesWindow states={this.states} callback={this.close_states_window}/>
        }
        else if (this.state.status === PAGE_STATUS.SUBSTANCES) {
            content = <TableSubstancesWindow substances={this.substances} callback={this.close_substances_window}/>
        }
        else if (this.state.status === PAGE_STATUS.YEARS) {
            content = <TableYearsWindow years={this.years} callback={this.close_years_window}/>
        }

        return content
    };
}

export default Table;
