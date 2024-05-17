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
    .setName("pause")
    .setDescription("Pauses the playback"),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    if (queue.node.isPaused())
      return interaction.editReply("The playback is already paused.");

    queue.node.pause();

    return interaction.editReply("Paused the playback.");
  },
};
