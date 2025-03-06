import { SlashCommandBuilder } from "discord.js";
import * as db from "../../handlers/databaseHandler";

export const command = {
  data: new SlashCommandBuilder()
    .setName("ignorechannel")
    .setDescription("Set ignore status for this channel.")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Choose ignore type")
        .setRequired(true)
        .addChoices(
          { name: "Ignore Messages", value: "ignore messages" },
          { name: "Ignore Commands", value: "ignore commands" },
          { name: "Ignore All", value: "ignore all" }
        )
    ),
  async execute(interaction: any) {
    await interaction.deferReply();
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;
    const status = interaction.options.getString("status");

    await db.addIgnoredChannel(guildId, channelId, status);
    await interaction.editReply(`This channel is now set to **${status}**.`);
  },
};
