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
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("list all the active matches")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("set the question to reply to")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    await interaction.deferReply();
    const question = interaction.options.getString("question");
    let ball = [
      "yes.",
      "no.",
      "maybe.",
      "I doubt it.",
      "I don't think so.",
      "definitely.",
      "I'm not sure.",
      "If my calculations are correct, it's a no.",
      "If my calculations are correct, it's a yes.",
      "I question it.",
    ];
    let randomBall = ball[Math.floor(Math.random() * ball.length)];

    let embed = new EmbedBuilder()
      .setTitle("magic 8ball says")
      .setDescription(`question: ${question}\nanswer: ${randomBall}`);

    interaction.editReply({ embeds: [embed] });
  },
};
