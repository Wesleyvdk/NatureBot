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
    .setName("skip")
    .setDescription("list all the active matches"),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();

    if (queue == null)
      return interaction.editReply({ ephemeral: true, content: "No track found" })

    if (queue.size < 1 && queue.repeatMode !== 3)
      return interaction.editReply("The queue has no more tracks.");

    queue.node.skip();

    return interaction.editReply("Skipped the current track.");
  },
};
