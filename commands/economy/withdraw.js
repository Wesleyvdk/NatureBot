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
    .setName("withdraw")
    .setDescription("deposits balance to the bank")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("specifies the amount to deposit")
    ),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    const amount = interaction.options.getInteger("amount");
    let userid = interaction.user.id;
    let user = interaction.user;
    let username = user.username;

    // MONGO DB
    const collection = mongoclient
      .db("yourDatabase")
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

    const updatedUser = await collection.findOne({ _id: userid });
    if (!amount) {
      const newBank = 0;
      const newCash = updatedUser.bank + updatedUser.cash;
      await collection.updateOne(
        { _id: userid },
        { $set: { cash: newCash, bank: newBank } }
      );
      const balEmbed = new EmbedBuilder().setDescription(
        `Your new balance:\nbank: ${newBank}\ncash: ${newCash}\nbitcoin: ${updatedUser.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    } else if (amount > updatedUser.bank) {
      interaction.editReply(
        `you have insufficient bank balance, your bank balance is: ${updatedUser.bank}`
      );
    } else if (amount <= updatedUser.bank) {
      const newBank = updatedUser.bank - amount;
      const newCash = updatedUser.cash + amount;
      await collection.updateOne(
        { _id: userid },
        { $set: { cash: newCash, bank: newBank } }
      );
      const balEmbed = new EmbedBuilder().setDescription(
        `Your new balance:\nbank: ${newBank}\ncash: ${newCash}\nbitcoin: ${updatedUser.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    }

    // MYSQL DB
    // conn
    //   .promise()
    //   .query(
    //     `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
    //     [userid, userid, interaction.guild.id, username]
    //   );
    // conn
    //   .promise()
    //   .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
    //     userid,
    //   ])
    //   .then(async function ([rows, fields]) {
    //     if (!amount) {
    //       let oldBank = rows[0].bank;
    //       let oldCash = rows[0].cash;
    //       let newBank = 0;
    //       let newCash = Number(oldBank) + Number(oldCash);
    //       rows[0].cash = newCash;
    //       rows[0].bank = newBank;
    //       const balEmbed = new EmbedBuilder().setDescription(
    //         `Your new balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
    //       );
    //       await interaction.editReply({ embeds: [balEmbed] });
    //     } else if (amount > rows[0].cash) {
    //       interaction.editReply(
    //         `you have insufficient cash, your cash is: ${rows[0].cash}`
    //       );
    //     } else if (amount < rows[0].cash) {
    //       let oldBank = rows[0].bank;
    //       let oldCash = rows[0].cash;
    //       await oldBank;
    //       await oldCash;
    //       let { newCash, newBank } = withdraw(oldCash, oldBank, amount);
    //       rows[0].bank = newBank;
    //       rows[0].cash = newCash;
    //       conn
    //         .promise()
    //         .query(
    //           `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash}, bank = ${newBank} WHERE id=${userid}`
    //         );
    //       const balEmbed = new EmbedBuilder().setDescription(
    //         `Your new balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
    //       );
    //       await interaction.editReply({ embeds: [balEmbed] });
    //     }
    //   });
    // function withdraw(oldCash, oldBank, amount) {
    //   newCash = Number(`${oldCash}`) + Number(`${amount}`);
    //   newBank = oldBank - amount;
    //   return { newCash, newBank };
    // }
  },
};
