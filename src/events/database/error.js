const logger = require("../../functions/utils/Logger");

module.exports = {
    name: "error",
    async execute(err) {     
        logger.error(err);
        console.log(err);   
    }
}