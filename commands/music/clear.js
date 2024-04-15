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
    .setName("clear")
    .setDescription("Clear the tracks in the queue."),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();

    if (queue.size < 2)
      return interaction.editReply("The queue has no more track.");

    queue.tracks.clear();

    return interaction.editReply("Cleared the queue tracks.");
  },
};
