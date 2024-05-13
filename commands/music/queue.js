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
    .setName("queue")
    .setDescription("list all the active matches")
    .addNumberOption((option) =>
      option.setName("page").setDescription("choose the queue page")
    ),

  async execute(client, interaction, conn, mongoclient, queue) {
    await interaction.deferReply();

    if (!queue.size)
      return interaction.editReply("There is no track in the queue.");

    let page = interaction.options.getNumber("page", false) ?? 1;

    const multiple = 10;

    const maxPages = Math.ceil(queue.size / multiple);

    if (page < 1 || page > maxPages) page = 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.tracks.toArray().slice(start, end);

    const embed = new EmbedBuilder()
      .setDescription(
        `${tracks
          .map(
            (track, i) =>
              `${start + ++i} - [${track.title}](${
                track.url
              }) ~ [${track.requestedBy.toString()}]`
          )
          .join("\n")}`
      )
      .setFooter({
        text: `Page ${page} of ${maxPages} | track ${start + 1} to ${
          end > queue.size ? `${queue.size}` : `${end}`
        } of ${queue.size}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    return interaction.editReply({ embeds: [embed] }).catch(console.error);
  },
};
