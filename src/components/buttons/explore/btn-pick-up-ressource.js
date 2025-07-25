const { EmbedBuilder, MessageFlags, ContainerBuilder, ContainerComponent, MediaGalleryBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { color } = require('../../../../config/config.json');

module.exports = {
    data: {
        name: "btn-pick-up-ressource"
    },
    async execute (interaction, client) {
        const {player_maps, players} = client;

        const map = interaction.message.components[0].components[2].items[0].data.description;
        let [, x, y] = map.match(/^(-?\d+)x(-?\d+)/);
        const [, id] = map.match(/_(.+)\.png$/);
        x = Number(x);
        y = Number(y);

        let currentMap;
        if (player_maps.get(`${interaction.user.id}_${id}`)) {
            currentMap = player_maps.get(`${interaction.user.id}_${id}`);
        }

        const ressource = currentMap.getRessourceByCoordinate(x, y);
        currentMap.remainingResources = currentMap.remainingResources.filter(resource => {
            return !(resource.q === ressource.q && resource.r === ressource.r);
        });

        const player = players.get(interaction.user.id);
        player.actionPoint--;
        player.makeDirty();

        // Recherche de la ressource existante dans l'inventaire
        const existing = player.inventory[`${ressource.type}s`].find(item =>
            item[ressource.type]?.toString() === ressource.ressource._id.toString()
        );

        if (existing) {
            existing.quantity += ressource.ressource.quantity ?? 1;
        } else {
            player.inventory[`${ressource.type}s`].push({
                [ressource.type]: ressource.ressource._id,
                quantity: ressource.ressource.quantity ?? 1
            });
        }

        const embed = new EmbedBuilder()
            .setColor(color.green)
            .setAuthor({ name: "Nouvelle ressource" })
            .setDescription('Vous avez récolté une ressource.')
            .addFields(
                {value: `**x1** ${ressource.ressource.emoji} ${ressource.ressource.name}`, name: '\u200b'}
            )
            

        interaction.message.components[0].components = interaction.message.components[0].components.slice(2)
        const mediaGallery = new MediaGalleryBuilder()
            .addItems([
                {
                    description: `${x}x${y}_${currentMap.map.id}.png`,
                    media: {
                        url: `attachment://${x}x${y}_${currentMap.map.id}.png`
                    }
                }
            ])
        const actionRow1 = new ActionRowBuilder();
        const actionRow2 = new ActionRowBuilder();
        
        const createButton = (element) =>
            new ButtonBuilder()
                .setCustomId(element.data.custom_id)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(element.data.emoji?.name)
                .setDisabled(element.data.disabled ?? false);
        
        // Ajout des boutons aux action rows
        [actionRow1, actionRow2].forEach((row, index) => {
            const buttonGroup = interaction.message.components[0].components[index + 2]?.components || [];
            row.addComponents(buttonGroup.map(createButton));
        });

        const containerUpdate = new ContainerBuilder()
            .addMediaGalleryComponents(mediaGallery)
            .addSeparatorComponents(interaction.message.components[0].components[1])
            .addActionRowComponents(actionRow1, actionRow2);
        
        interaction.message.edit({
            flags: [MessageFlags.IsComponentsV2],
            components: [containerUpdate],
        })
        interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] })

        currentMap.makeDirty()
        console.log(currentMap);
        console.log(player);
    }
}