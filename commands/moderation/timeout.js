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
  PermissionFlagsBits,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("time another user out")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to time out.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("Set the duration of the time out")
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    const member = interaction.options.getUser("user");
    const duration = interaction.options.getNumber("duration") ?? 60_000;

    member.timeout(duration); // Timeout for one minute
    interaction.editReply({
      content: `${member.name} was timed out for ${duration}`,
    });
  },
};
