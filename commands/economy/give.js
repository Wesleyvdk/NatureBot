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
    .setName("give")
    .setDescription("gives a specific amount to another user")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("specifies the amount to give")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to give to")
        .setRequired(true)
    ),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    let userid = interaction.user.id;
    let user = interaction.user;
    let username = user.username;
    let targetid = target.id;

    // MONGO DB
    const collection = mongoclient
      .db("Aylani")
      .collection(`${interaction.guild.id}Currency`);

    const userDB = await collection.findOne({ _id: userid });
    if (!userDB) {
      await collection.insertOne({
        _id: userid,
        username: interaction.user.username,
        bank: 0,
        cash: 1000,
        bitcoin: 0,
      });
    }

    const targetUser = await collection.findOne({ _id: targetid });
    if (!targetUser) {
      await collection.insertOne({
        _id: targetid,
        username: target.username,
        bank: 0,
        cash: 0,
        bitcoin: 0,
      });
    }

    const updatedUser = await collection.findOne({ _id: userid });
    const updatedTargetUser = await collection.findOne({ _id: targetid });

    if (amount > updatedUser.cash) {
      interaction.editReply({
        content: `you have insuficient cash! your current cash is: ${updatedUser.cash}`,
        ephemeral: true,
      });
    } else {
      let newCashUser = updatedUser.cash - amount;
      let newCashTarget = updatedTargetUser.cash + amount;
      await collection.updateOne(
        { _id: userid },
        { $set: { cash: newCashUser } }
      );
      await collection.updateOne(
        { _id: targetid },
        { $set: { cash: newCashTarget } }
      );
      const giveEmbed = new EmbedBuilder()
        .setDescription(`${interaction.user} gave ${amount} to ${target}`)
        .setTimestamp();
      await interaction.editReply({ embeds: [giveEmbed] });
    }

    // MYSQL DB
    // conn
    //   .promise()
    //   .query(
    //     `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
    //     [userid, userid, interaction.guild.id, interaction.user.username]
    //   );

    // conn
    //   .promise()
    //   .query(
    //     `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
    //     [targetid, targetid, interaction.guild.id, target.username]
    //   );
    // conn
    //   .promise()
    //   .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
    //     userid,
    //   ])
    //   .then(async function ([userRows, fields]) {
    //     conn
    //       .promise()
    //       .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
    //         userid,
    //       ])
    //       .then(async function ([targetRows, fields]) {
    //         if (amount > userRows[0].cash) {
    //           interaction.editReply({
    //             content: `you have insuficient cash! your current cash is: ${userRows[0].cash}`,
    //             ephemeral: true,
    //           });
    //         } else {
    //           let oldCashuser = userRows[0].cash;
    //           let oldCashTarget = targetRows[0].cash;
    //           let newCashTarget =
    //             Number(`${oldCashTarget}`) + Number(`${amount}`);
    //           let newCashuser = oldCashuser - amount;
    //           userRows[0].cash = newCashuser;
    //           targetRows[0].cash = newCashTarget;
    //           conn
    //             .promise()
    //             .query(
    //               `UPDATE ${interaction.guild.id}Currency SET cash = ${newCashuser} WHERE id=${userid}`
    //             );
    //           conn
    //             .promise()
    //             .query(
    //               `UPDATE ${interaction.guild.id}Currency SET cash = ${newCashTarget} WHERE id=${targetid}`
    //             );
    //           const giveEmbed = new EmbedBuilder()
    //             .setDescription(`${user} gave ${amount} to ${target}`)
    //             .setTimestamp();
    //           await interaction.editReply({ embeds: [giveEmbed] });
    //         }
    //       });
    // });
  },
};
