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
    .setName("marry")
    .setDescription("marry another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("select user you want to marry")
        .setRequired(true)
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();

    let marrymsg = ["Do you wanna marry me?"];
    let marriedmsg = [
      "you're now pronounced husband and wife",
      "you're now married",
    ];
    let mentioned = interaction.options.getUser("target");
    let mentionedid = mentioned.id;
    let userid = interaction.user.id;
    let user = interaction.user;
    let rUser = client.getFamily.get(userid);
    let rMentioned = client.getFamily.get(mentionedid);
    let time = moment().format("MMMM Do YYYY, h:mm:ss a");
    if (interaction.user.id == mentioned.id) {
      interaction.editReply({
        content: "you can't marry yourself",
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
      const embed = new EmbedBuilder();
      const randomMarry = marrymsg[Math.floor(Math.random() * marrymsg.length)];
      const randomMarried =
        marriedmsg[Math.floor(Math.random() * marriedmsg.length)];
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
            `${mentioned}, ${interaction.user.username} wants to marry you`
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
            rMentioned.partnerID = userid;
            rMentioned.partnerName = user.username;
            rMentioned.date = time;
            rUser.partnerID = mentioned.id;
            rUser.partnerName = mentioned.username;
            rUser.date = time;
            console.log(time, rUser.date);
            client.setFamily.run(rUser);
            client.setFamily.run(rMentioned);
            marryEmbed = new EmbedBuilder().setDescription(
              `I'm happy to introduce ${mentioned.user} into the family of ${i.user}`
            );
            i.reply({ embeds: [marryEmbed] });
          }
          if (i.customId === "no") {
            const rejectEmbed = new EmbedBuilder().setDescription(
              `keep your head up, you're too good for them`
            );
            i.reply({ embeds: [rejectEmbed] });
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
