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

module.exports = {
  data: new SlashCommandBuilder().setName("ban").setDescription("ban a user"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();

    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "ban"`
      );
    playerid = interaction.user.id;
    playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};