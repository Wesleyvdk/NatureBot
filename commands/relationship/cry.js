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
import { config } from "dotenv";
config();
import axios from "axios";
import errorHandler from "../../handlers/errorHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("cry")
    .setDescription("cry or cries at another user")
    .addUserOption((option) =>
      option.setName("target").setDescription("user you want to cry at")
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();

    const userid = interaction.user.id;
    const user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let mentioned = interaction.options.getUser("target");

    const api_key = process.env.TENOR_KEY;
    const search_term = "anime_cry";
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
      if (!mentioned) {
        if (!rUser) {
          rUser = {
            id: `${interaction.guild.id}-${userid}`,
            user: userid,
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
        rUser.cried++;
        client.setRoleplay.run(rUser);
        let embed1 = new EmbedBuilder()
          .setColor("#fc05cb")
          .setFooter({ text: `${user.username} cried ${rUser.cried} times` })
          //embed.setTimestamp();
          .setTitle(`${user.username} is crying`)
          .setImage(random);
        interaction.reply({ embeds: [embed1] });
      } else {
        const mentionedid = mentioned.id;
        let rMentioned = client.getRoleplay.get(
          mentionedid,
          interaction.guild.id
        );
        if (!rUser) {
          rUser = {
            id: `${interaction.guild.id}-${userid}`,
            user: userid,
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
        rUser.cried++;
        rMentioned.gcried++;
        client.setRoleplay.run(rUser);
        client.setRoleplay.run(rMentioned);
        let embed = new EmbedBuilder()
          .setColor("#fc05cb")
          .setFooter({
            text: `${user.username} cried at others ${rUser.cried} times and ${mentioned.username} got cried at ${rMentioned.gcried} times`,
          })
          //embed.setTimestamp();
          .setTitle(`${user.username} cries at ${mentioned.username}`)
          .setImage(gif);
        interaction.editReply({ embeds: [embed] });
      }
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
