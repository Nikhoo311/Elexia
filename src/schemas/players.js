const { Schema, model } = require('mongoose');
const inventory = require('./inventories');
const garden = require('./gardens');

const playerSchema = new Schema({
    discordId: { type: String, required: true },
    inventory: { type: Schema.Types.ObjectId, ref: "inventory" },
    garden: { type: Schema.Types.ObjectId, ref: "garden" },
    xp: { type: Schema.Types.Number },
    coins: { type: Schema.Types.Number },
    actionPoint: { type: Schema.Types.Number } 
})

module.exports = model('player', playerSchema, 'players');