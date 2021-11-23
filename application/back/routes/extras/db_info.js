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
exports.get_years = get_years;