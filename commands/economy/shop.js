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
    .setName("shop")
    .setDescription("shows the shop"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "shop"`
      );

    const shopembed = new EmbedBuilder()
      .setDescription("The shop is empty right now")
      .setFooter({ text: "leave some shop suggestions behind" });
    interaction.editReply({ embeds: [shopembed] });
  },
};
