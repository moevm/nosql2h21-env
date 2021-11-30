import React, {Component} from 'react'
import TableColumnsWindow from "./TableColumnsWindow/TableColumnsWindow";
import StatesWindow from "../StatesWindow/StatesWindow";
import TableYearsWindow from "./TableYearsWindow/TableYearsWindow";
import InfiniteScroll from 'react-infinite-scroll-component';
import {columnsMap} from './columnsOptions'
import './Table.css';
import $ from "jquery"


const TABLE_PAGE_STATUS = {
    DISPLAY: 0,
    COLUMNS: 1,
    STATES: 2,
    YEARS: 3
};


class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: TABLE_PAGE_STATUS.DISPLAY,

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

            data: ['header'],
            hasMore: true
        }

        this.page = 0
        this.lines = 100

        this.close_columns_window = this.close_columns_window.bind(this)
        this.close_states_window = this.close_states_window.bind(this)
        this.close_years_window = this.close_years_window.bind(this)
        this.get_line = this.get_line.bind(this)
        this.fetch_data = this.fetch_data.bind(this)
    }

    componentDidMount() {
        this.filter()

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

    clear_data() {
        this.setState({data: []})
    }

    filter() {
        let states = this.states
        if (states !== undefined) {
            states = states.filter((state) => state.check)
            states = states.map((state) => state.name)
        }

        let interval = this.years
        if (interval !== undefined) {
            interval = {
                min: interval.current_min,
                max: interval.current_max
            }
        }

        $.get('filter', {states: states, interval: interval, page: this.page, lines: this.lines}, (res) => {
            this.setState({data: ['header'].concat(this.state.data.concat(res))})
        })
    }

    fetch_data() {
        this.page += 1
        this.filter()
    }

    set_page_state(status) {
        this.setState({status: status})
    }

    close_columns_window(columns) {
        if (columns !== undefined) {
            if (JSON.stringify(this.columns) !== JSON.stringify(columns)) {
                this.setState({columns: columns})
            }
        }
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY)
    }

    close_states_window(states) {
        if (states !== undefined) {
            if (JSON.stringify(this.states) !== JSON.stringify(states)) {
                this.states = states
                this.clear_data()
                this.filter()
            }
        }
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY)
    }

    close_years_window(years) {
        if (years !== undefined) {
            if (JSON.stringify(this.years) !== JSON.stringify(years)) {
                this.years = years
                this.clear_data()
                this.filter()
            }
        }
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY)
    }

    get_line(line) {
        return (
            <tr className={'table-line'}>
                {Object.keys(this.state.columns).map((name, index) => {
                    if (this.state.columns[name]) {
                        let value;
                        if (typeof line === 'object') {
                            value = line[name]
                            return <td key={index}>{value}</td>
                        }
                        else {
                            value = columnsMap[name]
                            return <th key={index}>{value}</th>
                        }
                    }
                })}
            </tr>
        )
    }

    render() {
        let content;

        if (this.state.status === TABLE_PAGE_STATUS.DISPLAY) {
            content = (
                <div id='table-box'>
                    <div id='table-box-left'>
                        <div id='table-box-left__inner'>
                            <table id='data-table' className={'table-border-none'}>
                                <tbody>
                                    <InfiniteScroll next={this.fetch_data}
                                                    hasMore={this.state.hasMore}
                                                    loader={<h3>Loading...</h3>}
                                                    dataLength={this.state.data.length}
                                                    scrollableTarget={'table-box-left__inner'}>
                                        {this.state.data.map((observation) => this.get_line(observation))}
                                    </InfiniteScroll>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id='table-box-right'>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(TABLE_PAGE_STATUS.COLUMNS)}>Выбор колонок</button>
                        <br/>
                        <br/>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(TABLE_PAGE_STATUS.STATES)}>Выбор штатов</button>
                        <br/>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(TABLE_PAGE_STATUS.YEARS)}>Выбор годов</button>
                    </div>
                </div>
            )
        }
        else if (this.state.status === TABLE_PAGE_STATUS.COLUMNS) {
            content = <TableColumnsWindow columns={this.state.columns} callback={this.close_columns_window}/>
        }
        else if (this.state.status === TABLE_PAGE_STATUS.STATES) {
            content = <StatesWindow states={this.states} callback={this.close_states_window}/>
        }
        else if (this.state.status === TABLE_PAGE_STATUS.YEARS) {
            content = <TableYearsWindow years={this.years} callback={this.close_years_window}/>
        }

        return content
    };
}

export default Table;
