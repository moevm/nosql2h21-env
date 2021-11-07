import React, { Component } from 'react'
import './Home.css';


class Home extends Component {
  render() {
    return (
        <div id="home-box">
            <button className={"home-button"}>Импорт данных</button>
            <br/>
            <button className={"home-button"}>Экспорт данных</button>
        </div>
    )
  };
}

export default Home;
