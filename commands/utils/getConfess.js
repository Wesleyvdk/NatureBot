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
const errorHandler = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-confess")
    .setDescription("get the user who posted a confession by confession ID")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Enter the confession ID")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.BanMembers && PermissionFlagsBits.KickMembers
    ),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    try {
      const message = interaction.options.getString("id");
      userid = interaction.user.id;
      username = interaction.user.username;
      db = mongoclient.db("Aylani");
      collection = db.collection("confessions");
      const confession = collection.findOne({ _id: id });
      const user = await client.users.fetch(confession.user);
      interaction.editReply(
        `confession with id: ${id} was posted by ${user.username} (id: ${confession.user})`
      );
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
