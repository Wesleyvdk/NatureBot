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
    .setName("nowplaying")
    .setDescription("Show the currentp playing track."),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();
    const track = queue.currentTrack;
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "template"`
      );
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Nowplaying 🎵" })
      .setTitle(`${track.title}`)
      .setURL(`${track.url}`)
      .setThumbnail(`${track.thumbnail}`)
      .setDescription(`Played by: ${track.requestedBy.toString()}\n
${queue.node.createProgressBar()}`);

    return interaction
      .editReply({ ephemeral: true, embeds: [embed] })
      .catch(console.error);
  },
};