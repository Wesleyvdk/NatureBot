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
    .setName("dice")
    .setDescription("Rolls the dice")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("set the amount you want to bet")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("eyes")
        .setDescription("set the amount of eyes")
        .addChoices(
          { name: "1", value: "1" },
          { name: "2", value: "2" },
          { name: "3", value: "3" },
          { name: "4", value: "4" },
          { name: "5", value: "5" },
          { name: "6", value: "6" }
        )
        .setRequired(true)
    ),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "dice"`
      );
    const amount = interaction.options.getInteger("bet");
    const eyes = interaction.options.getInteger("eyes");
    playerid = interaction.user.id;
    playername = interaction.user.username;
    const dice = Math.floor(Math.random() * 6) + 1;
    if (rows[0].cash < amount) {
      let embed = new EmbedBuilder()
        .setTitle("Whoops!!")
        .setDescription(
          "you don't have enough cash. either Withdraw from the bank, or use less cash."
        );
      interaction.editReply({ embeds: embed });
    } else {
      conn
        .promise()
        .query(`SELECT * FROM ${interaction.guild.id}Currency WHERE id=?`, [
          playerid,
        ])
        .then(([rows, fields]) => {
          if ((eyes = dice)) {
            let embed = new EmbedBuilder()
              .setTitle("Congrats!!")
              .setDescription(
                `You chose ${eyes} and it was ${dice} \nYou've won. You just doubled your bet. Your total cash is now ${
                  amount * 2
                }`
              );
            amount = amount * 2;
            newCash = rows[0].cash + amount;
            conn
              .promise()
              .query(
                `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash} WHERE id=${userid}`
              );
            interaction.editReply({ embeds: embed });
          } else {
            let embed = new EmbedBuilder()
              .setTitle("Aww!!")
              .setDescription(
                `You chose ${eyes} and it was ${dice} \nYou've lost. You lost everything you've bet which leaves you with ${
                  rows[0].cash - amount
                }`
              );

            newCash = rows[0].cash - amount;
            conn
              .promise()
              .query(
                `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash} WHERE id=${userid}`
              );
            interaction.editReply({ embeds: embed });
          }
        });
    }
  },
};
