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
    .setName("balance")
    .setDescription("shows the current balance of the user")
    .addUserOption((option) =>
      option.setName("user").setDescription("select a user")
    ),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    const mentioned = interaction.options.getUser("user");
    userid = interaction.user.id;

    // let mentioned = interaction.mentions.users.first();
    if (mentioned) {
      mentionedid = mentioned.id;

      conn
        .promise()
        .query(
          `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (?, ?, ?, ?, 0, 0, 0)`,
          [mentionedid, mentionedid, interaction.guild.id, mentioned.username]
        );
      conn
        .promise()
        .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
          mentionedid,
        ])
        .then(async function ([rows, fields]) {
          const balEmbed = new EmbedBuilder().setDescription(
            `${mentioned}'s current balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin: ${rows[0].bitcoin}`
          );
          await interaction.editReply({ embeds: [balEmbed] });
        });
    } else {
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
          const balEmbed = new EmbedBuilder().setDescription(
            `Your current balance:\nbank: ${rows[0].bank}\ncash: ${rows[0].cash}\nbitcoin ${rows[0].bitcoin}`
          );
          await interaction.editReply({ embeds: [balEmbed] });
        });
    }
  },
};
