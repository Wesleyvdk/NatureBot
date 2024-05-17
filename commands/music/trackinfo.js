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
const moment = require("moment/moment");
let CurrentDate = moment().format();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trackinfo")
    .setDescription("Show details of a track.")
    .addNumberOption((option) =>
      option
        .setName("index")
        .setDescription("That track's index.")
        .setRequired(true)
    ),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    const index = interaction.options.getNumber("index", true) - 1;

    if (index > queue.size || index < 0)
      return interaction.editReply({
        content: "Provided track Index does not exist.",
        ephemeral: true,
      });

    const track = queue.tracks.toArray()[index];

    if (!track) return interaction.editReply("The track was not found.");

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Trackinfo 🎵" })
      .setTitle(`${track.title}`)
      .setURL(`${track.url}`)
      .setThumbnail(`${track.thumbnail}`)
      .setDescription(`~ Requested by: ${track.requestedBy.toString()}
  Duration: ${track.duration}
  Position in queue: ${index + 1}`);

    return interaction.editReply({ embeds: [embed] }).catch(console.error);
  },
};
