import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("shows your current level"),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    let userid = interaction.user.id;

    // MONGO DB

    mongoclient
      .db("Aylani")
      .collection(`${interaction.guild.id}Levels`)
      .findOne({ _id: userid })
      .then((doc) => {
        interaction.editReply(
          `${interaction.user}, your current level is ${doc.level} and your current exp is ${doc.exp}`
        );
      });

    // MYSQL DB
    // conn
    //   .promise()
    //   .query(`SELECT * FROM ${interaction.guild.id}Levels WHERE id=?`, [userid])
    //   .then(function ([rows, fields]) {
    //     interaction.editReply(
    //       `${interaction.user}, your current level is ${rows[0].level} and your current exp is ${rows[0].exp}`
    //     );
    //   });
  },
};
