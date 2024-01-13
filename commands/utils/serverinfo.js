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

    let sicon = interaction.guild.iconURL;
    let serverembed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.guild.name} - Informations`,
        iconURL: interaction.guild.iconURL,
      })
      .setColor("#15f153")
      .addFields({
        name: "Server owner",
        value: interaction.guild.fetchOwner,
        inline: true,
      })
      .addFields({
        name: "Server region",
        value: interaction.guild.region,
        inline: true,
      })
      .setThumbnail(sicon)
      .addFields({ name: "Server Name", value: interaction.guild.name })
      .addFields({
        name: "Verification level",
        value: interaction.guild.verificationLevel,
        inline: true,
      })
      .addFields({
        name: "Channel count",
        value: interaction.guild.channels.cache.size,
        inline: true,
      })
      .addFields({
        name: "Total member count",
        value: interaction.guild.memberCount,
      })
      .addFields({
        name: "Humans",
        value: checkMembers(interaction.guild),
        inline: true,
      })
      .addFields({
        name: "Bots",
        value: checkBots(interaction.guild),
        inline: true,
      })
      .addFields({ name: "Online", value: checkOnlineUsers(interaction.guild) })
      .setFooter({ text: "Guild created at:" })
      .setTimestamp(interaction.guild.createdAt);

    interaction.editReply({ embeds: [serverembed] });
  },
};
