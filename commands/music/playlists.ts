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
import { useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("playlists")
    .setDescription("show your created playlists on the bot"),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();

    let playerid = interaction.user.id;
    let playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};
