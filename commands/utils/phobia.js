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
} = require("discord.js");

const phobias = require("phobias.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("phobia")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();

    const randomWord = word[Math.floor(Math.random() * word.length)];
  },
};
