import {
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
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the playback."),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    if (queue.node.isPlaying())
      return interaction.editReply("The playback is already playing.");

    queue.node.resume();

    return interaction.editReply("Resumed the playback.");
  },
};
