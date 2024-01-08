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
require("dotenv").config();
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("kiss another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to kiss")
        .setRequired(true)
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "kiss"`
      );

    let mentioned = interaction.options.getUser("target");
    const api_key = process.env.TENOR_KEY;
    const search_term = "anime_kiss";
    const limit = 1;
    const url = `https://tenor.googleapis.com/v2/search?q=${search_term}&key=${api_key}&limit=${limit}&random=true`;

    try {
      const response = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent": "PostmanRuntime/7.28.4",
        },
      });
      const data = response.data;
      if (!data.results || data.results.length === 0) {
        await interaction.editReply("Sorry but no gifs were found");
      }
      const gif = data.results[0].media_formats.gif.url;
      mentionedid = mentioned.id;
      userid = interaction.user.id;
      user = interaction.user;
      let rUser = client.getRoleplay.get(userid, interaction.guild.id);
      let rMentioned = client.getRoleplay.get(
        mentionedid,
        interaction.guild.id
      );
      if (!rUser) {
        rUser = {
          id: `${interaction.guild.id}-${mentionedid}`,
          user: mentionedid,
          guild: interaction.guild.id,
          kissed: 0,
          gkissed: 0,
          boop: 0,
          gboop: 0,
          hugged: 0,
          ghugged: 0,
          cried: 0,
          gcried: 0,
          holdhands: 0,
          gholdhands: 0,
          pet: 0,
          gpet: 0,
          slapped: 0,
          gslapped: 0,
          spanked: 0,
          gspanked: 0,
          partner: null,
          date: null,
        };
      }
      if (!rMentioned) {
        rMentioned = {
          id: `${interaction.guild.id}-${mentionedid}`,
          user: mentionedid,
          guild: interaction.guild.id,
          kissed: 0,
          gkissed: 0,
          boop: 0,
          gboop: 0,
          hugged: 0,
          ghugged: 0,
          cried: 0,
          gcried: 0,
          holdhands: 0,
          gholdhands: 0,
          pet: 0,
          gpet: 0,
          slapped: 0,
          gslapped: 0,
          spanked: 0,
          gspanked: 0,
          partner: null,
          date: null,
        };
      }
      rUser.kissed++;
      rMentioned.gkissed++;
      client.setRoleplay.run(rUser);
      client.setRoleplay.run(rMentioned);
      let embed = new EmbedBuilder();
      embed.setColor("#fc05cb");
      embed.setFooter({
        text: `${user.username} kissed others ${rUser.kissed} times and ${mentioned.username} got kissed ${rMentioned.gkissed} times `,
      });
      //embed.setTimestamp();
      embed.setTitle(`${user.username} kisses ${mentioned.username}`);
      embed.setImage(gif);
      interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      await interaction.editReply("an error occurred. try again later");
    }
  },
};