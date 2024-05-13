import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} from "discord.js";
import moment from "moment/moment.js";
let CurrentDate = moment().format();

export default function handleError(interaction, e, message) {
  let embed = new EmbedBuilder()
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
}
