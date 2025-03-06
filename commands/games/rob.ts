import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Attempt to rob another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select a user to rob")
        .setRequired(true)
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const playerId = interaction.user.id;
    const guildId = interaction.guild.id;
    const targetUser = interaction.options.getUser("target");
    const targetId = targetUser.id;

    if (playerId === targetId) {
      return interaction.editReply({
        content: "You can't rob yourself!",
        ephemeral: true,
      });
    }

    // Check if the command is enabled in this guild
    const isEnabled = await db.getSettingByCommand(guildId, "rob");
    if (!isEnabled) {
      return interaction.editReply({
        content: "The **rob** command is disabled in this server.",
        ephemeral: true,
      });
    }

    // Fetch user balances
    const playerBalance = await db.getUserBalance(playerId, guildId);
    const targetBalance = await db.getUserBalance(targetId, guildId);

    if (!playerBalance)
      await db.createUserBalance(playerId, guildId, interaction.user.username);
    if (!targetBalance)
      await db.createUserBalance(targetId, guildId, targetUser.username);

    // Check if target has enough money to rob
    if (targetBalance!.cash < 100) {
      return interaction.editReply({
        content: `${targetUser.username} doesn't have enough money to rob!`,
        ephemeral: true,
      });
    }

    // Robbery success probability (50% chance)
    const success = Math.random() < 0.5;
    const stealAmount =
      Math.floor(Math.random() * (targetBalance!.cash * 0.3)) + 1; // 1-30% of target's cash

    if (success) {
      // Update balances
      await db.handleRobbery(playerId, targetId, guildId, stealAmount, true);

      const successEmbed = new EmbedBuilder()
        .setTitle("💰 Robbery Successful!")
        .setDescription(
          `You stole **$${stealAmount}** from ${targetUser.username}!`
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [successEmbed] });
    } else {
      // Player gets caught and loses money (10-20% of their cash)
      const lossAmount = Math.floor(playerBalance!.cash * 0.15);
      await db.handleRobbery(playerId, targetId, guildId, lossAmount, false);

      const failEmbed = new EmbedBuilder()
        .setTitle("🚔 You Got Caught!")
        .setDescription(
          `Your robbery failed, and you lost **$${lossAmount}** as a penalty!`
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [failEmbed] });
    }
  },
};
