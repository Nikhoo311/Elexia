const logger = require("../../functions/utils/Logger");

module.exports = {
    name: "connected",
    async execute(client) {     
        logger.database(`La base de données est connecté avec succès !`)
    }
}