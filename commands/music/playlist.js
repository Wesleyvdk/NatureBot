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
    .setName("playlist")
    .setDescription(
      "play a playlist from spotify, youtube, or soundcloud, or your own playlist on the bot"
    ),
  async execute(client, interaction, mongoclient, conn) {
    await interaction.deferReply();

    let playerid = interaction.user.id;
    let playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};
