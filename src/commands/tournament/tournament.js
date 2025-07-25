const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, SectionBuilder, TextDisplayBuilder, MessageFlags, ActionRowBuilder, AttachmentBuilder, FileBuilder, MediaGalleryBuilder, ContainerBuilder, SeparatorBuilder, SeparatorSpacingSize } = require("discord.js");
const { color } = require('../../../config/config.json');

module.exports = {
    name: "tournament",
    categorie: "LAN",
    data: new SlashCommandBuilder()
        .setName("tournament")
        .setDescription('Permet gérer les tounois'),

    async execute(interaction, client) {
        const {player_maps} = client;
        const map = "-2x0_68698d38a65758f9de4c856f.png"
        let [, x, y] = map.match(/^(-?\d+)x(-?\d+)/);
        const [, id] = map.match(/_(.+)\.png$/);
        x = Number(x);
        y = Number(y);
        x = y = 0
        let currentMap;
        if (player_maps.get(`${interaction.user.id}_${id}`)) {
            currentMap = player_maps.get(`${interaction.user.id}_${id}`);
        }

        const pickUpButton = new ButtonBuilder()
            .setCustomId("btn-pick-up-ressource")
            .setEmoji("📤")
            .setLabel("Ramasser")
            .setStyle(ButtonStyle.Success)

        const buildButton = (id, emoji) => {
            
            return new ButtonBuilder()
                .setCustomId(id)
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);
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

        const section = new SectionBuilder()
            .setButtonAccessory(pickUpButton)
            .addTextDisplayComponents(new TextDisplayBuilder({content: "\u200b\u200b\u200b\u200b\u200b"}))

        // const components = [section, row1, row2]

        const img = new AttachmentBuilder(await currentMap.generateMapView(x, y), { name: `${x}x${y}_${currentMap.map.id}.png` });

        const mediaGallery = new MediaGalleryBuilder()
            .addItems([
                {
                    media: {
                        url: `attachment://${x}x${y}_${currentMap.map.id}.png`
                    }
                }
            ])
        
        const separator = new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Small)
        const container = new ContainerBuilder()
            .addSectionComponents(section)
            .addSeparatorComponents(separator)
            .addMediaGalleryComponents(mediaGallery)
            .addActionRowComponents(row1, row2)
        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            files: [img],
            components: [container]
        });
    }
}