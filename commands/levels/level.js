const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("shows your current level"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "level"`
      );

    userid = interaction.user.id;
    conn
      .promise()
      .query(`SELECT * FROM ${interaction.guild.id}Levels WHERE id=?`, [userid])
      .then(function ([rows, fields]) {
        interaction.editReply(
          `${interaction.user}, your current level is ${rows[0].level} and your current exp is ${rows[0].exp}`
        );
      });
  },
};
