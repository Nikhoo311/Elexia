const { readdirSync } = require("fs");
const logger = require("../utils/Logger");
const path = require("path");
const { connection } = require("mongoose");

module.exports = (client) => {
    client.handleEvents = async() => {
        const eventsPath = path.join(__dirname, "..", "..", "events");
        const eventFolders = readdirSync(eventsPath);

        for (const folder of eventFolders) {
            const eventSubFolder = path.join(eventsPath, folder);
            const eventFiles = readdirSync(eventSubFolder).filter(file => file.endsWith('.js'));

            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const filePath = path.join(eventSubFolder, file);
                        const event = require(filePath);
                        logger.event(`${event.name} est chargé avec succès !`);
                        if (event.once)
                            client.once(event.name, (...args) => event.execute(...args, client));
                        else
                            client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    break;
                case "database":
                    for (const file of eventFiles) {
                        const filePath = path.join(eventSubFolder, file);
                        const event = require(filePath);
                        if (event.once)
                            connection.once(event.name, (...args) => event.execute(...args, client));
                        else
                            connection.on(event.name, (...args) => event.execute(...args, client));
                    }
                    break;
                default:
                    break;
            }
        }
        // for (const file of eventFiles) {
        //     const filePath = path.join(eventsPath, file);
        //     const event = require(filePath);
        //     logger.event(`${event.name} est charger avec succès !`)
        //     if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
        //     else client.on(event.name, (...args) => event.execute(...args, client));
        // }
    }
}
