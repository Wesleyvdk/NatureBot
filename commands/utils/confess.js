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
  Guild,
} = require("discord.js");
const moment = require("moment/moment");
let CurrentDate = moment().format();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("confess")
    .setDescription("list all the active matches")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Enter some text")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("add an attachment to your confession")
    ),
  async execute(client, interaction) {
    const message = interaction.options.getString("message");
    const attachment = interaction.options.getAttachment("attachment");
    await interaction.deferReply({ ephemeral: true });
    // implement server specifics using database

    // my server only
    if (interaction.guild.id === "929352993655124000") {
      let confessChannel = client.channels.cache.get("1098540438270521404");
      try {
        if (attachment) {
          let embed = new EmbedBuilder()
            .setTitle("Confession:")
            .setDescription(message)
            .setTimestamp()
            .setImage(`${attachment.url}`);
          confessChannel.send({ embeds: [embed] });
          interaction.editReply({
            content: "confession has been sent",
            ephemeral: true,
          });
        } else {
          let embed = new EmbedBuilder()
            .setTitle("Confession:")
            .setDescription(message)
            .setTimestamp();
          confessChannel.send({ embeds: [embed] });
          interaction.editReply({
            content: "confession has been sent",
            ephemeral: true,
          });
        }
      } catch (e) {
        console.log(`Error: ${e}`);
        console.log(`Date/Time: ${CurrentDate}`);
      }
    } else interaction.editReply("work in progress");
  },
};
