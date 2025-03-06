import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposits balance to the bank")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Specifies the amount to deposit")
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const amount = interaction.options.getInteger("amount");
    let userId = interaction.user.id;
    let guildId = interaction.guild.id;

    try {
      // Perform deposit operation
      const updatedUser = await db.depositToBank(userId, guildId, amount);

      // Create balance embed
      const balEmbed = new EmbedBuilder().setDescription(
        `Your new balance:\n` +
          `Bank: ${updatedUser.bank}\n` +
          `Cash: ${updatedUser.cash}\n` +
          `Bitcoin: ${updatedUser.bitcoin}`
      );

      await interaction.editReply({ embeds: [balEmbed] });
    } catch (error: any) {
      await interaction.editReply(error.message);
    }
  },
};
