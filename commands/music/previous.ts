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

import { useHistory, useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous track"),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();

    const history = useHistory(interaction.guild.id);

    if (history == null)
      return interaction.editReply({ ephemeral: true, content: "No history found" })

    if (history.isEmpty())
      return interaction.editReply("The queue has no history track.");

    history.previous();

    return interaction.editReply("Backed the history track.");
  },
};
