const { Schema, model } = require("mongoose");

const potionSchema = new Schema({
    name: { type: String, required: true },
});

module.exports = model('potion', potionSchema, 'potions');