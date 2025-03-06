import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

const choices = ["rock", "paper", "scissors"];

export default {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play Rock Paper Scissors for money")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Choose rock, paper, or scissors")
        .addChoices(
          { name: "Rock", value: "rock" },
          { name: "Paper", value: "paper" },
          { name: "Scissors", value: "scissors" }
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

    const playerChoice = interaction.options.getString("choice");
    const betAmount = interaction.options.getInteger("bet");
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

      // Bot randomly selects a choice
      const botChoice = choices[Math.floor(Math.random() * choices.length)];

      let result: "win" | "lose" | "tie";

      if (playerChoice === botChoice) {
        result = "tie";
      } else if (
        (playerChoice === "rock" && botChoice === "scissors") ||
        (playerChoice === "paper" && botChoice === "rock") ||
        (playerChoice === "scissors" && botChoice === "paper")
      ) {
        result = "win";
      } else {
        result = "lose";
      }

      // Update user balance based on result
      const updatedUser = await db.handleRPSGame(
        playerId,
        guildId,
        betAmount,
        result
      );

      // Create result embed
      const resultEmbed = new EmbedBuilder()
        .setTitle(
          result === "win"
            ? "You won! 🎉"
            : result === "lose"
            ? "You lost! 😢"
            : "It's a tie! 🤝"
        )
        .setDescription(
          `You chose **${playerChoice}** and the bot chose **${botChoice}**.\n` +
            `${
              result === "win"
                ? "You doubled your bet!"
                : result === "lose"
                ? "You lost your bet!"
                : "No changes in balance."
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
