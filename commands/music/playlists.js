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
    .setName("playlists")
    .setDescription("show your created playlists on the bot"),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    let playerid = interaction.user.id;
    let playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};
