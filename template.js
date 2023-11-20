const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Embed,
    ButtonInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
    AttachmentBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("active")
        .setDescription("list all the active matches"),
    async execute(client, interaction) {
        playerid = interaction.user.id;
        playername = interaction.user.username;

        interaction.reply("work in progress");
    },
};
