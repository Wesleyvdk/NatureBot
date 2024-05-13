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
      const id = interaction.options.getString("id");
      let userid = interaction.user.id;
      let username = interaction.user.username;
      let db = await mongoclient.db("Aylani");
      let collection = await db.collection("confessions");
      const confession = await collection.findOne({ id: parseInt(id) });
      const user = await client.users.fetch(confession.user);
      interaction.editReply(
        `confession with id: ${id} was posted by ${user.username} (id: ${confession.user})`
      );
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
