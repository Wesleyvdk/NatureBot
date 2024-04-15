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
const usageHandler = require("../../handlers/usageHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("shows the shop"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    usageHandler("shop", mongoclient, conn);
    const shopembed = new EmbedBuilder()
      .setDescription("The shop is empty right now")
      .setFooter({ text: "leave some shop suggestions behind" });
    interaction.editReply({ embeds: [shopembed] });
  },
};
