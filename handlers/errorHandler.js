const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Colors,
} = require("discord.js");
const moment = require("moment/moment");
let CurrentDate = moment().format();

module.exports = function handleError(interaction, e, message) {
  embed = new EmbedBuilder()
    .setDescription("There was an error, please notify the creator of the bot")
    .setColor(Colors.Red);
  const buttonComponent = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("support")
      .setURL("https://discord.gg/pYzZd3DbDq")
      .setStyle(ButtonStyle.Link)
  );

  if (!interaction) {
    message.editReply({
      embeds: [embed],
      components: [buttonComponent],
    });
    console.log(`Error: ${e}\n in server: ${message.guild.name}`);
    console.log(`Date/Time: ${CurrentDate}`);
  }
  if (!message) {
    interaction.editReply({
      embeds: [embed],
      components: [buttonComponent],
    });
    console.log(`Error: ${e}\n in server: ${interaction.guild.name}`);
    console.log(`Date/Time: ${CurrentDate}`);
  }
};
