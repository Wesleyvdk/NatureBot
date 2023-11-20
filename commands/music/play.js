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
        .setName("play")
        .setDescription("play music from spotify, youtube, or soundcloud"),
    async execute(client, interaction, conn) {
        playerid = interaction.user.id;
        playername = interaction.user.username;

        interaction.reply("work in progress");
    },
};
