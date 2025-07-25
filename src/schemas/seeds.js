const { Schema, model } = require('mongoose');

const seedSchema = new Schema({
    name: { type: String, required: true },
    spawnRate: { type: Schema.Types.Double },
    type: { type: String },
    emoji: { type: String }
})

module.exports = model('seed', seedSchema, 'seeds');