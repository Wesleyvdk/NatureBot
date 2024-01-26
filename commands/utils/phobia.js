const {
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
} = require("discord.js");
const phobias = require("phobia.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("phobia")
    .setDescription("shows a random phobia"),
  async execute(client, interaction) {
    await interaction.deferReply();

    function getRandomPhobia() {
      const keys = Object.keys(phobias);
      const randomIndex = Math.floor(Math.random() * keys.length);
      const randomKey = keys[randomIndex];
      return { phobia: randomKey, description: phobias[randomKey] };
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
