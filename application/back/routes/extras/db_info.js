let neo4j = require('neo4j-driver');
let creds = require("./credentials.json");

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
  }

async function get_states_location() {
    let location = get_states().then(async (records) => {
        let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
        let location = {};
        for (let record of records) {
            let state = record.get("state");
            let session = driver.session();
            try {
                let res = await session.run(`MATCH (location:Address)\
                WHERE location.state = $state\
                RETURN DISTINCT location.address AS address, location.county AS county, location.city AS city`,
                {state: state});
                if (res.records.length > 0) {
                    location[state] = res.records[0].get("address") +" "+ state +" "+ res.records[0].get("county") +" "+ res.records[0].get("city");
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
  }

exports.get_states= get_states;
exports.get_states_location= get_states_location;
exports.get_years = get_years;