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
    .setName("stop")
    .setDescription("list all the active matches"),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();

    if (queue == null)
      return interaction.editReply({ ephemeral: true, content: "No track found" })

    queue.delete();

    return interaction.editReply("Stopped the playback.");
  },
};
