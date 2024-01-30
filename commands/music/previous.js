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

const { useHistory } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous track"),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "template"`
      );
    const history = useHistory(interaction.guild.id);

    if (history.isEmpty())
      return interaction.editReply("The queue has no history track.");

    history.previous();

    return interaction.editReply("Backed the history track.");
  },
};
