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
    .setName("deposit")
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
    // mongoclient
    //   .db("Aylani")
    //   .collection(`${interaction.guild.id}Currency`)
    //   .findOne({ _id: userid })
    //   .then(async ([rows]) => {
    //     if (!amount) {
    //       oldBank = rows.bank;
    //       oldCash = rows.cash;
    //       newBank = 0;
    //       newCash = Number(oldBank) + Number(oldCash);
    //       rows.cash = newCash;
    //       rows.bank = newBank;
    //       const balEmbed = new EmbedBuilder().setDescription(
    //         `Your new balance:\nbank: ${rows.bank}\ncash: ${rows.cash}\nbitcoin ${rows.bitcoin}`
    //       );
    //       await interaction.editReply({ embeds: [balEmbed] });
    //     } else if (amount > rows.cash) {
    //       interaction.editReply(
    //         `you have insufficient cash, your cash is: ${rows.cash}`
    //       );
    //     } else if (amount < rows.cash) {
    //       let oldBank = rows.bank;
    //       let oldCash = rows.cash;
    //       await oldBank;
    //       await oldCash;
    //       withdraw(oldCash, oldBank, amount);
    //       rows.bank = newBank;
    //       rows.cash = newCash;
    //       mongoclient
    //         .db("Aylani")
    //         .collection(`${interaction.guild.id}Currency`)
    //         .updateOne(
    //           { _id: userid },
    //           { $set: { bank: newBank, cash: newCash } }
    //         );
    //       const balEmbed = new EmbedBuilder().setDescription(
    //         `Your new balance:\nbank: ${rows.bank}\ncash: ${rows.cash}\nbitcoin ${rows.bitcoin}`
    //       );
    //       interaction.editReply({ embeds: [balEmbed] });
    //     }
    //   });
    // MYSQL DB
    conn
      .promise()
      .query(
        `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
        [userid, userid, interaction.guild.id, interaction.user.username]
      );
    conn
      .promise()
      .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
        userid,
      ])
      .then(async function ([rows, fields]) {
        if (!amount) {
          let oldCash = rows[0].cash;
          let oldBank = rows[0].bank;
          let newBank = Number(oldCash) + Number(oldBank);
          let newCash = 0;
          conn
            .promise()
            .query(
              `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash}, bank = ${newBank} WHERE id=${userid}`
            );
          const balEmbed = new EmbedBuilder().setDescription(
            `Your new balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
          );
          await interaction.editReply({ embeds: [balEmbed] });
        } else if (amount > rows[0].cash) {
          interaction.editReply(
            `you have insufficient cash, your cash is: ${rows[0].cash}`
          );
        } else if (amount < rows[0].cash) {
          let oldCash = rows[0].cash;
          let oldBank = rows[0].bank;
          await oldBank;
          await oldCash;
          let { newCash, newBank } = deposit(oldCash, oldBank, amount);
          rows[0].bank = newBank;
          rows[0].cash = newCash;
          const balEmbed = new EmbedBuilder().setDescription(
            `Your new balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
          );
          interaction.editReply({ embeds: [balEmbed] });
        }
      });

    function deposit(oldCash, oldBank, amount) {
      newCash = oldCash - amount;
      newBank = Number(`${oldBank}`) + Number(`${amount}`);
      return { newCash, newBank };
    }
  },
};
