require('dotenv').config();
const { token, DB_URL } = process.env;
const { Client, Collection } = require('discord.js');
const { connect } = require("mongoose");
const { readdirSync } = require("fs");

const client = new Client({ intents: 3276799 });

client.commands = new Collection();
client.commandArray = []
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

client.environnements = new Collection();
client.player_maps = new Collection();
client.players = new Collection();

let functionFolder = readdirSync(`./src/functions`);
functionFolder = functionFolder.filter(f => f !== "utils");
for (const folder of functionFolder) {  
    const functionFiles = readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js'));

    for (const file of functionFiles)
        require(`./functions/${folder}/${file}`)(client);
}
client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);

(async () => {
    await connect(DB_URL, { maxPoolSize: 5 }).catch(console.error)
})()