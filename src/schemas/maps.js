const { Schema, model } = require('mongoose');

const mapSchema = new Schema({
    type: { type: String },
    ressources: {
        seeds: [ { type: Schema.Types.ObjectId, ref: "seed" } ],
        ingredients: [ { type: Schema.Types.ObjectId, ref: "ingredient" } ]
    }
})

module.exports = model('map', mapSchema, "maps");