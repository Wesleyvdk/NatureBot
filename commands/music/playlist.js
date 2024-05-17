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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription(
      "play a playlist from spotify, youtube, or soundcloud, or your own playlist on the bot"
    ),
  async execute(client, interaction, mongoclient, conn) {
    await interaction.deferReply();

    playerid = interaction.user.id;
    playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};
