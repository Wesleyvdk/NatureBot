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
const { lyricsExtractor } = require("@discord-player/extractor");
const lyricsFinder = lyricsExtractor();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get and show the lyrics of current playing track.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Choose a song you want the lyrics of")
    ),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    const query =
      interaction.options.getString("query", false) ??
      queue?.currentTrack?.title;

    if (!query)
      return interaction.editReply({
        content: "You forgot to provide the track name.",
        ephemeral: true,
      });

    const queryFormated = query
      .toLowerCase()
      .replace(
        /\(lyrics|lyric|official music video|official video hd|official video|audio|official|clip officiel|clip|extended|hq\)/g,
        ""
      );

    const result = await lyricsFinder.search(queryFormated).catch(() => null);

    if (!result || !result.lyrics)
      return interaction.editReply("No lyrics were found for this track.");

    const lyrics =
      result.lyrics.length > 4096
        ? `${result.lyrics.slice(0, 4090)}...`
        : result.lyrics;

    const embed = new EmbedBuilder()
      .setTitle(result.title)
      .setURL(result.url)
      .setThumbnail(result.thumbnail)
      .setAuthor({
        name: result.artist.name,
        iconURL: result.artist.image,
        url: result.artist.url,
      })
      .setDescription(lyrics);

    return interaction.editReply({ embeds: [embed] }).catch(console.error);
  },
};
