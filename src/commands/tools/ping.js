const { MessageFlags, SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    categorie: "Utilitaires",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription('Permet d\'afficher le ping du bot !'),

    async execute(interaction, client) {
        await interaction.reply({ content: '🕒 Calcul du ping...', flags: [MessageFlags.Ephemeral] });

        const sent = await interaction.fetchReply();

        const apiPing = sent.createdTimestamp - interaction.createdTimestamp;
        const wsPing = interaction.client.ws.ping;
        const wsPingDisplay = wsPing === -1 ? 'Non disponible' : `${wsPing}ms`;

        const getSignalEmoji = (ping) => {
            if (ping <= 150) return '<:signalbar_green:1393021771040555028>';
            if (ping <= 250) return '<:signalbar_yellow:1393021572578676748>';
            if (ping <= 400) return '<:signalbar_orange:1393021714396614676>';
            return '<:signalbar_red:1393021658201063434>';
        };

        await interaction.editReply({
            content: `> ${getSignalEmoji(apiPing)} **API Ping** : \`${apiPing}ms\`\n> ${wsPing === -1 ? "❌" : getSignalEmoji(wsPing)} **WebSocket Ping** : \`${wsPingDisplay}\``
        });
    }
}