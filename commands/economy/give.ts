import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Gives a specific amount to another user")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Specifies the amount to give")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to give to")
        .setRequired(true)
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const senderId = interaction.user.id;
    const receiverId = target.id;
    const guildId = interaction.guild.id;

    if (senderId === receiverId) {
      return interaction.editReply({
        content: "You cannot give money to yourself!",
        ephemeral: true,
      });
    }

    try {
      // Ensure both users have accounts
      const sender = await db.getUserBalance(senderId, guildId);
      const receiver = await db.getUserBalance(receiverId, guildId);

      if (!sender)
        await db.createUserBalance(
          senderId,
          guildId,
          interaction.user.username
        );
      if (!receiver)
        await db.createUserBalance(receiverId, guildId, target.username);

      // Transfer funds
      const { sender: updatedSender, receiver: updatedReceiver } =
        await db.transferFunds(senderId, receiverId, guildId, amount);

      // Create confirmation embed
      const giveEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user} gave ${amount} cash to ${target}`)
        .setTimestamp();

      await interaction.editReply({ embeds: [giveEmbed] });
    } catch (error: any) {
      await interaction.editReply({ content: error.message, ephemeral: true });
    }
  },
};
