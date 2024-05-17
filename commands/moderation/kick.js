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
  PermissionFlagsBits,
} = require("discord.js");
const errorHandler = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kicks a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to ban.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    const member = interaction.options.getUser("user");

    if (member == interaction.author.id) {
      interaction.editReply({
        content: "you can't kick yourself",
        ephemeral: true,
      });
    } else {
      try {
        await member.kick();
        interaction.editReply({ content: `${member.name} was kicked.` });
      } catch (e) {
        errorHandler(interaction, e, null);
      }
    }
  },
};
