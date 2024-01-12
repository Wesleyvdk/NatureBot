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
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    playerid = interaction.user.id;
    playername = interaction.user.username;

    interaction.editReply("work in progress");
  },
};
