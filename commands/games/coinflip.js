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
const usageHandler = require("../../handlers/usageHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("list all the active matches")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("choose heads or tails")
        .addChoices(
          { name: "heads", value: "heads" },
          { name: "tails", value: "tails" }
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("set the amount you want to bet")
        .setRequired(true)
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    let amount = interaction.options.getInteger("bet");
    const option = interaction.options.getString("option");
    coinFlip = Math.floor(Math.random() * 10);
    playerid = interaction.user.id;
    console.log(interaction.guild.id);

    conn
      .promise()
      .query(
        `SELECT * FROM ${interaction.guild.id}Currency WHERE id=${playerid}`
      )
      .then(([rows, fields]) => {
        if (rows[0]) {
          if (rows[0].cash < amount) {
            let embed = new EmbedBuilder()
              .setTitle("Whoops!!")
              .setDescription(
                "you don't have enough cash. either Withdraw from the bank, or use less cash."
              );
            interaction.editReply({ embeds: [embed] });
          } else {
            if (coinFlip < 5 && option === "heads") {
              let embed = new EmbedBuilder()
                .setTitle("Congrats!!")
                .setDescription(
                  `You chose ${option} and it was ${coinFlip} \nYou've won. You just doubled your bet. Your total cash is now ${
                    amount * 2
                  }`
                );
              amount = amount * 2;
              newCash = rows[0].cash + amount;
              conn
                .promise()
                .query(
                  `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash} WHERE id=${playerid}`
                );
              interaction.editReply({ embeds: [embed] });
            }
            if (coinFlip > 5 && option === "tails") {
              let embed = new EmbedBuilder()
                .setTitle("Congrats!!")
                .setDescription(
                  `You chose ${option} and it was ${coinFlip} \nYou've won. You just doubled your bet. Your total cash is now ${
                    amount * 2
                  }`
                );
              amount = amount * 2;
              newCash = rows[0].cash + amount;
              conn
                .promise()
                .query(
                  `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash} WHERE id=${playerid}`
                );
              interaction.editReply({ embeds: [embed] });
            } else {
              let embed = new EmbedBuilder()
                .setTitle("Aww!!")
                .setDescription(
                  `You chose ${option} and it was ${coinFlip} \nYou've lost. You lost everything you've bet which leaves you with ${
                    rows[0].cash - amount
                  }`
                );

              newCash = rows[0].cash - amount;
              conn
                .promise()
                .query(
                  `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash} WHERE id=${playerid}`
                );
              interaction.editReply({ embeds: [embed] });
            }
          }
        } else {
          conn
            .promise()
            .query(
              `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (${playerid}, ${interaction.guild.id}, ${interaction.user.username}, 0, 500, 0)`
            );
          interaction.editReply(
            "Sorry you had no cash yet! I've added 500 to your account. Try again!"
          );
        }
      });
  },
};
