const logger = require("../../functions/utils/Logger");

module.exports = {
    name: "connecting",
    async execute(client) {     
        logger.database(`Connexion en cours...`)
    }
}