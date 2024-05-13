import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  AttachmentBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("yesno")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    let yesno = ["yes.", "no."];
    let randomYesNo = yesno[Math.floor(Math.random() * yesno.length)];

    interaction.editReply(randomYesNo);
  },
};
