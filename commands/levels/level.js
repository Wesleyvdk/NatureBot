const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("shows your current level"),
  async execute(client, interaction, conn) {
    userid = interaction.user.id;
    conn
      .promise()
      .query("SELECT * FROM levels WHERE id=?", [userid])
      .then(function ([rows, fields]) {
        interaction.reply(
          `${interaction.user}, your current level is ${rows[0].level} and your current exp is ${rows[0].exp}`
        );
      });
  },
};
