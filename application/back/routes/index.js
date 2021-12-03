var express = require('express');
var router = express.Router();

let neo4j = require('neo4j-driver');
let creds = require("./extras/credentials.json");

let db_info = require("./extras/db_info");

async function filter_request(states, interval, page, lines) {
    let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();

    lines = parseInt(lines);
    page = parseInt(page);
    let skip = page*lines;
    try {
        let res = await session.run("MATCH (location:Address)-[observation]->(date:Date) \
                WHERE location.state IN $state_list AND date.year >= $min_year AND date.year <= $max_year \
                RETURN location.address AS address, location.county_code AS county_code, location.city AS city, location.county AS county,\
                location.state AS state, location.state_code AS state_code, location.site_num AS site_num, date.date_local AS date_local, \
                observation.firstMH_O3 AS firstMH_O3, observation.firstMV_O3 AS firstMV_O3, observation.mean_O3 AS mean_O3, observation.unit_O3 AS unit_O3, observation.aqi_O3 AS aqi_O3, \
                observation.firstMH_NO2 AS firstMH_NO2, observation.firstMV_NO2 AS firstMV_NO2, observation.mean_NO2 AS mean_NO2, observation.unit_NO2 AS unit_NO2, observation.aqi_NO2 AS aqi_NO2, \
                observation.firstMH_CO AS firstMH_CO, observation.firstMV_CO AS firstMV_CO, observation.mean_CO AS mean_CO, observation.unit_CO AS unit_CO, observation.aqi_CO AS aqi_CO, \
                observation.firstMH_SO2 AS firstMH_SO2, observation.firstMV_SO2 AS firstMV_SO2, observation.mean_SO2 AS mean_SO2, observation.unit_SO2 AS unit_SO2, observation.aqi_SO2 AS aqi_SO2\
                SKIP toInteger($skipNumber) LIMIT toInteger($limitNumber)",
                {state_list: states, min_year: interval.min, max_year: interval.max, skipNumber:skip, limitNumber:lines});
        return res.records;
    } catch (e) {
        console.log(e);
    } finally {
        await session.close();
        await driver.close();
    }
}

async function export_request() {
    let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();

    try {
        let res = await session.run("MATCH (location:Address)-[observation]->(date:Date) \
                RETURN location.address AS address, location.county_code AS county_code, location.city AS city, location.county AS county,\
                location.state AS state, location.state_code AS state_code, location.site_num AS site_num, date.date_local AS date_local, \
                observation.firstMH_O3 AS firstMH_O3, observation.firstMV_O3 AS firstMV_O3, observation.mean_O3 AS mean_O3, observation.unit_O3 AS unit_O3, observation.aqi_O3 AS aqi_O3, \
                observation.firstMH_NO2 AS firstMH_NO2, observation.firstMV_NO2 AS firstMV_NO2, observation.mean_NO2 AS mean_NO2, observation.unit_NO2 AS unit_NO2, observation.aqi_NO2 AS aqi_NO2, \
                observation.firstMH_CO AS firstMH_CO, observation.firstMV_CO AS firstMV_CO, observation.mean_CO AS mean_CO, observation.unit_CO AS unit_CO, observation.aqi_CO AS aqi_CO, \
                observation.firstMH_SO2 AS firstMH_SO2, observation.firstMV_SO2 AS firstMV_SO2, observation.mean_SO2 AS mean_SO2, observation.unit_SO2 AS unit_SO2, observation.aqi_SO2 AS aqi_SO2\
                LIMIT 50000",
            //LIMIT 50
            {});
        return res.records;
    } catch (e) {
        console.log(e);
    } finally {
        await session.close();
        await driver.close();
    }
}

async function map_request(substance, interval) {
    let map_data = db_info.get_states().then(async (records) => {
        let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
        let map_data = {};
        let zero = 0;
        for (let record of records) {
            let state = record.get("state");
            let session = driver.session();
            try {
                if (!!substance) {
                    let res = await session.run(`MATCH (location:Address)-[observation]->(date:Date) \
                    WHERE location.state = $state AND date.year >= $min_year AND date.year <= $max_year \
                    RETURN location.state AS state, \
                    avg(toFloat(observation.mean_${substance})) AS mean`,
                        {state: state, min_year: interval.min, max_year: interval.max});
                    if (res.records.length > 0) {
                        map_data[state] = res.records[0].get("mean");
                    }

                } else {
                    let res = await session.run(`MATCH (location:Address)-[observation]->(date:Date) \
                    WHERE location.state = $state AND date.year >= $min_year AND date.year <= $max_year \
                    RETURN location.state AS state, \
                    avg(toFloat(${zero})) AS mean`,
                        {state: state, min_year: interval.min, max_year: interval.max});
                    if (res.records.length > 0) {
                        map_data[state] = res.records[0].get("mean");
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                await session.close();
                //await driver.close();
            }
        }
        await driver.close();
        return map_data;
    });
    return map_data;
}

async function add_line(data) {
    let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();

    try {
        await session.run("MERGE (address:Address {state: $state, address: $address})\
                                ON CREATE\
                                SET address.state_code = toInteger($state_code), address.county_code = toInteger($county_code),\
                                address.site_num = toInteger($site_num), address.county = $county, address.city = $city\
                                MERGE (date:Date {date_local: $date_local, year: toInteger(left($date_local, 4))})\
                                CREATE (address)-[:MEASURED {\
                                unit_NO2: $unit_NO2,\
                                mean_NO2: $mean_NO2,\
                                firstMV_NO2: $firstMV_NO2,\
                                firstMH_NO2: $firstMH_NO2,\
                                aqi_NO2: $aqi_NO2,\
                                unit_O3: $unit_O3,\
                                mean_O3: $mean_O3,\
                                firstMV_O3: $firstMV_O3,\
                                firstMH_O3: $firstMH_O3,\
                                aqi_O3: $aqi_O3,\
                                unit_SO2: $unit_SO2,\
                                mean_SO2: $mean_SO2,\
                                firstMV_SO2: $firstMV_SO2,\
                                firstMH_SO2: $firstMH_SO2,\
                                aqi_SO2: $aqi_SO2,\
                                unit_CO: $unit_CO,\
                                mean_CO: $mean_CO,\
                                firstMV_CO: $firstMV_CO,\
                                firstMH_CO: $firstMH_CO,\
                                aqi_CO: $aqi_CO\
                                }]->(date)",
            {state_code: data.state_code, county_code: data.county_code, site_num: data.site_num, address : data.address, state : data.state, county: data.county, city: data.city, date_local: data.date_local,
                unit_NO2: data.unit_NO2, mean_NO2 : data.mean_NO2, firstMV_NO2 : data.firstMV_NO2, firstMH_NO2 : data.firstMH_NO2, aqi_O3 : data.aqi_O3,
                unit_O3 : data.unit_O3, mean_O3 : data.mean_O3, firstMV_O3 : data.firstMV_O3, firstMH_O3 : data.firstMH_O3, aqi_NO2 : data.aqi_NO2,
                unit_SO2 : data.unit_SO2, mean_SO2 : data.mean_SO2, firstMV_SO2 : data.firstMV_SO2, firstMH_SO2 : data.firstMH_SO2, aqi_CO : data.aqi_CO,
                unit_CO : data.unit_CO, mean_CO : data.mean_CO, firstMV_CO : data.firstMV_CO, firstMH_CO : data.firstMH_CO, aqi_SO2 : data.aqi_SO2});

        let err = "Success";
        return err;
    } catch (e) {
        console.log(e);
        err = "Error";
        return err;
    } finally {
        await session.close();
        await driver.close();
    }
}

router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/filter', async (req, res) => {
    let states = req.query.states || ['California', 'Arizona'];
    let interval = req.query.interval;

    // page is number of page in table
    // and lines is number of lines on the page
    // there is no control over pages and lines being out of rage
    let page = req.query.page || 0;
    let lines = req.query.lines || 100;

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

    filter_request(states, interval, page, lines).then((records) => {
        res.send(records.map((rec) => {
            let obj_rec = rec.toObject();
            for (let key in obj_rec) {
                if (neo4j.isInt(obj_rec[key])) {
                    obj_rec[key] = obj_rec[key].toInt();
                }
            }
            return obj_rec;
        }));
    });
});

router.get('/exportreq', async (req, res) => {

    export_request().then((records) => {
        res.send(records.map((rec) => {
            let obj_rec = rec.toObject();
            for (let key in obj_rec) {
                if (neo4j.isInt(obj_rec[key])) {
                    obj_rec[key] = obj_rec[key].toInt();
                }
            }
            return obj_rec;

        }));
        console.log("Send it");
    });
});

router.get('/add', async (req, res) => {

    let data = req.query.data ||
        {state_code: 4, county_code:13, site_num: 3002, address: '1645 E ROOSEVELT ST-CENTRAL PHOENIX STN', state: 'Arizona', county: 'Maricopa', city: 'Phoenix', date_local: '2000-04-05',
            unit_NO2: 'Parts per billion', mean_NO2: '39.5', firstMV_NO2: '68.0', firstMH_NO2: '0', aqi_NO2: '66',
            unit_O3: 'Parts per million', mean_O3: '0.01025', firstMV_O3: '0.0289999', firstMH_O3: '14', aqi_O3: '25',
            unit_SO2: 'Parts per billion', mean_SO2: '1.7619049999', firstMV_SO2: '6.0', firstMH_SO2: '2', aqi_SO2: '9.0',
            unit_CO: 'Parts per million', mean_CO: '1.523077', firstMV_CO: '2.0', firstMH_CO: '2', aqi_CO: '23.0'};
    add_line(data).then((err) => {
        res.send(err);

    });
});

router.get('/map', async (req, res) => {
    let substance = req.query.substance || "O3";
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

    map_request(substance, interval).then((map_data) => {
        res.send(map_data);
    });
});

router.get('/states', (req, res) => {
    db_info.get_states().then((records) => {
        let states = records.map((rec) => rec.get("state"));
        states = states.sort()
        //console.log(states);
        res.send(states);
    });
});

router.get('/years', (req, res) => {
    db_info.get_years().then((records) => {
        let year_range = {
            min: records[0].get("min_year").toInt(),
            max: records[0].get("max_year").toInt()
        };
        //console.log(year_range);
        res.send(year_range);
    });
});

router.get('/location', (req, res) => {
    db_info.get_states_location().then((location) => {
        res.send(location);
    });
});

router.get('/geolocation', (req, res) => {
    db_info.get_states_geolocation().then((geolocation) => {
        res.send(geolocation);
    });
});


module.exports = router;
