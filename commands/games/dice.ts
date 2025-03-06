import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Rolls a dice and bet on a number.")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Set the amount you want to bet")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("eyes")
        .setDescription("Choose a number between 1 and 6")
        .addChoices(
          { name: "1", value: "1" },
          { name: "2", value: "2" },
          { name: "3", value: "3" },
          { name: "4", value: "4" },
          { name: "5", value: "5" },
          { name: "6", value: "6" }
        )
        .setRequired(true)
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const betAmount = interaction.options.getInteger("bet");
    const chosenNumber = interaction.options.getString("eyes");
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

      // Simulate dice roll
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      const won = chosenNumber === diceRoll.toString();

      // Update user balance based on result
      const updatedUser = await db.handleDiceGame(
        playerId,
        guildId,
        betAmount,
        won
      );

      // Create result embed
      const resultEmbed = new EmbedBuilder()
        .setTitle(won ? "Congrats!! 🎉" : "Aww!! 😢")
        .setDescription(
          `You chose **${chosenNumber}** and the dice rolled **${diceRoll}**.\n` +
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
