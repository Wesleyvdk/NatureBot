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
    .setName("remove")
    .setDescription("list all the active matches")
    .addNumberOption((option) =>
      option
        .setName("index")
        .setDescription(
          "select the index of which song to remove from the queue"
        )
        .setRequired(true)
    ),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "remove"`
      );
    if (queue.size < 1)
      return interaction.editReply("The queue has no more track.");

    const index = interaction.options.getNumber("index", true) - 1;

    if (index > queue.size || index < 0)
      return interaction.editReply("Provided track index does not exist.");

    queue.node.remove(index);

    return interaction.editReply(`Removed track ${index + 1}.`);
  },
};
