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
const words = require("./words.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("word")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    function getRandomWord() {
      const keys = Object.keys(words);
      const randomIndex = Math.floor(Math.random() * keys.length);
      const randomKey = keys[randomIndex];
      return { word: randomKey, description: words[randomKey] };
    }
    const randomWord = getRandomWord();
    const embed = new EmbedBuilder()
      .setTitle(randomWord.word)
      .setDescription(randomWord.description)
      .setColor("#FF0000")
      .setFooter({
        text: "if any of the descriptions is wrong, please let the creator know",
      });
    interaction.editReply({ embeds: [embed] });
  },
};
