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
    .setName("shuffle")
    .setDescription("list all the active matches"),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    if (queue.size < 3)
      return interaction.editReply(
        "Need at least 3 tracks in the queue to shuffle."
      );

    queue.tracks.shuffle();

    return interaction.editReply("Shuffled the queue.");
  },
};
