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
import usageHandler from "../../handlers/usageHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("bored")
    .setDescription("Find an activity to do"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();

    const response = await fetch("http://www.boredapi.com/api/activity/");
    const data = await response.json();
    interaction.editReply(data.activity);
  },
};
