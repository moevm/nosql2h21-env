import React, { Component } from 'react'
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fileName: "States.csv",
            fileType: "csv",
            fileDownloadUrl: null,
            status: "",
            data: [
                { state: "Arizona",        electors: 11 },
                { state: "Florida",        electors: 29 },
                { state: "Iowa",           electors:  6 },
                { state: "Michigan",       electors: 16 },
                { state: "North Carolina", electors: 15 },
                { state: "Ohio",           electors: 18 },
                { state: "Pennsylvania",   electors: 20 },
                { state: "Wisconsin",      electors: 10 },
            ]
        }
        this.download = this.download.bind(this);
    }

    download (event) {
        event.preventDefault();
        // Prepare the file
        let output;
            // Prepare data:
            let contents = [];
            contents.push (["State", "Electors"]);
            this.state.data.forEach(row => {
                contents.push([row.state, row.electors])
            });
            output = this.makeCSV(contents);

        // Download it
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState ({fileDownloadUrl: fileDownloadUrl},
            () => {
                this.dofileDownload.click();
                URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
                this.setState({fileDownloadUrl: ""})
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
            <button className={"home-button"}>Импорт данных</button>
        </div>
    )
  };
}

export default Home;
