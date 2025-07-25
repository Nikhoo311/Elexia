const { Schema, model } = require('mongoose');

const gardenSchema = new Schema({
    plantedSeeds: [{type: Schema.Types.ObjectId, ref: "seed" }],
    timeToPeakUp: { type: Date }
})

module.exports = model('garden', gardenSchema, "gardens");