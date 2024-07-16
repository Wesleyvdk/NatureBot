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
import usageHandler from "../../handlers/usageHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("shows the current balance of the user")
    .addUserOption((option) =>
      option.setName("user").setDescription("select a user")
    ),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    const mentioned = interaction.options.getUser("user");
    let userid = interaction.user.id;

    // let mentioned = interaction.mentions.users.first();
    // MONGO DB
    const collection = mongoclient
      .db("Aylani")
      .collection(`${interaction.guild.id}Currency`);

    if (mentioned) {
      let mentionedid = mentioned.id;

      const user = await collection.findOne({ _id: mentionedid });
      if (!user) {
        await collection.insertOne({
          _id: mentionedid,
          username: mentioned.username,
          bank: 0,
          cash: 0,
          bitcoin: 0,
        });
      }

      const updatedUser = await collection.findOne({ _id: mentionedid });
      const balEmbed = new EmbedBuilder().setDescription(
        `${mentioned}'s current balance:\nbank: ${updatedUser.bank}\ncash: ${updatedUser.cash}\nbitcoin: ${updatedUser.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    } else {
      const user = await collection.findOne({ _id: userid });
      if (!user) {
        await collection.insertOne({
          _id: userid,
          username: interaction.user.username,
          bank: 500,
          cash: 0,
          bitcoin: 0,
        });
      }

      const updatedUser = await collection.findOne({ _id: userid });
      const balEmbed = new EmbedBuilder().setDescription(
        `Your current balance:\nbank: ${updatedUser.bank}\ncash: ${updatedUser.cash}\nbitcoin: ${updatedUser.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    }

    // MYSQL DB
    // if (mentioned) {
    //   let mentionedid = mentioned.id;
    //   conn
    //     .promise()
    //     .query(
    //       `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 0, 0)`,
    //       [mentionedid, mentionedid, interaction.guild.id, mentioned.username]
    //     );
    //   conn
    //     .promise()
    //     .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
    //       mentionedid,
    //     ])
    //     .then(async function ([rows, fields]) {
    //       const balEmbed = new EmbedBuilder().setDescription(
    //         `${mentioned}'s current balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin: ${rows[0].bitcoin}`
    //       );
    //       await interaction.editReply({ embeds: [balEmbed] });
    //     });
    // } else {
    //   if (!table.findOne({ _id: userid })) {
    //     table.insertOne({
    //       _id: userid,
    //       username: interaction.user.username,
    //       bank: 500,
    //       cash: 0,
    //       bitcoin: 0,
    //     });
    //   }
    //   conn
    //     .promise()
    //     .query(
    //       `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
    //       [userid, userid, interaction.guild.id, interaction.user.username]
    //     );
    //   conn
    //     .promise()
    //     .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
    //       userid,
    //     ])
    //     .then(async function ([rows, fields]) {
    //       const balEmbed = new EmbedBuilder().setDescription(
    //         `Your current balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
    //       );
    //       await interaction.editReply({ embeds: [balEmbed] });
    //     });
    // }
  },
};
