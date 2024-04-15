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
const usageHandler = require("../../handlers/usageHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("deposits balance to the bank")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("specifies the amount to deposit")
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    usageHandler("withdraw", mongoclient, conn);
    const amount = interaction.options.getInteger("amount");
    userid = interaction.user.id;
    user = interaction.user;
    username = user.username;
    conn
      .promise()
      .query(
        `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
        [userid, userid, interaction.guild.id, username]
      );
    conn
      .promise()
      .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
        userid,
      ])
      .then(async function ([rows, fields]) {
        if (!amount) {
          oldBank = rows[0].bank;
          oldCash = rows[0].cash;
          newBank = 0;
          newCash = Number(oldBank) + Number(oldCash);
          rows[0].cash = newCash;
          rows[0].bank = newBank;
          const balEmbed = new EmbedBuilder().setDescription(
            `Your new balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
          );
          await interaction.editReply({ embeds: [balEmbed] });
        } else if (amount > rows[0].cash) {
          interaction.editReply(
            `you have insufficient cash, your cash is: ${rows[0].cash}`
          );
        } else if (amount < rows[0].cash) {
          let oldBank = rows[0].bank;
          let oldCash = rows[0].cash;
          await oldBank;
          await oldCash;
          withdraw(oldCash, oldBank, amount);
          rows[0].bank = newBank;
          rows[0].cash = newCash;
          conn
            .promise()
            .query(
              `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash}, bank = ${newBank} WHERE id=${userid}`
            );
          const balEmbed = new EmbedBuilder().setDescription(
            `Your new balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
          );
          await interaction.editReply({ embeds: [balEmbed] });
        }
      });
    function withdraw(oldCash, oldBank, amount) {
      newCash = Number(`${oldCash}`) + Number(`${amount}`);
      newBank = oldBank - amount;
    }
  },
};
