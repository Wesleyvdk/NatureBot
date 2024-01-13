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
    .setName("serverinfo")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    function checkBots(guild) {
      let botCount = 0;
      guild.members.cache.forEach((member) => {
        if (member.user.bot) botCount++;
      });
      return botCount;
    }

    function checkMembers(guild) {
      let memberCount = 0;
      guild.members.cache.forEach((member) => {
        if (!member.user.bot) memberCount++;
      });
      return memberCount;
    }

    function checkOnlineUsers(guild) {
      let onlineCount = 0;
      guild.members.cache.forEach((member) => {
        if (member.user.presence.status === "online") onlineCount++;
      });
      return onlineCount;
    }

    let sicon = message.guild.iconURL;
    let serverembed = new EmbedBuilder()
      .setAuthor(`${message.guild.name} - Informations`, message.guild.iconURL)
      .setColor("#15f153")
      .addFields({
        name: "Server owner",
        value: message.guild.fetchOwner,
        inline: true,
      })
      .addFields({
        name: "Server region",
        value: message.guild.region,
        inline: true,
      })
      .setThumbnail(sicon)
      .addFields({ name: "Server Name", value: message.guild.name })
      .addFields({
        name: "Verification level",
        value: message.guild.verificationLevel,
        inline: true,
      })
      .addFields({
        name: "Channel count",
        value: message.guild.channels.cache.size,
        inline: true,
      })
      .addFields({
        name: "Total member count",
        value: message.guild.memberCount,
      })
      .addFields({
        name: "Humans",
        value: checkMembers(message.guild),
        inline: true,
      })
      .addFields({
        name: "Bots",
        value: checkBots(message.guild),
        inline: true,
      })
      .addFields({ name: "Online", value: checkOnlineUsers(message.guild) })
      .setFooter({ text: "Guild created at:" })
      .setTimestamp(message.guild.createdAt);

    interaction.editReply({ embeds: [serverembed] });
  },
};
