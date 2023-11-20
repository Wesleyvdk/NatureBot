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
    .setName("balance")
    .setDescription("shows the current balance of the user")
    .addUserOption((option) =>
      option.setName("user").setDescription("select a user")
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "balance"`
      );

    const mentioned = interaction.options.getUser("user");
    userid = interaction.user.id;
    user = interaction.user;
    username = user.username;
    let rUser = client.getCurrency.get(userid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        userName: username,
        bank: 0,
        cash: 0,
        bitcoin: 0,
      };
    }
    client.setCurrency.run(rUser);
    // let mentioned = interaction.mentions.users.first();
    if (mentioned) {
      mentionedid = mentioned.id;
      let rMentioned = client.getCurrency.get(
        mentionedid,
        interaction.guild.id
      );
      if (!rMentioned) {
        rMentioned = {
          id: `${interaction.guild.id}-${mentionedid}`,
          user: mentionedid,
          guild: interaction.guild.id,
          userName: mentioned.username,
          bank: 0,
          cash: 0,
          bitcoin: 0,
        };
      }
      client.setCurrency.run(rMentioned);
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `${mentioned}'s current balance:\nbank: ${rMentioned.bank}\ncash: ${rMentioned.cash}\nbitcoin ${rMentioned.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    } else {
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `Your current balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    }
  },
};
