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
import errorHandler from "../../handlers/errorHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to ban.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    const option = interaction.options.getUser("user");

    try {
      let bannedMember = await interaction.guild.members.ban(option);
      if (option == interaction.user.id) {
        interaction.editReply({
          content: "you can't ban yourself",
          ephemeral: true,
        });
      } else {
        bannedMember;
        interaction.editReply({ content: `${option.name} was banned` });
      }
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
