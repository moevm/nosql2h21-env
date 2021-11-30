let neo4j = require('neo4j-driver');
let creds = require("./credentials.json");
// var env = require('node-env-file');
// env(__dirname + '/.env');
// // YOU HAVE TO CREATE .env file in current directory with following content:
// //NEO4J_PROTOCOL=http
// // NEO4J_HOST=127.0.0.1
// // NEO4J_PORT=7474
// // NEO4J_USERNAME=neo4j
// // NEO4J_PASSWORD=your neo4j password
let apoc = require('apoc');


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

async function get_states_geolocation() {
        let state = 'Arizona'
        console.log(state);
        let geolocation = get_states_location().then(async (location) => {
            let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));
            let geolocation = {};
            let session = driver.session();
            console.log(location[state]);
            try {

                let res = apoc.query('CALL apoc.spatial.geocodeOnce(\'%locate%\') YIELD location RETURN location.latitude AS latitude, location.longitude AS longitude',  {locate: location[state].toString() }).exec().then(
                    function (response) {
                        console.log(1);
                        console.log(response[0]);
                        //console.log(response.data.toObject());
                        //console.log(response.data[0]);
                        //console.log(response.get('data'));
                        //console.log(response.get(data));
                        console.log(1);
                    },
                    function (fail) {
                        console.log(2);
                        console.log(fail);
                    }
                    //geolocation[state] = res.records[0].get("latitude") + " " + res.records[0].get("longitude");
                );


                console.log(3);
                console.log(res);
                geolocation[state] = 1;//res.records[0].get("latitude") + " " + res.records[0].get("longitude");
                //console.log(geolocation[state]);
                /*let res = await session.run(`CALL apoc.spatial.geocodeOnce('$location')\
                YIELD location \
                RETURN location.latitude AS latitude, location.longitude AS longitude`,
                    {location: location[state]});

                geolocation[state] = res.records[0].get("latitude") + " " + res.records[0].get("longitude");
                console.log(geolocation[state]);*/
            } catch (e) {
                console.log(e);
            } finally {
                await session.close();
            }
                await driver.close();
                return geolocation;
        });
        return geolocation;

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
exports.get_states_geolocation= get_states_geolocation;
exports.get_years = get_years;
