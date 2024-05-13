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

import { useHistory } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous track"),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    const history = useHistory(interaction.guild.id);

    if (history.isEmpty())
      return interaction.editReply("The queue has no history track.");

    history.previous();

    return interaction.editReply("Backed the history track.");
  },
};
