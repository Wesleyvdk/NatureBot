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
        if (member.presence === "online") onlineCount++;
      });
      return onlineCount;
    }

    let sicon = interaction.guild.iconURL();

    let serverembed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.guild.name} - Informations`,
        iconURL: `${interaction.guild.iconURL()}`,
      })
      .setColor("#15f153")
      .addFields(
        {
          name: "Server owner",
          value: `${await interaction.guild.fetchOwner()}`,
          inline: true,
        },
        {
          name: "Server language",
          value: `${interaction.guild.preferredLocale}`,
          inline: true,
        }
      )

      .addFields({ name: "Server Name", value: interaction.guild.name })
      .addFields({
        name: "Verification level",
        value: `${interaction.guild.verificationLevel}`,
        inline: true,
      })
      .addFields({
        name: "Channel count",
        value: `${interaction.guild.channels.cache.size}`,
        inline: true,
      })
      .addFields({
        name: "Total member count",
        value: `${interaction.guild.memberCount}`,
      })
      .setThumbnail(sicon)
      .setFooter({ text: "Guild created at:" })
      .setTimestamp(interaction.guild.createdAt);

    interaction.editReply({ embeds: [serverembed] });
  },
};
