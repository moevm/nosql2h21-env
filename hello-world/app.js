let neo4j = require('neo4j-driver');
let creds = require("./credentials.json");
let driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic(creds.user, creds.password));

async function create_db() {
    let session = driver.session();
    try {
        let n = await session.run("MATCH (n) RETURN n", {});
        if (n.records.length > 0) {
            await session.run("MATCH (n) DETACH DELETE n", {});
        }
        await session.run("CREATE (God:Character {name:'God', type: 'Supernatural Being', description: 'God'}) \
                            CREATE (Metatron:Character {name:'Metatron', type: 'Supernatural Being', description: 'The Voice of God'}) \
                            CREATE (Aziraphale:Character {name:'Aziraphale', type: 'Supernatural Being', description: 'An angel, and part-time rare-book dealer'}) \
                            CREATE (Satan:Character {name:'Satan', type: 'Supernatural Being', description: 'A Fallen Angel; the Adversary'}) \
                            CREATE (Crowley:Character {name:'Crowley', type: 'Supernatural Being', description: 'An Angel who did not so much Fall as Saunter Vaguely Downwards'}) \
                            CREATE (Thou:Character {name:'Thou-Shalt-Not-Commit-Adultery Pulsifer', type: 'Human', description: 'A Witchfinder'}) \
                            CREATE (Agnes:Character {name:'Agnes Nutter', type: 'Human', description: 'A Prophetess'}) \
                            CREATE (Newton:Character {name:'Newton Pulsifer', type: 'Human', description: 'Wages Clerk and Witchfinder Private'}) \
                            CREATE (Anathema:Character {name:'Anathema Device', type: 'Human', description: 'Practical Occultist and Professional Descendant'}) \
                            CREATE (Adam:Character {name:'Adam', type: 'Them', description: 'An Antichrist'}) \
                            CREATE (Dog:Character {name:'Dog', description: 'Satanical hellhound and cat-worrier'}) \
                            CREATE (God)-[:INTERACTS_WITH]->(Metatron),\
                            (Metatron)-[:INTERACTS_WITH]->(God), \
                            (Metatron)-[:INTERACTS_WITH]->(Aziraphale), \
                            (Aziraphale)-[:INTERACTS_WITH]->(Metatron), \
                            (Aziraphale)-[:INTERACTS_WITH]->(Crowley), \
                            (Aziraphale)-[:INTERACTS_WITH]->(Adam), \
                            (Aziraphale)-[:INTERACTS_WITH]->(Anathema), \
                            (Satan)-[:INTERACTS_WITH]->(Crowley), \
                            (Satan)-[:INTERACTS_WITH]->(Dog),\
                            (Satan)-[:INTERACTS_WITH]->(Adam),\
                            (Crowley)-[:INTERACTS_WITH]->(Satan), \
                            (Crowley)-[:INTERACTS_WITH]->(Aziraphale), \
                            (Crowley)-[:INTERACTS_WITH]->(Adam), \
                            (Crowley)-[:INTERACTS_WITH]->(Anathema), \
                            (Thou)-[:INTERACTS_WITH]->(Agnes), \
                            (Thou)-[:INTERACTS_WITH]->(Newton), \
                            (Agnes)-[:INTERACTS_WITH]->(Thou), \
                            (Agnes)-[:INTERACTS_WITH]->(Anathema), \
                            (Newton)-[:INTERACTS_WITH]->(Anathema), \
                            (Newton)-[:INTERACTS_WITH]->(Thou), \
                            (Anathema)-[:INTERACTS_WITH]->(Agnes), \
                            (Anathema)-[:INTERACTS_WITH]->(Adam), \
                            (Anathema)-[:INTERACTS_WITH]->(Newton), \
                            (Anathema)-[:INTERACTS_WITH]->(Aziraphale), \
                            (Anathema)-[:INTERACTS_WITH]->(Crowley), \
                            (Adam)-[:INTERACTS_WITH]->(Dog), \
                            (Adam)-[:INTERACTS_WITH]->(Crowley), \
                            (Adam)-[:INTERACTS_WITH]->(Aziraphale), \
                            (Adam)-[:INTERACTS_WITH]->(Anathema), \
                            (Adam)-[:INTERACTS_WITH]->(Satan), \
                            (Dog)-[:INTERACTS_WITH]->(Adam), \
                            (Dog)-[:INTERACTS_WITH]->(Satan)", {});
        let num_char = await session.run("MATCH (Adam:Character)-[:INTERACTS_WITH]->(ch:Character) \
                                          WHERE Adam.name = $name \
                                          RETURN count(ch) AS num", {name: 'Adam'});
        console.log(`Adam interacts with ${num_char.records[0].get("num").toInt()} characters`);
    } catch (e) {
      console.log(e);
    } finally {
      await session.close();
      await driver.close();
    }
};

create_db();
