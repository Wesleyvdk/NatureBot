import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your current level"),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    try {
      // Fetch user level data
      const userLevel = await db.getUserLevel(userId, guildId);

      if (!userLevel) {
        return interaction.editReply(
          `${interaction.user}, you haven't gained any experience yet! Start chatting to level up.`
        );
      }

      // Create response message
      const levelEmbed = new EmbedBuilder()
        .setTitle("📊 Your Level")
        .setDescription(
          `${interaction.user}, your current level is **${userLevel.level}** and you have **${userLevel.exp}** EXP.`
        )
        .setColor(0x00ae86);

      return interaction.editReply({ embeds: [levelEmbed] });
    } catch (error) {
      await interaction.editReply({
        content: "An error occurred while fetching your level.",
        ephemeral: true,
      });
      console.error("Level Command Error:", error);
    }
  },
};
