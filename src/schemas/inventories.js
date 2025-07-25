const { Schema, model } = require('mongoose');

const inventorySchema = new Schema({
    seeds: [{
        seed: { type: Schema.Types.ObjectId, ref: "seed" },
        quantity: { type: Number, default: 1 },
    }],
    potions: [{
        potion: { type: Schema.Types.ObjectId, ref: "potion" },
        quantity: { type: Number, default: 1 },
    }],
    ingredients: [{
        ingredient: { type: Schema.Types.ObjectId, ref: "ingredient" },
        quantity: { type: Number, default: 1 },
    }]
})

module.exports = model('inventory', inventorySchema, "inventories");