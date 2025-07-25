const { MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, MediaGalleryBuilder, ContainerBuilder } = require("discord.js");
const Forest = require("../../../class/Forest");
const Player = require("../../../class/Player");
const PlayerMap = require("../../../class/Player_Maps");

module.exports = {
    data: {
        name: "select-environnement-explore"
    },
    async execute(interaction, client) {
        const info = interaction.values[0];

        const player = client.players.get(interaction.user.id);
        
        const one = new ButtonBuilder()
            .setCustomId('btn-explore-move-1')
            .setEmoji('↖️')
            .setStyle(ButtonStyle.Primary)

        const two = new ButtonBuilder()
            .setCustomId('btn-explore-move-2')
            .setEmoji('⬆️')
            .setStyle(ButtonStyle.Primary)
        
        const three = new ButtonBuilder()
            .setCustomId('btn-explore-move-3')
            .setEmoji('↗️')
            .setStyle(ButtonStyle.Primary)
        
        const four = new ButtonBuilder()
            .setCustomId('btn-explore-move-4')
            .setEmoji('↙️')
            .setStyle(ButtonStyle.Primary)
        
        const five = new ButtonBuilder()
            .setCustomId('btn-explore-move-5')
            .setEmoji('⬇️')
            .setStyle(ButtonStyle.Primary)

        const six = new ButtonBuilder()
            .setCustomId('btn-explore-move-6')
            .setEmoji('↘️')
            .setStyle(ButtonStyle.Primary)
        const [x, y] = [0,0];
        const { environnements, player_maps } = client;

        const env = environnements.get(info)
        let selectedMap;
        let playerMapObject;
        if (env instanceof Forest) {
            if (player_maps.has(`${interaction.user.id}_${env.id}`)) {
                playerMapObject = player_maps.get(`${interaction.user.id}_${env.id}`);
                // console.log(playerMapObject);
                
            }
            else {
                selectedMap = await new Forest(env.id, env.type).initRessources();
                
                const formattedResources = selectedMap.ressources.map(({ q, r, ressource }) => ({
                    q,
                    r,
                    ressource: ressource,
                    type: ressource.type        // string: "ingredient" ou "seed"
                }));
                playerMapObject = new PlayerMap(player.id, selectedMap, formattedResources);
                
                await Player.addMapToPlayer(player.id, selectedMap.id, formattedResources);
                player_maps.set(`${interaction.user.id}_${selectedMap.id}`, playerMapObject);
                
            }
        }
        
        const img = new AttachmentBuilder(await playerMapObject.generateMapView(x, y), { name: `${x}x${y}_${playerMapObject.map.id}.png` });
        const mediaGallery = new MediaGalleryBuilder()
            .addItems([
                {
                    description: `${x}x${y}_${playerMapObject.map.id}.png`,
                    media: {
                        url: `attachment://${x}x${y}_${playerMapObject.map.id}.png`,
                    }
                }
            ])
        
        const container = new ContainerBuilder()
            .addMediaGalleryComponents(mediaGallery)
            .addActionRowComponents(new ActionRowBuilder().addComponents(one, two, three), new ActionRowBuilder().addComponents(four, five, six))

        interaction.update({
            content: "",
            flags: [MessageFlags.IsComponentsV2],
            components: [container],
            files: [img]
        })
    }
}