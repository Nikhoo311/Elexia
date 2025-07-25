const { Collection } = require("discord.js");
const ExploreMap = require("../../class/ExploreMap");
const Forest = require("../../class/Forest");
const Player = require("../../class/Player");
const PlayerMap = require("../../class/Player_Maps");
const logger = require("../../functions/utils/Logger");
const inventories = require("../../schemas/inventories");
const gardens = require("../../schemas/gardens");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // + sur chaque déplace + pickup de ressources => -1 pt d'action
        const allMaps = await ExploreMap.findAll();
        const allPlayers = await Player.findAll();
        const allPlayerMaps = await PlayerMap.model.find().populate('player').populate('map').populate('remainingResources.ressource');

        allPlayerMaps.forEach(player_map => {
            // Format remainingResources comme dans ton système de création
            const formattedResources = player_map.remainingResources.map(({ q, r, ressource, type }) => ({
                q,
                r,
                ressource: ressource,
                type
            }));
            let playerMapObject;
            allMaps.forEach(map => {
                let object;
                switch (map.type) {
                    case 'foret':
                        object = new Forest(map.id, map.type);
                        // Crée une instance PlayerMap avec ressources formatées
                        playerMapObject = new PlayerMap(player_map.player.id, new Forest(map.id, map.type, map.ressources), formattedResources)
                        break;
                    default:
                        break;
                }
                if(object || !client.environnements.has(object.id)) client.environnements.set(object.id, object);
            });

            client.player_maps.set(`${player_map.player.discordId}_${player_map.map.id}`, playerMapObject);
        });

        allPlayers.forEach(player => {
            client.players.set(player.discordId, new Player(player._id, player.discordId, player.inventory, player.garden, player.xp, player.coins, player.actionPoint));            
        });
        console.log(client.player_maps);
        logger.clientStart(`${client.user.tag} est en ligne !`);

        setInterval(async () => {
            const playersFilteredNeedToBeUpdated = new Collection([...client.players].filter(([_, player]) => player.needToBeUpdated))
            const player_mapFilteredNeedToBeUpdated = new Collection([...client.player_maps].filter(([_, player]) => player.needToBeUpdated))
            
            for (const [discordId, player] of playersFilteredNeedToBeUpdated) {
                try {
                // Mise à jour dans MongoDB
                await Player.model.updateOne(
                    { discordId: player.discordId },
                    {
                    $set: {
                        xp: player.xp,
                        coins: player.coins,
                        actionPoint: player.actionPoint,
                    }
                    }
                );

                await inventories.updateOne(
                    { _id: player.inventory._id },
                    {
                    $set: {
                        seeds: player.inventory.seeds,
                        potions: player.inventory.potions,
                        ingredients: player.inventory.ingredients
                    }
                    }
                );

                await gardens.updateOne(
                    { _id: player.garden._id },
                    {
                    $set: {
                        plantedSeeds: player.garden.plantedSeeds,
                        timeToPeakUp: player.garden.timeToPeakUp
                    }
                    }
                )

                // Mise à jour en mémoire
                player.makeClear()
                console.log(player.id + "est update");
                

                } catch (err) {
                    console.error(`Erreur lors de la mise à jour du joueur ${discordId} :`, err);
                }
            }
        }, 1000);

    }
}