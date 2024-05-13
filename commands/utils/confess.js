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
  Guild,
} from "discord.js";
import errorHandler from "../../handlers/errorHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("confess")
    .setDescription("list all the active matches")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Enter some text")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("add an attachment to your confession")
    ),
  async execute(client, interaction, conn, mongoclient) {
    const message = interaction.options.getString("message");
    const attachment = interaction.options.getAttachment("attachment");
    await interaction.deferReply();
    // implement server specifics using database

    // my server only
    if (interaction.guild.id === "929352993655124000") {
      const confessions = await mongoclient
        .db("Aylani")
        .collection("confessions");
      const data = await confessions.find({}).toArray();
      let confessChannel = client.channels.cache.get("1098540438270521404");
      let id = data.length + 1;
      console.log(data, id);
      try {
        if (attachment) {
          let embed = new EmbedBuilder()
            .setTitle(`Confession ${id}:`)
            .setDescription(message)
            .setTimestamp()
            .setImage(`${attachment.url}`);
          interaction.deleteReply();
          confessChannel.send({ embeds: [embed] });
          await confessions.insertOne({
            id: id,
            user: interaction.user.id,
          });
        } else {
          let embed = new EmbedBuilder()
            .setTitle(`Confession ${id}:`)
            .setDescription(message)
            .setTimestamp();
          interaction.deleteReply();
          confessChannel.send({ embeds: [embed] });
          await confessions.insertOne({
            id: id,
            user: interaction.user.id,
          });
        }
      } catch (e) {
        errorHandler(interaction, e, null);
      }
    } else interaction.editReply("work in progress");
  },
};
