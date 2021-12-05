var express = require('express');
var router = express.Router();

let neo4j = require('neo4j-driver');
let creds = require("./extras/credentials");
let url = require("./extras/url")

let db_info = require("./extras/db_info");

async function get_hist_data(substance, interval) {
    let hist_data = db_info.get_states().then(async (records) => {
        let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
        let hist_data = {};
        for (let record of records) {
            let state = record.get("state");
            let session = driver.session();
            try {
                let res = await session.run(`MATCH (location:Address)-[observation]->(date:Date) \
                WHERE location.state = $state AND date.year >= $min_year AND date.year <= $max_year \
                RETURN location.state AS state, \
                avg(toFloat(observation.mean_${substance})) AS mean`, 
                {state: state, min_year: interval.min, max_year: interval.max});
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

async function get_plot_data(state, substance, interval) {
    // return an object {month-year: conc}
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
    let plot_data = {};
    for (let year = interval.min; year <= interval.max; year++) {
        for (let month = 1; month <= 12; month++) {
            let session = driver.session();
            try {
                let res;
                if (state === "WHOLE COUNTRY") {
                    res = await session.run(`MATCH (location:Address)-[observation]->(date:Date) \
                    WHERE date.year = $year AND date(date.date_local).month = $month \
                    RETURN avg(toFloat(observation.mean_${substance})) AS mean`, 
                    {year: year, month: month});
                } else {
                    res = await session.run(`MATCH (location:Address)-[observation]->(date:Date) \
                    WHERE location.state = $state AND date.year = $year AND date(date.date_local).month = $month \
                    RETURN avg(toFloat(observation.mean_${substance})) AS mean`, 
                    {state: state, year: year, month: month});
                }
                if (res.records.length > 0) {
                    plot_data[`${year}-${month}`] = res.records[0].get("mean");
                }
            } catch(e) { 
                console.log(e); 
            } finally { 
                await session.close(); 
            }
        }
    }

    // console.log(plot_data);
    await driver.close();
    return plot_data;
}

router.get("/plots", async (req, res) => {
    // x: time
    // y: concentration
    // avg: months
    // var: state (SEPARATE FOR THE WHOLE COUNTRY), substance, interval

    let state = req.query.state || "WHOLE COUNTRY";
    let substance = req.query.substance || "NO2";
    let interval = req.query.interval;

    if (!interval) {
        await db_info.get_years().then((records) => {
            interval = {
                min: records[0].get("min_year").toInt(),
                max: records[0].get("max_year").toInt()
            };
        });
    }
    else {
        interval = {
            min: +interval.min,
            max: +interval.max
        }
    }

    get_plot_data(state, substance, interval).then((plot_data) => {
        console.log(plot_data);
        res.send(plot_data);
    });
});

router.get("/hist", async (req, res) => {
    // x: state
    // y: concentration
    // avg: all locations in each state, on a chosen time interval
    // var: substance, time

    let substance = req.query.substance || "NO2";
    let interval = req.query.interval;

    if (!interval) {
        await db_info.get_years().then((records) => {
            interval = {
                min: records[0].get("min_year").toInt(),
                max: records[0].get("max_year").toInt()
            };
        });
    }
    else {
        interval = {
            min: +interval.min,
            max: +interval.max
        }
    }

    get_hist_data(substance, interval).then((hist_data) => {
        // console.log(hist_data);
        res.send(hist_data);
    });
});

module.exports = router;
