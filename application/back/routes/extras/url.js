module.exports = process.env.DOCKER ? 'bolt://neo4j' : 'neo4j://localhost'
