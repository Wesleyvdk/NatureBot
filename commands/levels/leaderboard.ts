import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the top 10 leaderboard"),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    const guildId = interaction.guild.id;

    try {
      // Fetch leaderboard data
      const leaderboard = await db.getLeaderboard(guildId);

      if (leaderboard.length === 0) {
        return interaction.editReply("No leaderboard data available yet.");
      }

      // Create leaderboard embed
      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard")
        .setDescription("Top 10 level leaders in the server!")
        .setColor(0x00ae86);

      for (const [index, data] of leaderboard.entries()) {
        embed.addFields({
          name: `#${index + 1} - ${data.name}`,
          value: `Level: **${data.level}** | Exp: **${data.exp}**`,
        });
      }

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({
        content: "An error occurred while fetching the leaderboard.",
        ephemeral: true,
      });
      console.error("Leaderboard Error:", error);
    }
  },
};
