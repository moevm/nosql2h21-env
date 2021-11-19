import React, { Component } from 'react'
import TableColumnsWindow from "./TableColumnsWindow/TableColumnsWindow";
import { columnsMap } from './columnsOptions'
import './Table.css';


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
            }
        }
        this.close_columns_window = this.close_columns_window.bind(this)
        this.get_tr = this.get_tr.bind(this)
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

    get_tr(line) {
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
                                    {this.get_tr()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id='table-box-right'>
                        <button className={'table-box-right__button'}
                                onClick={() => this.set_page_state(PAGE_STATUS.COLUMNS)}>Выбор колонок</button>
                        <br/>
                        <br/>
                        <button className={'table-box-right__button'}>Выбор штатов</button>
                        <br/>
                        <button className={'table-box-right__button'}>Выбор веществ</button>
                        <br/>
                        <button className={'table-box-right__button'}>Выбор годов</button>
                    </div>
                </div>
            )
        }
        else if (this.state.status === PAGE_STATUS.COLUMNS) {
            content = <TableColumnsWindow columns={this.state.columns} callback={this.close_columns_window}/>
        }

        return content
    };
}

export default Table;
