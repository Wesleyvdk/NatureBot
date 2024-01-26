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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("shows the leaderboard"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "leaderboard"`
      );

    conn
      .promise()
      .query(
        `SELECT * FROM ${interaction.guild.id}Levels ORDER BY exp DESC LIMIT 10;`
      )
      .then(([rows, fields]) => {
        // let user = client.getLevels.get(userid, interaction.guild.id);
        // Now shake it and show it! (as a nice embed, too!)
        const embed = new EmbedBuilder()
          .setTitle("Leaderboard")
          //.setAuthor(client.user.username, client.user.displayAvatarURL())
          .setDescription("Our top 10 level leaders!")
          .setColor(0x00ae86);

        for (const data of rows) {
          //const user = client.users.cache.get(data.user);
          //console.log(data.user, user)
          embed.addFields({
            name: data.name,
            value: `level: ${data.level}  exp:   ${data.exp}`,
          });
        }
        return interaction.editReply({ embeds: [embed] });
      });
  },
};
