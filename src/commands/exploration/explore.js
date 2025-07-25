const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const Forest = require("../../class/Forest");

module.exports = {
    name: "explore",
    categorie: "Exploration",
    data: new SlashCommandBuilder()
        .setName("explore")
        .setDescription('Permet d\'explorer les environs'),

    async execute(interaction, client) {
        const message = "Veuillez sélectionner l'environement dans lequel vous voulez explorer.";
        const {environnements} = client;
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("select-environnement-explore")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Choisir un environnement")
        
        environnements.forEach(environnement => {
            selectMenu.addOptions(new StringSelectMenuOptionBuilder({
                label: environnement.type,
                value: environnement.id
            }))
        })

        interaction.reply({ content: message, components: [new ActionRowBuilder().addComponents(selectMenu)] })
    }
}