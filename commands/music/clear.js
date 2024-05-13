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
    .setName("clear")
    .setDescription("Clear the tracks in the queue."),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    if (queue.size < 2)
      return interaction.editReply("The queue has no more track.");

    queue.tracks.clear();

    return interaction.editReply("Cleared the queue tracks.");
  },
};
