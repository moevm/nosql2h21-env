var express = require('express');
var router = express.Router();

let neo4j = require('neo4j-driver');
let creds = require("./extras/credentials.json");

let db_info = require("./extras/db_info");

async function get_hist_data(substance, interval) {
    let hist_data = db_info.get_states().then(async (records) => {
        let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic(creds.user, creds.password));
        let hist_data = {};
        for (let record of records) {
            let state = record.get("state");
            let session = driver.session();
            try {
                let res = await session.run(`MATCH (location:Address)-[observation]->(date:Date) \
                WHERE location.state = $state AND date.year = $min_year \
                RETURN location.state AS state, \
                avg(toFloat(observation.mean_${substance})) AS mean`, 
                {state: state, min_year: interval.min});
                if (res.records.length > 0) {
                    hist_data[state] = res.records[0].get("mean");
                }
            } catch(e) { 
                console.log(e); 
            } finally { 
                await session.close(); 
            }
        }
        await driver.close();
        return hist_data;
    });
    return hist_data;
}

router.get("/plots", (req, res) => {
});

router.get("/hist", (req, res) => {
    // x: state
    // y: concentration
    // avg: all locations in each state, on a chosen time interval
    // var: substance, time
    if (!req.body) {
        res.status(400);
        res.json({message: "Bad Request"});
    }
    let substance = req.body.substance || "NO2";
    let interval = req.body.interval;
    if (!interval) {
        db_info.get_years().then((records) => {
            interval = {
                min: records[0].get("min_year").toInt(),
                max: records[0].get("max_year").toInt()
            };
            get_hist_data(substance, interval).then((hist_data) => {
                console.log(hist_data);
                res.send(hist_data);
            });
        });
        return;    
    }
    //console.log(substance);
    //console.log(interval);
    get_hist_data(substance, interval).then((hist_data) => {
        console.log(hist_data);
        res.send(hist_data);
    });
});

module.exports = router;