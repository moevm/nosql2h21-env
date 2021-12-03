import React, { Component } from 'react'
import './Home.css';
import $ from "jquery";


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file_name: 'States.csv',
            download_URL: undefined,
            status: ''
        };

        this.download = this.download.bind(this);
        this.upload = this.upload.bind(this);
        this.open_file = this.open_file.bind(this);
    }

    download () {
        $.get('/exportreq', {}, (data) => {
            // Prepare data:
            let contents = [
                [
                    'state_code', 'county_code', 'site_num', 'address', 'state', 'county', 'city', 'date_local',
                    'unit_NO2', 'mean_NO2', 'firstMV_NO2', 'firstMH_NO2', 'aqi_NO2',
                    'unit_O3', 'mean_O3', 'firstMV_O3', 'firstMH_O3', 'aqi_O3',
                    'unit_SO2', 'mean_SO2', 'firstMV_SO2', 'firstMH_SO2', 'aqi_SO2',
                    'unit_CO', 'mean_CO', 'firstMV_CO', 'firstMH_CO', 'aqi_CO'
                ]
            ];
            contents = contents.concat(data.map((row) => {
                return [
                    row.state_code, row.county_code, row.site_num, row.address,
                    row.state, row.county, row.city, row.date_local,
                    row.unit_NO2, row.mean_NO2, row.firstMV_NO2, row.firstMH_NO2, row.aqi_NO2,
                    row.unit_O3, row.mean_O3, row.firstMV_O3, row.firstMH_O3, row.aqi_O3,
                    row.unit_SO2, row.mean_SO2, row.firstMV_SO2, row.firstMH_SO2, row.aqi_SO2,
                    row.unit_CO, row.mean_CO, row.firstMV_CO, row.firstMH_CO, row.aqi_CO
                ]
            }));

            // Prepare the file
            let output = this.make_CSV(contents);

            // Download it
            const blob = new Blob([output]);
            const fileDownloadUrl = URL.createObjectURL(blob);
            this.setState ({download_URL: fileDownloadUrl},() => {
                this.downloader.click();
                URL.revokeObjectURL(fileDownloadUrl);   // free up storage – no longer needed.
                this.setState({download_URL: ''});
            })
        })
    }

    make_CSV (content) {
        let csv = '';
        content.forEach(value => {
            value.forEach((item, i) => {
                let innerValue = item === null ? '' : item.toString();
                let result = innerValue.replace(/"/g, '""');
                if (result.search(/([",\n])/g) >= 0) {
                    result = '"' + result + '"';
                }
                if (i > 0) {
                    csv += ';';
                }
                csv += result;
            })
            csv += '\n';
        })
        return csv;
    }

    upload() {
        this.uploader.click();
    }

    open_file(event) {
        let status = [];    // Status output
        const file_object = event.target.files[0];
        const reader = new FileReader();

        let loaded_callback = (event) => {
            // e.target.result is the file's content as text
            const contents = event.target.result;
            status.push(`File name: '${file_object.name}'. Length: ${contents.length} bytes.`);

            const beginning = contents.substring(0,50);
            status.push(`First 50 characters of the file:\n${beginning}`);
            this.setState({status: status.join('\n')});
        }

        // Mainline of the method
        loaded_callback = loaded_callback.bind(this);
        reader.onload = loaded_callback;
        reader.readAsText(file_object);
    }

    render() {

    return (
        <div id={'home-box'}>
            <button className={'home-button'}
                    onClick={this.download}>Экспорт данных</button>
            <a hidden={true}
               download={this.state.file_name}
               href={this.state.download_URL}
               ref={element => this.downloader = element}
            >download it</a>

            <br/>

            <button className={'home-button'}
                    onClick={this.upload}>Импорт данных</button>
            <input type={'file'} hidden={true}
                   multiple={false}
                   accept={'.csv'}
                   onChange={evt => this.open_file(evt)}
                   ref={element => this.uploader = element}
            />
            <pre className={'status'}>{this.state.status}</pre>
        </div>
    )
  };
}

export default Home;
