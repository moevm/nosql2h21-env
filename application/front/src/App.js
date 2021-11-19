import React, { Component } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home/Home.js'
import Table from './Table/Table.js'
import './App.css';
import house from './house.svg'


class App extends Component {
    house_button_clicked = ( event ) => {
        if( event.button === 0 ) {
            window.location.assign('/');
        }
        else if( event.button === 1 ) {
            window.open('/');
        }
    }

    table_button_clicked = ( event ) => {
        if( event.button === 0 ) {
            window.location.assign('/table');
        }
        else if( event.button === 1 ) {
            window.open('/table');
        }
    }

    render() {
        return (
            <div>
                <div id='site-header' role='banner'>
                    <img src={house} id='house' onMouseDown={this.house_button_clicked} alt='home'/>
                    <button className={'site-header__button'}>Карта</button>
                    <button className={'site-header__button'}>Статистика</button>
                    <button className={'site-header__button'} onMouseDown={this.table_button_clicked}>Таблица</button>
                </div>
                <div id="content">
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Home/>} />
                            <Route path='/table' element={<Table/>} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        )
    };
}

export default App;
