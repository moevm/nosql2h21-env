var express = require('express');
var router = express.Router();

let neo4j = require('neo4j-driver');
let creds = require("../credentials.json");

async function filter_request(states, years) {
  // states = ['California', 'Arizona']
  // years = [2000, 2001]
  let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
  let session = driver.session();
  try {
      let res = await session.run("MATCH (location:Address)-[observation]->(date:Date) \
                WHERE location.state IN $state_list AND date.year IN $year_list \
                RETURN location.address AS address, location.county_code AS county_code, location.city AS city, \
                location.state AS state, location.state_code AS state_code, location.site_num AS site_num, date.date_local AS date_local, \
                observation.firstMH_O3 AS firstMH_O3, observation.firstMV_O3 AS firstMV_O3, observation.mean_O3 AS mean_O3, observation.unit_O3 AS unit_O3, observation.aqi_O3 AS aqi_O3, \
                observation.firstMH_NO2 AS firstMH_NO2, observation.firstMV_NO2 AS firstMV_NO2, observation.mean_NO2 AS mean_NO2, observation.unit_NO2 AS unit_NO2, observation.aqi_NO2 AS aqi_NO2, \
                observation.firstMH_CO AS firstMH_CO, observation.firstMV_CO AS firstMV_CO, observation.mean_CO AS mean_CO, observation.unit_CO AS unit_CO, observation.aqi_CO AS aqi_CO, \
                observation.firstMH_SO2 AS firstMH_SO2, observation.firstMV_SO2 AS firstMV_SO2, observation.mean_SO2 AS mean_SO2, observation.unit_SO2 AS unit_SO2, observation.aqi_SO2 AS aqi_SO2", 
                {state_list: states, year_list: years});
      return res.records;
  } catch (e) {
    console.log(e);
  } finally {
    await session.close();
    await driver.close();
  }
};

async function get_states() {
  let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
  let session = driver.session();
  try {
      let res = await session.run("MATCH (location:Address) RETURN DISTINCT location.state as state", {});
      return res.records;
  } catch (e) {
    console.log(e);
  } finally {
    await session.close();
    await driver.close();
  }
};

async function get_years() {
  let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
  let session = driver.session();
  try {
      let res = await session.run("MATCH (date:Date) RETURN max(date.year) as max_year, min(date.year) as min_year", {});
      return res.records;
  } catch (e) {
    console.log(e);
  } finally {
    await session.close();
    await driver.close();
  }
};


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/filter', (req, res) => {
  /*if (!req.body) {
    res.status(400);
    res.json({message: "Bad Request"});
  } else { */
    let states = ['California', 'Arizona'];
    let years = [2000, 2001];
    filter_request(states, years).then((records) => {
      res.send(records[0].toObject()); // to change
    });
  //}
});

router.get('/states', (req, res) => {
    get_states().then((records) => {
      let states = records.map((rec) => rec.get("state"));
      //console.log(states);
      res.send(states);
    });
});

router.get('/years', (req, res) => {
  get_years().then((records) => {
    let year_range = {
      min: records[0].get("min_year").toInt(),
      max: records[0].get("max_year").toInt()
    };
    //console.log(year_range);
    res.send(year_range);
  });
});


module.exports = router;
