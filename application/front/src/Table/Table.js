import React, {Component} from 'react'
import ColumnsWindow from "./ColumnsWindow/ColumnsWindow";
import StatesWindow from "./StatesWindow/StatesWindow";
import YearsWindow from "./YearsWindow/YearsWindow";
import NewRowWindow from "./NewRowWindow/NewRowWindow";
import InfiniteScroll from 'react-infinite-scroll-component';
import {columnsMap} from './columnsOptions'
import './Table.css';
import $ from "jquery"


const TABLE_PAGE_STATUS = {
    DISPLAY: 0,
    COLUMNS: 1,
    STATES: 2,
    YEARS: 3,
    NEW_ROW: 4
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

            data: [],
            has_more: true
        };

        this.page = 0;
        this.lines = 100;

        this.close_columns_window = this.close_columns_window.bind(this);
        this.close_states_window = this.close_states_window.bind(this);
        this.close_years_window = this.close_years_window.bind(this);
        this.close_new_row_window = this.close_new_row_window.bind(this);
        this.form_table_row = this.form_table_row.bind(this);
        this.fetch_data = this.fetch_data.bind(this);
    }

    componentDidMount() {
        this.filter();

        $.get('states', {}, (res) => {
            let states = [];
            res.forEach((value) => {
                states.push({name: value, check: true})
            });
            this.states = states;
        })

        $.get('years', {}, (res) => {
            let years = res;
            years.current_min = years.min;
            years.current_max = years.max;
            this.years = years;
        })
    }

    clear_data() {
        this.setState({data: []});
    }

    filter() {
        let states = this.states;
        if (states !== undefined) {
            states = states.filter((state) => state.check);
            states = states.map((state) => state.name);
        }

        let interval = this.years;
        if (interval !== undefined) {
            interval = {
                min: interval.current_min,
                max: interval.current_max
            };
        }

        $.get('filter', {states: states, interval: interval, page: this.page, lines: this.lines}, (res) => {
            this.setState({data: this.state.data.concat(res)});
        })
    }

    fetch_data() {
        this.page += 1;
        this.filter();
    }

    set_page_state(status) {
        this.setState({status: status});
    }

    close_columns_window(columns) {
        if (columns !== undefined) {
            if (JSON.stringify(this.columns) !== JSON.stringify(columns)) {
                this.setState({columns: columns});
            }
        }
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY);
    }

    close_states_window(states) {
        if (states !== undefined) {
            if (JSON.stringify(this.states) !== JSON.stringify(states)) {
                this.states = states;
                this.clear_data();
                this.filter();
            }
        }
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY);
    }

    close_years_window(years) {
        if (years !== undefined) {
            if (JSON.stringify(this.years) !== JSON.stringify(years)) {
                this.years = years;
                this.clear_data();
                this.filter();
            }
        }
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY);
    }

    close_new_row_window() {
        this.set_page_state(TABLE_PAGE_STATUS.DISPLAY);
    }

    form_table_row(line, id) {
        return (
            <tr className={'table-line'} key={id}>
                {Object.keys(this.state.columns).map((name, index) => {
                    if (this.state.columns[name]) {
                        let value;
                        if (line && typeof line === 'object') {
                            value = line[name];
                            return <td key={index}>{value}</td>;
                        }
                        else {
                            value = columnsMap[name];
                            return <th key={index}>{value}</th>;
                        }
                    }
                    else {
                        return '';
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
                            <InfiniteScroll next={this.fetch_data}
                                            hasMore={this.state.has_more}
                                            loader={''}
                                            dataLength={this.state.data.length}
                                            scrollableTarget={'data-table'}>
                                <table id='data-table' className={'table-border-none'}>
                                    <thead>
                                        {this.form_table_row()}
                                    </thead>
                                    <tbody>
                                        {this.state.data.map((observation, id) => this.form_table_row(observation, id))}
                                    </tbody>
                                </table>
                            </InfiniteScroll>
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
                        <br/>
                        <br/>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(TABLE_PAGE_STATUS.NEW_ROW)}>Новая запись</button>
                    </div>
                </div>
            );
        }
        else if (this.state.status === TABLE_PAGE_STATUS.COLUMNS) {
            content = <ColumnsWindow columns={this.state.columns} callback={this.close_columns_window}/>;
        }
        else if (this.state.status === TABLE_PAGE_STATUS.STATES) {
            content = <StatesWindow states={this.states} callback={this.close_states_window}/>;
        }
        else if (this.state.status === TABLE_PAGE_STATUS.YEARS) {
            content = <YearsWindow years={this.years} callback={this.close_years_window}/>;
        }
        else if (this.state.status === TABLE_PAGE_STATUS.NEW_ROW) {
            content = <NewRowWindow callback={this.close_new_row_window}/>;
        }

        return content;
    };
}

export default Table;
