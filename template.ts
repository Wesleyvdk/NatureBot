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
import errorHandler from "./handlers/errorHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("active")
    .setDescription("list all the active matches"),
  async execute(client: any, interaction: any, conn: any, mongoclient: any, queue: any) {
    await interaction.deferReply();

    try {
      let playerid = interaction.user.id;
      let playername = interaction.user.username;

      interaction.editReply("work in progress");
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
