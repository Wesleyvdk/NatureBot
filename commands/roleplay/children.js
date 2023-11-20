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
    .setName("children")
    .setDescription("shows your children, or the children of another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("select user you want to know the children of")
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "children"`
      );
    const mentioned = interaction.options.getUser("target");
    if (mentioned) {
      mentionedid = mentioned.id;
      let rMentioned = client.getFamily.get(mentionedid);
      if (!rMentioned) {
        rMentioned = {
          id: `${mentionedid}`,
          user: mentioned.username,
          partnerID: null,
          partnerName: null,
          date: null,
          parent1: null,
          parent1Name: null,
          parent2: null,
          parent2Name: null,
          child1: null,
          child1Name: null,
          child2: null,
          child2Name: null,
          child3: null,
          child3Name: null,
          child4: null,
          child4Name: null,
          child5: null,
          child5Name: null,
        };
      }
      if (
        !rMentioned.child1 &&
        !rMentioned.child2 &&
        !rMentioned.child3 &&
        !rMentioned.child4 &&
        !rMentioned.child5
      ) {
        embed = new EmbedBuilder().setDescription(
          `${mentioned.username} doesn't have any children`
        );
        interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder().setDescription(
          `${mentioned.username}'s children are:\n ${rMentioned.child1Name}\n ${rMentioned.child2Name}\n ${rMentioned.child3Name}\n ${rMentioned.child4Name} \n ${rMentioned.child5Name}`
        );
        interaction.editReply({ embeds: [embed] });
      }
    } else {
      userid = interaction.user.id;
      user = interaction.user;
      let rUser = client.getFamily.get(userid);
      if (!rUser) {
        rUser = {
          id: `${userid}`,
          user: user.username,
          partnerID: null,
          partnerName: null,
          date: null,
          parent1: null,
          parent1Name: null,
          parent2: null,
          parent2Name: null,
          child1: null,
          child1Name: null,
          child2: null,
          child2Name: null,
          child3: null,
          child3Name: null,
          child4: null,
          child4Name: null,
          child5: null,
          child5Name: null,
        };
      }
      if (
        !rUser.child1 &&
        !rUser.child2 &&
        !rUser.child3 &&
        !rUser.child4 &&
        !rUser.child5
      ) {
        embed = new EmbedBuilder().setDescription(
          `you don't have any children`
        );
        interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder().setDescription(
          `${user.username}'s children are:\n ${rUser.child1Name}\n ${rUser.child2Name}\n ${rUser.child3Name}\n ${rUser.child4Name} \n ${rUser.child5Name}`
        );
        interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
