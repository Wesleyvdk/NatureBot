import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("shows the shop"),
  async execute(client: any, interaction: any, conn: any) {
    await interaction.deferReply();

    const shopembed = new EmbedBuilder()
      .setDescription("The shop is empty right now")
      .setFooter({ text: "leave some shop suggestions behind" });
    interaction.editReply({ embeds: [shopembed] });
  },
};
