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
  PermissionFlagsBits,
} from "discord.js";
import phobias from "./phobias.json";

export default {
  data: new SlashCommandBuilder()
    .setName("phobia")
    .setDescription("shows a random phobia"),
  async execute(client: any, interaction: any) {
    await interaction.deferReply();
    function getRandomPhobia() {
      let phobiasJson: any = Object(phobias)
      const keys = Object.keys(phobias);
      const randomIndex = Math.floor(Math.random() * keys.length);
      const randomKey: string = keys[randomIndex];
      let phobia = randomKey
      let description: any = phobiasJson[randomKey];
      return { phobia, description };
    }
    const randomPhobia = getRandomPhobia();
    const embed = new EmbedBuilder()
      .setTitle(randomPhobia.phobia)
      .setDescription(randomPhobia.description)
      .setColor("#FF0000")
      .setFooter({
        text: "if any of the descriptions is wrong, please let the creator know",
      });
    interaction.editReply({ embeds: [embed] });
  },
};
