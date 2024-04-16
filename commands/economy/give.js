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
    userid = interaction.user.id;
    user = interaction.user;
    username = user.username;
    targetid = target.id;
    // MONGO DB

    // mongoclient
    //   .db("Aylani")
    //   .collection(`${interaction.guild.id}Currency`)
    //   .findOne({ _id: userid })
    //   .then(async ([userRows]) => {
    //     mongoclient
    //       .db("Aylani")
    //       .collection(`${interaction.guild.id}Currency`)
    //       .findOne({ _id: targetid })
    //       .then(async ([targetRows]) => {
    //         if (amount > userRows[0].cash) {
    //           interaction.editReply({
    //             content: `you have insuficient cash! your current cash is: ${userRows[0].cash}`,
    //             ephemeral: true,
    //           });
    //         } else {
    //           let oldCashuser = userRows[0].cash;
    //           let oldCashTarget = targetRows[0].cash;
    //           newCashTarget = Number(`${oldCashTarget}`) + Number(`${amount}`);
    //           newCashuser = oldCashuser - amount;
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
      .query(
        `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 1000, 0)`,
        [targetid, targetid, interaction.guild.id, target.username]
      );
    conn
      .promise()
      .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
        userid,
      ])
      .then(async function ([userRows, fields]) {
        conn
          .promise()
          .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
            userid,
          ])
          .then(async function ([targetRows, fields]) {
            if (amount > userRows[0].cash) {
              interaction.editReply({
                content: `you have insuficient cash! your current cash is: ${userRows[0].cash}`,
                ephemeral: true,
              });
            } else {
              let oldCashuser = userRows[0].cash;
              let oldCashTarget = targetRows[0].cash;
              newCashTarget = Number(`${oldCashTarget}`) + Number(`${amount}`);
              newCashuser = oldCashuser - amount;
              userRows[0].cash = newCashuser;
              targetRows[0].cash = newCashTarget;
              conn
                .promise()
                .query(
                  `UPDATE ${interaction.guild.id}Currency SET cash = ${newCashuser} WHERE id=${userid}`
                );
              conn
                .promise()
                .query(
                  `UPDATE ${interaction.guild.id}Currency SET cash = ${newCashTarget} WHERE id=${targetid}`
                );
              const giveEmbed = new EmbedBuilder()
                .setDescription(`${user} gave ${amount} to ${target}`)
                .setTimestamp();
              await interaction.editReply({ embeds: [giveEmbed] });
            }
          });
      });
  },
};
