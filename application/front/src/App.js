import React, { Component } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home/Home'
import Map from './Map/Map'
import Statistics from './Statistics/Statistics';
import Table from './Table/Table'
import './App.css';
import house from './house.svg'
import logo from './logo.svg'


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            block: false
        };
    }

    block(check) {
        this.setState({block: check});
    }

    house_button_clicked = ( event ) => {
        if( event.button === 0 ) {
            window.location.assign('/');
        }
        else if( event.button === 1 ) {
            window.open('/');
        }
    }

    map_button_clicked = (event) => {
        if (event.button === 0) {
            window.location.assign('/map');
        }
        else if (event.button === 1) {
            window.open('/map');
        }
    }

    statistics_button_clicked = (event) => {
        if (event.button === 0) {
            window.location.assign('/statistics');
        }
        else if (event.button === 1) {
            window.open('/statistics');
        }
    }

    table_button_clicked = (event) => {
        if (event.button === 0) {
            window.location.assign('/table');
        }
        else if (event.button === 1) {
            window.open('/table');
        }
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
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Home/>} />
                            <Route path='/map' element={<Map/>} />
                            <Route path='/statistics' element={<Statistics/>} />
                            <Route path='/table' element={<Table/>} />
                        </Routes>
                    </BrowserRouter>
                </div>
                {block}
            </div>
        );
    };
}

export default App;
