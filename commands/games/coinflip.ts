import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin and bet on heads or tails.")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Choose heads or tails")
        .addChoices(
          { name: "heads", value: "heads" },
          { name: "tails", value: "tails" }
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Set the amount you want to bet")
        .setRequired(true)
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const betAmount = interaction.options.getInteger("bet");
    const userChoice = interaction.options.getString("option");
    const playerId = interaction.user.id;
    const guildId = interaction.guild.id;

    try {
      // Fetch user balance
      const userBalance = await db.getUserBalance(playerId, guildId);
      if (!userBalance)
        await db.createUserBalance(
          playerId,
          guildId,
          interaction.user.username
        );

      // Check if the user has enough funds
      if (userBalance!.cash < betAmount) {
        return interaction.editReply({
          content: `You don't have enough cash. Your current balance is: ${
            userBalance!.cash
          }`,
          ephemeral: true,
        });
      }

      // Simulate coinflip
      const coinFlip = Math.random() < 0.5 ? "heads" : "tails";
      const won = userChoice === coinFlip;

      // Update user balance based on result
      const updatedUser = await db.handleCoinflip(
        playerId,
        guildId,
        won ? betAmount * 2 : betAmount,
        won
      );

      // Create result embed
      const resultEmbed = new EmbedBuilder()
        .setTitle(won ? "Congrats!! 🎉" : "Aww!! 😢")
        .setDescription(
          `You chose **${userChoice}** and the coin landed on **${coinFlip}**.\n` +
            `${
              won
                ? "You won! You doubled your bet!"
                : "You lost! Better luck next time."
            }\n` +
            `**New balance:** ${updatedUser.cash}`
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [resultEmbed] });
    } catch (error: any) {
      await interaction.editReply({ content: error.message, ephemeral: true });
    }
  },
};
