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

const errorHandler = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("answer a trivial question"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "trivia"`
      );
    let answers = [];
    const response = await fetch(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );
    const data = await response.json();
    for (let i = 0; i < data.results[0].incorrect_answers.length; i++)
      answers.push(data.results[0].incorrect_answers[i]);
    answers.push(data.results[0].correct_answer);
    const correct = data.results[0].correct_answer;
    shuffleArray(answers);
    const embed = new EmbedBuilder()
      .setDescription(data.results[0].question)
      .addFields(
        { name: `1 ${answers[0]}`, value: "\u200B" },
        { name: `2 ${answers[1]}`, value: "\u200B" },
        { name: `3 ${answers[2]}`, value: "\u200B" },
        { name: `4 ${answers[3]}`, value: "\u200B" }
      );

    const oneButton = new ButtonBuilder()
      .setCustomId("1")
      .setLabel("1")
      .setStyle(ButtonStyle.Primary);
    const twoButton = new ButtonBuilder()
      .setCustomId("2")
      .setLabel("2")
      .setStyle(ButtonStyle.Primary);
    const threeButton = new ButtonBuilder()
      .setCustomId("3")
      .setLabel("3")
      .setStyle(ButtonStyle.Primary);
    const fourButton = new ButtonBuilder()
      .setCustomId("4")
      .setLabel("4")
      .setStyle(ButtonStyle.Primary);
    const buttonRow = new ActionRowBuilder().addComponents(
      oneButton,
      twoButton,
      threeButton,
      fourButton
    );
    interaction.editReply({ embeds: [embed], components: [buttonRow] });
    try {
      const triviaCollector =
        interaction.channel.createMessageComponentCollector({
          componentType: ComponentType.Button,
          max: 1,
          time: 60_000,
        });
      triviaCollector.on("collect", async (i) => {
        if (i.customId === "1") {
          if (answers[0] === correct) {
            i.reply({
              content: `Congratulations! You got the right answer!`,
              components: [],
            });
            interaction.editReply({ components: [] });
          } else {
            i.reply({ content: `Unlucky! Try again!` });
            interaction.editReply({ components: [] });
          }
        } else if (i.customId === "2") {
          if (answers[1] === correct) {
            i.reply({
              content: `Congratulations! You got the right answer!`,
              components: [],
            });
            interaction.editReply({ components: [] });
          } else {
            i.reply({ content: `Unlucky! Try again!` });
            interaction.editReply({ components: [] });
          }
        } else if (i.customId === "3") {
          if (answers[2] === correct) {
            i.reply({
              content: `Congratulations! You got the right answer!`,
              components: [],
            });
            interaction.editReply({ components: [] });
          } else {
            i.reply({ content: `Unlucky! Try again!` });
            interaction.editReply({ components: [] });
          }
        } else if (i.customId === "4") {
          if (answers[3] === correct) {
            i.reply({
              content: `Congratulations! You got the right answer!`,
              components: [],
            });
            interaction.editReply({ components: [] });
          } else {
            i.reply({ content: `Unlucky! Try again!` });
            interaction.editReply({ components: [] });
          }
        }
      });
      triviaCollector.on("end", (collected) => {
        console.log(`Collected ${collected.size} interactions.`);
      });
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
