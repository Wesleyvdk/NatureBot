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
  ButtonComponent,
  PermissionFlagsBits,
} = require("discord.js");
const handleError = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wipeout")
    .setDescription(
      "removes all the members that have left the server from the levels or currency system."
    )
    .addStringOption((option) =>
      option
        .setName("system")
        .setDescription("select which system you want to remove users from")
        .addChoices(
          { name: "levels", value: "Levels" },
          { name: "currency", value: "Currency" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();
    const system = interaction.options.getString("system");

    try {
      conn
        .promise()
        .query(`SELECT * FROM ${interaction.guild.id}${system}`)
        .then(([rows, fields]) => {
          const members = interaction.guild.fetch();
          const guildUserIDs = members.map((member) => member.user.id);

          for (row in rows) {
            if (!guildUserIDs.includes(row.id)) {
              conn
                .promise()
                .query(
                  `DELETE FROM ${interaction.guild.id}${system} WHERE id=${row.id};`
                );
            }
          }
        });
    } catch (e) {
      handleError(interaction, e, null);
    }
  },
};
