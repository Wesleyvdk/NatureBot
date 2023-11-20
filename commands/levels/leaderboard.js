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

    const top10 = ldb
      .prepare(
        "SELECT * FROM levels WHERE guild = ? ORDER BY experience DESC LIMIT 10;"
      )
      .all(interaction.guild.id);
    // let user = client.getLevels.get(userid, interaction.guild.id);
    // Now shake it and show it! (as a nice embed, too!)
    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      //.setAuthor(client.user.username, client.user.displayAvatarURL())
      .setDescription("Our top 10 level leaders!")
      .setColor(0x00ae86);

    for (const data of top10) {
      //const user = client.users.cache.get(data.user);
      //console.log(data.user, user)
      embed.addFields({
        name: data.userName,
        value: `level: ${data.level}  exp:   ${data.experience}`,
      });
    }
    return interaction.editReply({ embeds: [embed] });
  },
};
