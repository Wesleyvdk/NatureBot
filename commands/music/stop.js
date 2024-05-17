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
    .setName("stop")
    .setDescription("list all the active matches"),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    queue.delete();

    return interaction.editReply("Stopped the playback.");
  },
};
