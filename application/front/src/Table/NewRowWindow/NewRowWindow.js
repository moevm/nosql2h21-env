import React, { Component } from 'react'
import { columnsLabels } from '../columnsOptions'
import './NewRowWindow.css';
import $ from "jquery";


class NewRowWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            observation: {

            }
        };
        for (let element of columnsLabels) {
            this.state.observation[element.value] = '';
        }
    }

    updateInput(event) {
        if (['state_code', 'county_code', 'site_num'].includes(event.target.name)) {
            let regex = /^\d*$/;
            if (!regex.test(event.target.value)) {
                return;
            }
        }

        if (['mean_NO2', 'firstMV_NO2', 'firstMH_NO2', 'aqi_NO2',
            'unit_O3', 'firstMV_O3', 'firstMH_O3', 'aqi_O3',
            'unit_SO2', 'firstMV_SO2', 'firstMH_SO2', 'aqi_SO2',
            'unit_CO', 'firstMV_CO', 'firstMH_CO', 'aqi_CO'].includes(event.target.name)) {

            let float = Number(event.target.value);
            console.log(float, event.target.value && !Number(event.target.value));
            if ((event.target.value && !Number(event.target.value)) || event.target.value.includes(' ')) {
                return;
            }
        }

        let observation = this.state.observation;
        observation[event.target.name] = event.target.value;
        this.setState({observation: observation});
    }

    post() {
        if (this.state.observation['state_code'] === '') {
            alert('Укажите код штата');
            return;
        }

        if (this.state.observation['county_code'] === '') {
            alert('Укажите код округа');
            return;
        }

        if (this.state.observation['site_num'] === '') {
            alert('Укажите код площадки');
            return;
        }

        if (this.state.observation['address'] === '') {
            alert('Укажите адресс');
            return;
        }

        if (this.state.observation['state'] === '') {
            alert('Укажите штат');
            return;
        }

        if (this.state.observation['county'] === '') {
            alert('Укажите округ');
            return;
        }

        if (this.state.observation['city'] === '') {
            alert('Укажите город');
            return;
        }

        if (this.state.observation['date_local'] === '') {
            alert('Укажите дату');
            return;
        }

        if (this.state.observation['unit_NO2'] === '') {
            alert('Укажите единицу измерения NO2');
            return;
        }

        if (this.state.observation['unit_O3'] === '') {
            alert('Укажите единицу измерения O3');
            return;
        }

        if (this.state.observation['unit_SO2'] === '') {
            alert('Укажите единицу измерения SO2');
            return;
        }

        if (this.state.observation['unit_CO'] === '') {
            alert('Укажите единицу измерения CO');
            return;
        }

        $.post('/add', {data: this.state.observation}, (result) => {
            if (!result.success) {
                alert('Ошибка (да, это все сообщение)');
                console.log(result.error);
            }
        })
    }

    render() {
        return (
            <div id={'new-row'}>
                <h2>Введите параметры наблюдения</h2>

                {columnsLabels.map((element, id) => {
                    let type = element.value !== 'date_local' ? 'text' : 'date';


                    return (
                        <div className={'new-row__input-wrapper'}>
                            <label key={id}>
                                {element.label}

                                <input className={'new-row__input'}
                                       type={type} name={element.value} value={this.state.observation[element.value]}
                                       onChange={(event) => this.updateInput(event)}/>
                            </label>
                        </div>
                    );
                })}


                <button className={'modal-window__confirm'}
                        onClick={() => {this.post()}}>Добавить</button>
                <button className={'modal-window__close'}
                        onClick={() => {this.props.callback()}}>x</button>
            </div>
        );
    };
}

export default NewRowWindow;
