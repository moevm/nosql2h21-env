import React, { Component } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home/Home.js'
import './App.css';
import house from './house.svg'


class App extends Component {
    mouseDownHandler = ( event ) => {
        if( event.button === 0 ) {
            window.location.assign('/');
        }
        else if( event.button === 1 ) {
            window.open('/');
        }
    }

    render() {
        return (
            <div>
                <div id="site-header" role="banner">
                    <img src={house} id="house"></img>
                    <button className={"site-header__button"}>Карта</button>
                    <button className={"site-header__button"}>Статистика</button>
                    <button className={"site-header__button"}>Таблица</button>
                </div>
                <div id="content">
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Home/>} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        )
    };
}


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
