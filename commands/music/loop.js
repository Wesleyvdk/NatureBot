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
import { QueueRepeatMode } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("list all the active matches")
    .addSubcommand((option) =>
      option.setName("show").setDescription("Show current repeat mode status.")
    )
    .addSubcommand((option) =>
      option.setName("off").setDescription("Default mode with no loop active")
    )
    .addSubcommand((option) =>
      option.setName("queue").setDescription("Loop the current queue")
    )
    .addSubcommand((option) =>
      option.setName("track").setDescription("Repeat the current track")
    )
    .addSubcommand((option) =>
      option
        .setName("autoplay")
        .setDescription(
          "Play related songs automatically based on your existing queue"
        )
    ),
  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    const subCmd = await interaction.options.getSubcommand(true);
    let description;
    switch (subCmd) {
      case "off":
        queue.setRepeatMode(QueueRepeatMode.OFF);
        description = "Turned off repeat mode.";
        break;
      case "track":
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        description = "Looping the current track.";
        break;
      case "queue":
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        description = "Looing the current queue.";
        break;
      case "autoplay":
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        description = "Autoplay mode activated.";
        break;
      // case "show":
      default:
        let status = "none";
        if (queue.repeatMode === 3) {
          status = "autoplay";
        } else if (queue.repeatMode === 2) {
          status = "queue";
        } else if (queue.repeatMode === 1) {
          status = "track";
        } else if (queue.repeatMode === 0) {
          status = "off";
        }

        const embed = new EmbedBuilder()
          .setDescription(`Playback repeat status: \`${status}\`.`)
          .setFooter({
            text: `Use '/repeat <off|track|queue|autoplay>' to change repeat mode.`,
          });

        return interaction.editReply({ embeds: [embed] }).catch(console.error);
    }
    const neembed = new EmbedBuilder().setDescription(description);
    return interaction.editReply({
      embeds: [neembed],
    });
  },
};
