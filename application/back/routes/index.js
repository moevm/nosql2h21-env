var express = require('express');
var router = express.Router();

let neo4j = require('neo4j-driver');
let creds = require("../credentials.json");
let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));

async function filter_request(states, years) {
  // states = ['California', 'Arizona']
  // years = [2000, 2001]
  let session = driver.session();
  try {
      let res = await session.run("MATCH (address:Address)-[observation]->(date:Date) \
                WHERE address.state IN $state_list AND date.year IN $year_list \
                RETURN address, date, observation", {state_list: states, year_list: years});
      //console.log(res.records[0]);
      return res.records[0];
  } catch (e) {
    console.log(e);
  } finally {
    await session.close();
    await driver.close();
  }
};

/* GET home page. */
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
      console.log(records);
      res.send(records); // to change
    });
  //}
});


module.exports = router;
