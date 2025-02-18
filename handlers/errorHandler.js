import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} from "discord.js";
import moment from "moment/moment.js";
import chalk from "chalk"; // Add chalk for console colors

let CurrentDate = moment().format();

export default function handleError(interaction, e, message) {
  let embed = new EmbedBuilder()
    .setTitle("An Error Occurred")
    .setDescription("There was an error, please notify the creator of the bot")
    .setColor(Colors.Red)
    .addFields(
      {
        name: "Error Message",
        value: `\`\`\`${e.message}\`\`\``,
        inline: false,
      },
      { name: "Error Code", value: `\`${e.code || "N/A"}\``, inline: true },
      { name: "Status", value: `\`${e.status || "N/A"}\``, inline: true },
      { name: "Method", value: `\`${e.method || "N/A"}\``, inline: true },
      { name: "URL", value: `\`${e.url || "N/A"}\``, inline: false },
      {
        name: "Server",
        value: `\`${message ? message.guild.name : interaction.guild.name}\``,
        inline: true,
      },
      { name: "Date/Time", value: `\`${CurrentDate}\``, inline: true }
    );

  const buttonComponent = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Support")
      .setURL("https://discord.gg/pYzZd3DbDq")
      .setStyle(ButtonStyle.Link)
  );

  if (!interaction) {
    message.reply({
      embeds: [embed],
      components: [buttonComponent],
    });
    console.log(chalk.red.bold("Error Details:"));
    console.log(chalk.red(`Error: ${e.message}`));
    console.log(chalk.red(`Code: ${e.code || "N/A"}`));
    console.log(chalk.red(`Status: ${e.status || "N/A"}`));
    console.log(chalk.red(`Method: ${e.method || "N/A"}`));
    console.log(chalk.red(`URL: ${e.url || "N/A"}`));
    console.log(chalk.red(`Server: ${message.guild.name}`));
    console.log(chalk.red(`Date/Time: ${CurrentDate}`));
  }
  if (!message) {
    if (!interaction.deferred) interaction.channel.send({ embeds: [embed] });
    else {
      interaction.followUp({
        embeds: [embed],
        components: [buttonComponent],
      });
    }
    console.log(chalk.red.bold("Error Details:"));
    console.log(chalk.red(`Error: ${e.message}`));
    console.log(chalk.red(`Code: ${e.code || "N/A"}`));
    console.log(chalk.red(`Status: ${e.status || "N/A"}`));
    console.log(chalk.red(`Method: ${e.method || "N/A"}`));
    console.log(chalk.red(`URL: ${e.url || "N/A"}`));
    console.log(chalk.red(`Server: ${interaction.guild.name}`));
    console.log(chalk.red(`Date/Time: ${CurrentDate}`));
  }
}
