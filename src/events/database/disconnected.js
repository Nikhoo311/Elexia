const logger = require("../../functions/utils/Logger");

module.exports = {
    name: "disconnected",
    async execute() {     
        logger.database(`Base de données déconnecté`)
    }
}