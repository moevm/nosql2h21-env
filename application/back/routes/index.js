var express = require('express');
var router = express.Router();

let neo4j = require('neo4j-driver');
let creds = require("./extras/credentials");
let url = require("./extras/url")
let uploads_url = require("./extras/uploads_url")

let file_uploading = require('../file_uploading');

let db_info = require("./extras/db_info");
let init_db = require("./extras/init_db");

async function filter_request(states, interval, page, lines) {
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
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
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
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
        let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
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
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();

    let result = {
        success: undefined,
        error: undefined
    };
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

        result.success = true;
        return result;
    } catch (e) {
        console.log(e);
        result.success = false;
        result.error = e
        return result;
    } finally {
        await session.close();
        await driver.close();
    }
}

async function import_data(filename) {
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();
    try {
        await session.run("MATCH (n) DETACH DELETE n", {});
        let filepath = `http://${uploads_url}:8000/uploads/${filename}`;
        await session.run("USING PERIODIC COMMIT 10000 \
        LOAD CSV WITH HEADERS FROM $fpath AS line \
        FIELDTERMINATOR ';' \
        MERGE (address:Address {state: line.state, address: line.address}) \
        ON CREATE \
            SET address.state_code = toInteger(line.state_code), address.county_code = toInteger(line.county_code), \
            address.site_num = toInteger(line.site_num), address.county = line.county, address.city = line.city \
        MERGE (date:Date {date_local: line.date_local, year: toInteger(left(line.date_local, 4))}) \
        CREATE (address)-[:MEASURED { \
            unit_NO2: line.unit_NO2, \
            mean_NO2: line.mean_NO2, \
            firstMV_NO2: line.firstMV_NO2, \
            firstMH_NO2: line.firstMH_NO2, \
            aqi_NO2: line.aqi_NO2, \
            unit_O3: line.unit_O3, \
            mean_O3: line.mean_O3, \
            firstMV_O3: line.firstMV_O3, \
            firstMH_O3: line.firstMH_O3, \
            aqi_O3: line.aqi_O3, \
            unit_SO2: line.unit_SO2, \
            mean_SO2: line.mean_SO2, \
            firstMV_SO2: line.firstMV_SO2, \
            firstMH_SO2: line.firstMH_SO2, \
            aqi_SO2: line.aqi_SO2, \
            unit_CO: line.unit_CO, \
            mean_CO: line.mean_CO, \
            firstMV_CO: line.firstMV_CO, \
            firstMH_CO: line.firstMH_CO, \
            aqi_CO: line.aqi_CO \
        }]->(date)", {fpath: filepath});
        let res = await session.run("MATCH (n) RETURN n LIMIT 1", {});
        return res.records.length;
    } catch (e) {
        console.log(e);
        return -1;
    } finally {
        await session.close();
        await driver.close();
    }
}

router.get('/init', function(req, res) {
    init_db.import_initial_data().then(n => {
        res.send(n > 0);
    })
    .catch(err => {
        res.send(false);
    });
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

router.post('/add', async (req, res) => {
    if (!req.body) {
        res.send({
            success: false,
            error: 'Missing request body '
        })
    }

    add_line(req.body.data).then((value) => {
        res.send(value);
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
        let year_range = { min: 0, max: 0 };
        if (records.length > 0) {
            year_range = {
                min: records[0].get("min_year") ? records[0].get("min_year").toInt() : 0,
                max: records[0].get("max_year") ? records[0].get("max_year").toInt() : 0
            };
        }
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
    if (!req.query || !req.query.address) {
        res.send({});
        return;
    }
    console.log(req.query.address);
    db_info.get_geolocation(req.query.address).then((geolocation) => {
        console.log(geolocation);
        res.send(geolocation);
    });
});

router.post('/upload', file_uploading.single('new_csv'), (req, res) => {
    try {
        if (req.file) {
            import_data(req.file.filename)
            .then((n) => {
                res.send(n > 0);
            })
            .catch(err => res.send(false));
        }
        else {
            res.send(false);
        }
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
