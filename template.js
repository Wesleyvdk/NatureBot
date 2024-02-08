const {
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
} = require("discord.js");
const errorHandler = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("active")
    .setDescription("list all the active matches"),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();

    try {
      conn
        .promise()
        .query(
          `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "template"`
        );

      playerid = interaction.user.id;
      playername = interaction.user.username;

      interaction.editReply("work in progress");
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
