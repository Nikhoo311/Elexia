const { Schema, model } = require('mongoose');

const ingredientSchema = new Schema({
    name: { type: String, required: true },
    spawnRate: { type: Schema.Types.Double },
    type: { type: String }
});

module.exports = model('ingredient', ingredientSchema, 'ingredients');