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

import handleError from "../../handlers/errorHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("start your adventure"),
  async execute(client: any, interaction: any, conn: any) {
    await interaction.deferReply();
    interaction.reply("work in progress");
    return;
  },
};
