import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("shows the current balance of the user")
    .addUserOption((option: any) =>
      option.setName("user").setDescription("select a user")
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const mentioned = interaction.options.getUser("user");
    let userId = interaction.user.id;
    let guildId = interaction.guild.id;

    let targetUser = mentioned || interaction.user;
    let targetUserId = targetUser.id;

    // Fetch user balance from PostgreSQL
    let userBalance = await db.getUserBalance(targetUserId, guildId);

    // If user does not exist, create a new balance entry
    if (!userBalance) {
      userBalance = await db.createUserBalance(
        targetUserId,
        guildId,
        targetUser.username
      );
    }

    // Create balance embed
    const balEmbed = new EmbedBuilder().setDescription(
      `${targetUser}'s current balance:\n` +
        `Bank: ${userBalance.bank}\n` +
        `Cash: ${userBalance.cash}\n` +
        `Bitcoin: ${userBalance.bitcoin}`
    );

    await interaction.editReply({ embeds: [balEmbed] });
  },
};
