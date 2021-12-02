let neo4j = require("neo4j-driver");
let creds = require("../routes/extras/credentials");
let filename = "'file:///pollution_us_2000_2016_qm.csv'";

async function import_initial_data() {
    let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
    let session = driver.session();
    try {
        let n = await session.run("MATCH (n) RETURN n LIMIT 10", {});
        if (n.records.length == 0) {
            await session.run(":auto USING PERIODIC COMMIT 10000 \
            LOAD CSV WITH HEADERS FROM $filename AS line \
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
            }]->(date)", {filename: filename});
        }
    } catch (e) {
      console.log(e);
    } finally {
      await session.close();
      await driver.close();
    }
}

exports.import_initial_data = import_initial_data;