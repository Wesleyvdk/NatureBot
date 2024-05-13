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
    .setName("shop")
    .setDescription("shows the shop"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();

    const shopembed = new EmbedBuilder()
      .setDescription("The shop is empty right now")
      .setFooter({ text: "leave some shop suggestions behind" });
    interaction.editReply({ embeds: [shopembed] });
  },
};
