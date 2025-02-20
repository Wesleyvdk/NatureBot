import { useQueue } from "discord-player";
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
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();

    if (queue == null)
      return interaction.editReply({ ephemeral: true, content: "No track found" })

    if (queue.size < 3)
      return interaction.editReply(
        "Need at least 3 tracks in the queue to shuffle."
      );

    queue.tracks.shuffle();

    return interaction.editReply("Shuffled the queue.");
  },
};
