import React, { Component } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home/Home'
import Map from './Map/Map'
import Statistics from './Statistics/Statistics';
import Table from './Table/Table'
import './App.css';
import house from './house.svg'
import logo from './logo.svg'
import $ from 'jquery'
import prefix from "./prefix";


const APP_STATUS = {
    HOME: 0,
    MAP: 1,
    STATISTICS: 2,
    TABLE: 3
};


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            block: false,

            status: APP_STATUS.HOME
        };

        this.block = this.block.bind(this);

        /*$.get(prefix + '/years', {}, (res) => {
            this.years = res;
        })*/
    }

    componentDidMount() {
        this.block(true);
        $.get(prefix + '/init', {}, (res) => {
            if (res) {
                $.get(prefix + '/years', {}, (res) => {
                    this.years = res;
                    this.block(false);
                })
                //this.block(false);
            }
            else {
                alert('Возникли проблемы. Загрузки можно даже не ждать');
            }
        })
    }

    block(check) {
        this.setState({block: check});
    }

    house_button_clicked = ( event ) => {
        this.setState({status: APP_STATUS.HOME});
    }

    map_button_clicked = (event) => {
        this.setState({status: APP_STATUS.MAP});
    }

    statistics_button_clicked = (event) => {
        this.setState({status: APP_STATUS.STATISTICS});
    }

    table_button_clicked = (event) => {
        this.setState({status: APP_STATUS.TABLE});
    }

    render() {
        let block = '';
        if (this.state.block) {
            block = (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <p>
                            Loading... Please Wait...
                        </p>
                    </header>
                </div>
            );
        }

        let content;
        if (this.state.status === APP_STATUS.HOME) {
            content = <Home years={this.years} block={this.block}/>;
        }
        else if (this.state.status === APP_STATUS.MAP) {
            content = <Map years={this.years} block={this.block}/>;
        }
        else if (this.state.status === APP_STATUS.STATISTICS) {
            content = <Statistics years={this.years} block={this.block}/>;
        }
        else if (this.state.status === APP_STATUS.TABLE) {
            content = <Table years={this.years} block={this.block}/>;
        }

        return (
            <div>
                <div id='site-header' role='banner'>
                    <div id={'house-frame'}>
                        <img src={house} id='house' onMouseDown={this.house_button_clicked} alt='home'/>
                    </div>
                    <button className={'site-header__button'} onMouseDown={this.map_button_clicked}>Карта</button>
                    <button className={'site-header__button'} onMouseDown={this.statistics_button_clicked}>Статистика</button>
                    <button className={'site-header__button'} onMouseDown={this.table_button_clicked}>Таблица</button>
                </div>
                <div id="content">
                    {content}
                </div>
                {block}
            </div>
        );
    };
}

export default App;
