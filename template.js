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

/*
        "@discordjs/builders": "^0.15.0",
        "@discordjs/rest": "^0.5.0",
        "@napi-rs/canvas": "^0.1.41",
        "better-sqlite3": "^7.5.3",
        "digitalocean": "^1.2.1",
        "discord-api-types": "^0.36.0",
        "discord.js": "^14.8.0",
        "fetch": "^1.1.0",
        "moment": "^2.29.4",
        "node-fetch": "^2.6.9",
        "dotenv": "^16.1.4",
        "mysql2": "^3.3.3"
*/