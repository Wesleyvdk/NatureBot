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
import { useQueue, useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play music from spotify, youtube, or soundcloud")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Enter the song you want to play")
        .setRequired(true)
    ),
  async execute(client, interaction, mongoclient, conn) {
    await interaction.deferReply();

    const player = useMainPlayer();
    const queue = useQueue(interaction.guild.id);

    const channel = interaction.member.voice.channel;
    if (!channel)
      return interaction.editReply({
        content: "You are not connected to a voice channel!",
        ephemeral: true,
      });
    if (queue && queue.channel.id !== channel.id)
      return interaction.editReply({
        content: "I'm already playing in a different voice channel!",
        ephemeral: true,
      });
    if (!channel.viewable)
      return interaction.editReply({
        content: "I need `View Channel` permission.",
        ephemeral: true,
      });
    if (!channel.joinable)
      return interaction.editReply({
        content: "I need `Connect Channel` permission.",
        ephemeral: true,
      });
    if (channel.full)
      return interaction.editReply({
        content: "Can't join, the voice channel is full.",
        ephemeral: true,
      });
    if (interaction.guild.members.me?.voice?.mute)
      return interaction.editReply({
        content: "Please unmute me before playing.",
        ephemeral: true,
      });

    const query = interaction.options.getString("query", true);
    try {
      const searchResult = await player
        .search(query, { requestedBy: interaction.user })
        .catch(() => null);
      if (!searchResult?.hasTracks())
        return interaction.editReply({
          content: `No track was found for ${query}!`,
          ephemeral: true,
        });
      const { track } = await player.play(channel, searchResult, {
        nodeOptions: {
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: interaction, // we can access this metadata object using queue.metadata later on
        },
      });

      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (e) {
      // let's return error if something failed
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  },
};
