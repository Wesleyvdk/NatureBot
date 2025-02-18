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
import classes from "./classes.json" assert { type: "json" };

import handleError from "../../handlers/errorHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("start your adventure"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    interaction.reply("work in progress");
    return;
  },
};
