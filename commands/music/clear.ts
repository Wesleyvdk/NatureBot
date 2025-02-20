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
    .setName("clear")
    .setDescription("Clear the tracks in the queue."),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();
    if (queue == null)
      return interaction.editReply("No queue available");
    if (queue.size < 2)
      return interaction.editReply("The queue has no more track.");

    queue.tracks.clear();

    return interaction.editReply("Cleared the queue tracks.");
  },
};
