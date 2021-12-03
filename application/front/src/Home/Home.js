import React, { Component } from 'react'
import './Home.css';
import $ from "jquery";

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fileName: "States.csv",
            fileType: "csv",
            fileDownloadUrl: null,
            status: "",
            data: []
        }
        this.download = this.download.bind(this);
        this.upload = this.upload.bind(this);
        this.openFile = this.openFile.bind(this);
    }

    download (event) {
        $.get('/exportreq', {}, (obj_rec) => {
            console.log("Got it");

            this.setState({data: obj_rec})

            event.preventDefault();
            // Prepare the file
            let output;
            // Prepare data:
            let contents = [];
            contents.push (["address", "county_code","city","county","state","state_code","site_num","date_local","firstMH_O3","firstMV_O3","mean_O3","unit_O3","aqi_O3","firstMH_NO2","firstMV_NO2","mean_NO2","unit_NO2","aqi_NO2","firstMH_CO","firstMV_CO","mean_CO","unit_CO","aqi_CO","firstMH_SO2","firstMV_SO2","mean_SO2","unit_SO2","aqi_SO2"]);
            this.state.data.forEach(row => {
                contents.push([row.address, row.county_code,row.city,row.county,row.state,row.state_code,row.site_num,row.date_local,row.firstMH_O3,row.firstMV_O3,row.mean_O3,row.unit_O3,row.aqi_O3,row.firstMH_NO2,row.firstMV_NO2,row.mean_NO2,row.unit_NO2,row.aqi_NO2,row.firstMH_CO,row.firstMV_CO,row.mean_CO,row.unit_CO,row.aqi_CO,row.firstMH_SO2,row.firstMV_SO2,row.mean_SO2,row.unit_SO2,row.aqi_SO2]);
            });

            output = this.makeCSV(contents);
            this.setState ({data: []});
            // Download it
            const blob = new Blob([output]);
            const fileDownloadUrl = URL.createObjectURL(blob);
            this.setState ({fileDownloadUrl: fileDownloadUrl},
                () => {
                    this.dofileDownload.click();
                    URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
                    this.setState({fileDownloadUrl: ""})
                })


        })


    }

    makeCSV (content) {
        let csv = '';
        content.forEach(value => {
            value.forEach((item, i) => {
                let innerValue = item === null ? '' : item.toString();
                let result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0) {
                    result = '"' + result + '"'
                }
                if (i > 0) {csv += ' '}
                csv += result;
            })
            csv += '\n';
        })
        return csv
    }

    upload(event) {
        event.preventDefault();
        this.dofileUpload.click()
    }

    openFile(evt) {
        let status = []; // Status output
        const fileObj = evt.target.files[0];
        const reader = new FileReader();

        let fileloaded = e => {
            // e.target.result is the file's content as text
            const fileContents = e.target.result;
            status.push(`File name: "${fileObj.name}". Length: ${fileContents.length} bytes.`);

            const firstnchar = fileContents.substring(0,50);
            status.push (`First 50 characters of the file:\n${firstnchar}`)
            this.setState ({status: status.join("\n")})
            console.log(status)
        }

        // Mainline of the method
        fileloaded = fileloaded.bind(this);
        reader.onload = fileloaded;
        reader.readAsText(fileObj);
    }

    render() {

    return (
        <div id="home-box">
            <button className={"home-button"}
                    onClick={this.download}>Экспорт данных</button>

            <a className="hidden"
               download={this.state.fileName}
               href={this.state.fileDownloadUrl}
               ref={e=>this.dofileDownload = e}
            >download it</a>
            <br/>

            <button className={"home-button"}
                    onClick={this.upload}>Импорт данных</button>

            <input type="file" className="hidden"
                   multiple={false}
                   accept=".csv"
                   onChange={evt => this.openFile(evt)}
                   ref={e=>this.dofileUpload = e}
            />
            <pre className="status">{this.state.status}</pre>
        </div>
    )
  };
}

export default Home;
