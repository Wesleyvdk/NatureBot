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
import queue from "./queue";
import { useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the playback"),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();

    const queue = useQueue();

    if (queue == null)
      return interaction.editReply({ ephemeral: true, content: "No queue found" })

    if (queue.node.isPaused())
      return interaction.editReply("The playback is already paused.");

    queue.node.pause();

    return interaction.editReply("Paused the playback.");
  },
};
