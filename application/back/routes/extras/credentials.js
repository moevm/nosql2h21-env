if (process.env.DOCKER) {
    module.exports = {
        user: process.env.USER,
        password: process.env.PASSWORD
    }
}
else {
    module.exports = require("./credentials.json");
}

