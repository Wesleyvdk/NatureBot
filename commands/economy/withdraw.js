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
    .setName("withdraw")
    .setDescription("deposits balance to the bank")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("specifies the amount to deposit")
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "withdraw"`
      );

    const amount = interaction.options.getInteger("amount");
    userid = interaction.user.id;
    user = interaction.user;
    username = user.username;
    let rUser = client.getCurrency.get(userid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        userName: username,
        bank: 0,
        cash: 0,
        bitcoin: 0,
      };
    }
    client.setCurrency.run(rUser);

    if (!amount) {
      oldBank = rUser.bank;
      oldCash = rUser.cash;
      newBank = 0;
      newCash = Number(oldBank) + Number(oldCash);
      rUser.cash = newCash;
      rUser.bank = newBank;
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `Your new balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
      );
      interaction.editReply({ embeds: [balEmbed] });
      client.setCurrency.run(rUser);
    } else if (amount > rUser.cash) {
      interaction.editReply(
        `you have insufficient cash, your cash is: ${rUser.cash}`
      );
    } else if (amount < rUser.cash) {
      let oldBank = rUser.bank;
      let oldCash = rUser.cash;
      await oldBank;
      await oldCash;
      withdraw(oldCash, oldBank, amount);
      rUser.bank = newBank;
      rUser.cash = newCash;
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `Your new balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
      );
      interaction.editReply({ embeds: [balEmbed] });
      client.setCurrency.run(rUser);
    }
    function withdraw(oldCash, oldBank, amount) {
      newCash = Number(`${oldCash}`) + Number(`${amount}`);
      newBank = oldBank - amount;
    }
  },
};
