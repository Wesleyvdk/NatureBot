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

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("shows the leaderboard"),
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();

    // MONGO DB
    mongoclient
      .db("Aylani")
      .collection(`${interaction.guild.id}Levels`)
      .find()
      .sort({ level: -1, exp: -1 })
      .limit(10)
      .toArray()
      .then((rows) => {
        // Now shake it and show it! (as a nice embed, too!)
        const embed = new EmbedBuilder()
          .setTitle("Leaderboard")
          //.setAuthor(client.user.username, client.user.displayAvatarURL())
          .setDescription("Our top 10 level leaders!")
          .setColor(0x00ae86);

        for (const data of rows) {
          //const user = client.users.cache.get(data.user);
          embed.addFields({
            name: data.name,
            value: `level: ${data.level}  exp:   ${data.exp}`,
          });
        }
        return interaction.editReply({ embeds: [embed] });
      });

    // MYSQL DB
    // conn
    //   .promise()
    //   .query(
    //     `SELECT * FROM ${interaction.guild.id}Levels ORDER BY exp DESC LIMIT 10;`
    //   )
    //   .then(([rows, fields]) => {
    //     // let user = client.getLevels.get(userid, interaction.guild.id);
    //     // Now shake it and show it! (as a nice embed, too!)
    //     const embed = new EmbedBuilder()
    //       .setTitle("Leaderboard")
    //       //.setAuthor(client.user.username, client.user.displayAvatarURL())
    //       .setDescription("Our top 10 level leaders!")
    //       .setColor(0x00ae86);

    //     for (const data of rows) {
    //       //const user = client.users.cache.get(data.user);
    //       //console.log(data.user, user)
    //       embed.addFields({
    //         name: data.name,
    //         value: `level: ${data.level}  exp:   ${data.exp}`,
    //       });
    //     }
    //     return interaction.editReply({ embeds: [embed] });
    //   });
  },
};
