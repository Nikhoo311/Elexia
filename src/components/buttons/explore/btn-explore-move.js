const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, AttachmentBuilder, SectionBuilder, TextDisplayBuilder, ContainerBuilder, SeparatorBuilder, SeparatorSpacingSize, MediaGalleryBuilder } = require("discord.js");

const directionOffsets = {
    "btn-explore-move-1": [-1, 0],       // ↖️
    "btn-explore-move-2": [0, -1],       // ⬆️
    "btn-explore-move-3": [1, -1],       // ↗️
    "btn-explore-move-4": [-1, 1],       // ↙️
    "btn-explore-move-5": [0, 1],        // ⬇️
    "btn-explore-move-6": [1, 0],        // ↘️
};

module.exports = {
    data: {
        name: "btn-explore-move-1",
        multi: [
            "btn-explore-move-2",
            "btn-explore-move-3",
            "btn-explore-move-4",
            "btn-explore-move-5",
            "btn-explore-move-6"
        ]
    },
    async execute (interaction, client) {
        const {player_maps} = client;
        if (interaction.message.components[0].components.length >= 5) {
            interaction.message.components[0].components = interaction.message.components[0].components.slice(2)
        }
        const map = interaction.message.components[0].components[0].items[0].data.description;

        let [, x, y] = map.match(/^(-?\d+)x(-?\d+)/);
        const [, id] = map.match(/_(.+)\.png$/);
        x = Number(x);
        y = Number(y);

        let currentMap;
        if (player_maps.get(`${interaction.user.id}_${id}`)) {
            currentMap = player_maps.get(`${interaction.user.id}_${id}`);
        }

        const [dx, dy] = directionOffsets[interaction.customId];
        x += dx;
        y += dy;

        const canPickUp = currentMap.remainingResources.some(
            ressource => ressource.q === x && ressource.r === y
        );


        
        const borders = currentMap.map.borders;

        const buildButton = (id, emoji) => {
            const [dx, dy] = directionOffsets[id];
            const targetCoord = {q: x + dx , r: y + dy};
            const disabled = borders.some(b => b.q === targetCoord.q && b.r === targetCoord.r);
            
            return new ButtonBuilder()
                .setCustomId(id)
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(disabled);
        };

        const row1 = new ActionRowBuilder().addComponents(
            buildButton("btn-explore-move-1", "↖️"),
            buildButton("btn-explore-move-2", "⬆️"),
            buildButton("btn-explore-move-3", "↗️")
        );
        const row2 = new ActionRowBuilder().addComponents(
            buildButton("btn-explore-move-4", "↙️"),
            buildButton("btn-explore-move-5", "⬇️"),
            buildButton("btn-explore-move-6", "↘️")
        );

        const containerUpdate = new ContainerBuilder()
        const img = new AttachmentBuilder(await currentMap.generateMapView(x, y), { name: `${x}x${y}_${currentMap.map.id}.png` });
        const mediaGallery = new MediaGalleryBuilder()
            .addItems([
                {
                    description: `${x}x${y}_${currentMap.map.id}.png`,
                    media: {
                        url: `attachment://${x}x${y}_${currentMap.map.id}.png`,
                    }
                }
            ])
        
        if (canPickUp) {
            const pickUpButton = new ButtonBuilder()
                .setCustomId("btn-pick-up-ressource")
                .setEmoji("📤")
                .setLabel("Ramasser")
                .setStyle(ButtonStyle.Success)
                
            const section = new SectionBuilder()
                .setButtonAccessory(pickUpButton)
                .addTextDisplayComponents(new TextDisplayBuilder({content: "\u200b\u200b\u200b\u200b\u200b"}))


            containerUpdate.addSectionComponents(section)
            containerUpdate.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        }
        containerUpdate.addMediaGalleryComponents(mediaGallery)
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addActionRowComponents(row1, row2)
        
        await interaction.update({
            flags: [MessageFlags.IsComponentsV2],
            files: [img],
            components: [containerUpdate]
        });
    }
}