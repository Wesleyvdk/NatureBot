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
    .setName("rob")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    let playerid = interaction.user.id;
    let playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};
