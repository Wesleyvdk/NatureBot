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
    .setName("userinfo")
    .setDescription("list all the active matches"),
  async execute(client, interaction) {
    await interaction.deferReply();
    let permissions = [];
    let acknowledgements = "None";

    const member = interaction.member;
    const randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });

    if (interaction.member.permissions.has("KICK_MEMBERS")) {
      permissions.push("Kick Members");
    }

    if (interaction.member.permissions.has("BAN_MEMBERS")) {
      permissions.push("Ban Members");
    }

    if (interaction.member.permissions.has("ADMINISTRATOR")) {
      permissions.push("Administrator");
    }

    if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
      permissions.push("Manage Messages");
    }

    if (interaction.member.permissions.has("MANAGE_CHANNELS")) {
      permissions.push("Manage Channels");
    }

    if (interaction.member.permissions.has("MENTION_EVERYONE")) {
      permissions.push("Mention Everyone");
    }

    if (interaction.member.permissions.has("MANAGE_NICKNAMES")) {
      permissions.push("Manage Nicknames");
    }

    if (interaction.member.permissions.has("MANAGE_ROLES")) {
      permissions.push("Manage Roles");
    }

    if (interaction.member.permissions.has("MANAGE_WEBHOOKS")) {
      permissions.push("Manage Webhooks");
    }

    if (interaction.member.permissions.has("MANAGE_EMOJIS")) {
      permissions.push("Manage Emojis");
    }

    if (permissions.length == 0) {
      permissions.push("No Key Permissions Found");
    }

    if (member.user.id == interaction.guild.ownerID) {
      acknowledgements = "Server Owner";
    }

    const embed = new EmbedBuilder()
      .setDescription(`<@${member.user.id}>`)
      .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL)
      .setColor(randomColor)
      .setFooter(`ID: ${interaction.author.id}`)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp()
      .addField(
        "Status",
        `${status[Discord.GuildMember.presence?.status]}`,
        true
      )
      .addField(
        "Joined at: ",
        `${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`,
        true
      )
      .addField(
        "Created at: ",
        `${moment(interaction.author.createdAt).format(
          "dddd, MMMM Do YYYY, HH:mm:ss"
        )}`,
        true
      )
      .addField("Permissions: ", `${permissions.join(", ")}`, true)
      .addField(
        `Roles [${
          member.roles.cache
            .filter((r) => r.id !== interaction.guild.id)
            .map((roles) => `\`${roles.name}\``).length
        }]`,
        `${
          member.roles.cache
            .filter((r) => r.id !== interaction.guild.id)
            .map((roles) => `<@&${roles.id}>`)
            .join(" **|** ") || "No Roles"
        }`,
        true
      )
      .addField("Acknowledgements: ", `${acknowledgements}`, true);

    interaction.editReply({ embeds: [embed] });
  },
};
