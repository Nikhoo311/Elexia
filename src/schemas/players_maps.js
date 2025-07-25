const { Schema, model } = require('mongoose');

const player_mapsSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: "player" },
  map: { type: Schema.Types.ObjectId, ref: "map" },
  remainingResources: [{
    ressource: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'remainingResources.type'
    },
    type: {
      type: String,
      required: true,
      enum: ['ingredient', 'seed']
    },
    q: { type: Number, required: true },
    r: { type: Number, required: true }
  }]
});


module.exports = model('player_map', player_mapsSchema, "player_maps");