import React, { Component } from 'react'
import './Home.css';
import HelpWindow from "../HelpWindow";
import $ from "jquery";

const HOME_PAGE_STATUS = {
    DISPLAY: 0,
    HELP: 1,
};

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: HOME_PAGE_STATUS.DISPLAY,

            file_name: 'States.csv',
            download_URL: '',
            file_URL: '',
            file: '',
        };

        this.download = this.download.bind(this);
        this.upload = this.upload.bind(this);
        this.close_help_window = this.close_help_window.bind(this);

    }

    close_help_window(){
        this.set_page_state(HOME_PAGE_STATUS.DISPLAY);
    }

    download () {
        this.props.block(true)
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
                URL.revokeObjectURL(fileDownloadUrl);   // free up storage ??? no longer needed.
                this.setState({download_URL: ''});
            })
            this.props.block(false)
        })
    }

    make_CSV (content) {
        let csv = '';
        content.forEach(value => {
            value.forEach((item, i) => {
                let innerValue = (item === null || item === undefined) ? '' : item.toString();
                let result = innerValue.replace(/"/g, '""');
                if (result.search(/([",;\n])/g) >= 0) {
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

    upload_csv(event) {
        let size_lim = 100 * 1024 * 1024;
        let file = event.target.files[0];
        if (file.size > size_lim) {
            // ERROR HANDLER NEEDED
            return;
        }
        this.props.block(true);
        let data = new FormData();
        data.append('new_csv', file);
        fetch('/upload', {
            method: 'POST',
            body: data
        }).then(response => response.json())
        .then((result) => {
            console.log(result)
            this.props.block(false);
        })
        .catch((err) => console.log(err));
    }

    upload() {
        this.uploader.click();
    }

    set_page_state(status) {
        this.setState({status: status});
    }

    render() {

        let content;

        if (this.state.status === HOME_PAGE_STATUS.DISPLAY) {
            content = (
        <div id={'home-box'}>
            <button className={'home-button'}
                    onClick={this.download}>?????????????? ????????????</button>
            <a hidden={true}
               download={this.state.file_name}
               href={this.state.download_URL}
               ref={element => this.downloader = element}
            >download it</a>

            <br/>

            <button className={'home-button'}
                    onClick={this.upload}>???????????? ????????????</button>
            <input type={'file'} hidden={true}
                   multiple={false}
                   accept={'text/csv'}
                   onChange={evt => this.upload_csv(evt)}
                   ref={element => this.uploader = element}
            />
            <br/>
            <button className={'home-button'}
                    onClick={() => this.set_page_state(HOME_PAGE_STATUS.HELP)}>????????????</button>

        </div>
    )}
        else if (this.state.status === HOME_PAGE_STATUS.HELP) {
            content = <HelpWindow input={"Home"} callback={this.close_help_window}/>;
        }
        return content;
  };
}
export default Home;
