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

import errorHandler from "../../handlers/errorHandler.js";

export default {
  data: new SlashCommandBuilder()
    .setName("adopt")
    .setDescription("adopt another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to adopt")
        .setRequired(true)
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();

    const mentioned = interaction.options.getUser("target");
    let mentionedid = mentioned.id;
    let userid = interaction.user.id;
    let user = interaction.user;
    let rUser = client.getFamily.get(userid);
    let rMentioned = client.getFamily.get(mentionedid);
    if (interaction.user.id == mentioned.id) {
      interaction.editReply({
        content: "you can't adopt yourself",
        ephemeral: true,
      });
    } else {
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
      if (rMentioned.parent1) {
        const embed = new EmbedBuilder().setDescription(
          `${mentioned.username} already has a parent`
        );
      }
      if (
        rUser.child1 &&
        rUser.child2 &&
        rUser.child3 &&
        rUser.child4 &&
        rUser.child5
      ) {
        const embed = new EmbedBuilder().setDescription(
          "You already have the max amount of children. disown a child to adopt a new one."
        );
        interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      const embed = new EmbedBuilder();
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("no")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger)
      );
      try {
        embed
          .setDescription(
            `${mentioned}, ${interaction.user.username} wants to adopt you`
          )
          .setTimestamp();
        await interaction.editReply({
          embeds: [embed],
          components: [button],
        });
        const filter = (i) => i.user.id === mentionedid;
        const intCollector =
          interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
          });
        intCollector.on("collect", async (i) => {
          if (i.customId === "yes") {
            rMentioned.parent1 = userid;
            rMentioned.parent1Name = user.username;
            if (rUser.partnerID) {
              rMentioned.parent2 = rUser.partnerID;
              rMentioned.parent2Name = rUser.partnerName;
            }
            if (!rUser.child1) {
              rUser.child1 = mentionedid;
              rUser.child1Name = mentioned.username;
            } else if (rUser.child1) {
              rUser.child2 = mentionedid;
              rUser.child2Name = mentioned.username;
            } else if (rUser.child2) {
              rUser.child3 = mentionedid;
              rUser.child3Name = mentioned.username;
            } else if (rUser.child3) {
              rUser.child4 = mentionedid;
              rUser.child4Name = mentioned.username;
            } else if (rUser.child4) {
              rUser.child5 = mentionedid;
              rUser.child5Name = mentioned.username;
            }
            client.setFamily.run(rUser);
            client.setFamily.run(rMentioned);
            const embed = new EmbedBuilder().setDescription(
              `I'm happy to introduce ${mentioned.username} into the family of ${user.username}`
            );
            i.reply({ embeds: [embed] });
          }
          if (i.customId === "no") {
            const embed = new EmbedBuilder().setDescription(
              `I'm sorry ${user.username}, they rejected`
            );
            i.reply({ embeds: [embed] });
          }
        });
        intCollector.on("end", (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
        });
      } catch (e) {
        errorHandler(interaction, e, null);
      }
    }
  },
};
