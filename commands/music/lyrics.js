import { useMainPlayer, useQueue } from "discord-player";
import {
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
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get and show the lyrics of current playing track.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Choose a song you want the lyrics of")
    ),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();
    const queue = useQueue();
    const player = useMainPlayer();
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
    const lyrics = await player.lyrics.search({
      q: query,
    });
    if (!lyrics.length)
      return interaction.editReply({
        content: "No lyrics found",
        ephemeral: true,
      });

    const trimmedLyrics = lyrics[0].plainLyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
      .setTitle(lyrics[0].title)
      .setURL(lyrics[0].url)
      .setThumbnail(lyrics[0].thumbnail)
      .setAuthor({
        name: lyrics[0].artist.name,
        iconURL: lyrics[0].artist.image,
        url: lyrics[0].artist.url,
      })
      .setDescription(
        trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
      )
      .setColor("Yellow");

    return interaction.editReply({ embeds: [embed] });
  },
};
