import { useQueue, useMainPlayer } from "discord-player";
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
    .setName("synced-lyrics")
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
    const results = await player.lyrics.search({
      q: queryFormated,
    });
    const first = results[0];

    if (!first.syncedLyrics) {
      return; // no synced lyrics available
    }

    const syncedLyrics = queue.syncedLyrics(lyrics);

    syncedLyrics.at(timestampInMilliseconds); // manually get a line at a specific timestamp

    // Listen to live updates. This will be called whenever discord-player detects a new line in the lyrics
    syncedLyrics.onChange(async (lyrics, timestamp) => {
      // timestamp = timestamp in lyrics (not queue's time)
      // lyrics = line in that timestamp
      console.log(timestamp, lyrics);
      await interaction.channel?.send({
        content: `[${timestamp}]: ${lyrics}`,
      });
    });

    const unsubscribe = syncedLyrics.subscribe(); // start watching the queue for live updates. The onChange will not be called unless subscribe() has been called.

    unsubscribe(); // stop watching the queue for live updates
  },
};
