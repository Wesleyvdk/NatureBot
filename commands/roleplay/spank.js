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
    .setName("spank")
    .setDescription("spanks another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to spank")
        .setRequired(true)
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "spank"`
      );
    //all url's of the gifs
    let gifs = [
      "https://media1.tenor.com/images/d0f32f61c2964999b344c6846b30e1d6/tenor.gif?itemid=13665166",
      "https://media.giphy.com/media/pRotk2UQTsozm/source.gif",
    ];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =
    let mentioned = interaction.options.getUser("target");

    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
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
    rUser.spanked++;
    rMentioned.gspanked++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} spanked others ${rUser.spanked} times and ${mentioned.username} got spanked ${rMentioned.gspanked} times`,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} spanks ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  },
};
