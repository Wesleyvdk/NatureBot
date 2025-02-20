import { useQueue } from "discord-player";
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
  User,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show the currentp playing track."),
  async execute(client: any, interaction: any, conn: any, mongoclient: any) {
    await interaction.deferReply();
    const queue = useQueue();

    if (queue == null) {
      return interaction.editReply("Queue does not exist")
    }

    const track = queue.currentTrack;

    if (track == null)
      return interaction.editReply({ ephemeral: true, content: "No track found" })
    if (track.requestedBy == null)
      return interaction.editReply({ ephemeral: true, content: "Could not find user" })

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
