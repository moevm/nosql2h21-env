let neo4j = require('neo4j-driver');
let creds = require("./credentials");
let url = require("./url")


async function get_states() {
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
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
  }

async function get_states_location() {
    let location = get_states().then(async (records) => {
        let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
        let location = {};
        for (let record of records) {
            let state = record.get("state");
            let session = driver.session();
            try {
                let res = await session.run(`MATCH (location:Address)\
                WHERE location.state = $state AND location.city <> "Not in a city"\
                RETURN DISTINCT location.city AS city`,
                {state: state});
                if (res.records.length > 0) {
                    location[state] = res.records[0].get("city") +", USA";
                }
            } catch(e) {
                console.log(e);
            } finally {
                await session.close();
            }
        }
        await driver.close();
        return location;
    });
    return location;
}

async function get_geolocation(address) {
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();
    let geolocation;
    try {
        let res = await session.run("CALL apoc.spatial.geocodeOnce($address) YIELD location\
        RETURN location.latitude as latitude, location.longitude as longitude", {address: address});
        if (res.records.length > 0) {
            geolocation = res.records[0].toObject();
        }
    } catch (err) {
        console.log(err);
    } finally {
        await session.close();
        await driver.close();
        return geolocation;
    }
}

async function get_years() {
    let driver = neo4j.driver(url, neo4j.auth.basic(creds.user, creds.password));
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
  }

exports.get_states= get_states;
exports.get_states_location= get_states_location;
exports.get_years = get_years;
exports.get_geolocation = get_geolocation;
