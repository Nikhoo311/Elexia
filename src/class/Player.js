const player = require("../schemas/players");
const seed = require('../schemas/seeds');
const potion = require('../schemas/potions');
const ingredient = require('../schemas/ingredients');
const garden = require('../schemas/gardens');
const player_map = require('../schemas/players_maps');
const ExploreMap = require('./ExploreMap');

module.exports = class Player {
    static model = player;
    constructor(_id, discordId, inventory, garden, xp, coin, actionPoint) {
        this.id = _id;
        this.discordId = discordId;
        this.inventory = inventory;
        this.garden = garden;
        this.xp = xp;
        this.coins = coin;
        this.actionPoint = actionPoint;

        this.needToBeUpdated = false;
    }

    static async findAll() {
        const result = await Player.model.find().populate({
            path: 'inventory',
            populate: [
                { path: 'seeds.seed', model: seed },
                { path: 'potions.potion', model: potion },
                { path: 'ingredients.ingredient', model: ingredient }
            ]
        }).populate({
            path: 'garden',
            populate: [
                { path: "plantedSeeds", model: seed }
            ]
        });
        
        return result;
    }

    static async findOne(discordId) {
        const result = await Player.model.findOne({ discordId }).populate({
            path: 'inventory',
            populate: [
                { path: 'seeds.seed', model: seed },
                { path: 'potions.potion', model: potion },
                { path: 'ingredients.ingredient', model: ingredient }
            ]
        }).populate({
            path: 'garden',
            populate: [
                { path: "plantedSeeds", model: seed }
            ]
        })
        
        return result;
    }

    /**
     * Ajoute une map à un joueur
     * @param {string} playerId - ID MongoDB du joueur
     * @param {string} mapId - ID MongoDB de la map
     * @returns {object} - PlayerMap créé (populé)
     */
   static async addMapToPlayer(playerId, mapId, remainingResources) {
        // 1. await manquant sur findOne (sinon always truthy Promise)
        const alreadyUnlock = await player_map.findOne({ player: playerId, map: mapId });

        if (alreadyUnlock) {
            return await alreadyUnlock.populate([
            { path: 'player' },
            { path: 'map' }
            ]);
        }

        // 2. findOne avec un objet filter, pas juste un id direct
        const map = await ExploreMap.findOne({ _id: mapId });
        if (!map) throw new Error("Map not found");

        const playerMap = await player_map.create({
            player: playerId,
            map: mapId,
            remainingResources: remainingResources
        });

        return await playerMap.populate([
            { path: 'player' },
            { path: 'map' }
        ]);
    }

    makeDirty() {
        this.needToBeUpdated = true;
    }
    makeClear() {
        this.needToBeUpdated = false;
    }
}