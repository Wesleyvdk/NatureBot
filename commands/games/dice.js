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

export default {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Rolls the dice")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("set the amount you want to bet")
        .setRequired(true)
    )
    .addStringOption((option) =>
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
  async execute(client, interaction, conn, mongoclient) {
    await interaction.deferReply();
    let amount = interaction.options.getInteger("bet");
    const eyes = interaction.options.getString("eyes");
    let playerid = interaction.user.id;
    let playername = interaction.user.username;
    let newCash;
    const dice = Math.floor(Math.random() * 6) + 1;

    // MONGO DB
    const collection = mongoclient
      .db("Aylani")
      .collection(`${interaction.guild.id}Currency`); // replace "yourDatabase" with your database name

    collection.findOne({ id: playerid }).then((row) => {
      if (!row) {
        const newPlayer = {
          _id: playerid,
          user: interaction.guild.id,
          guild: interaction.user.username,
          userName: 0,
          bank: 500,
          cash: 0,
          bitcoin: 0,
        };
        collection.insertOne(newPlayer);
        interaction.editReply(
          "Sorry you had no cash yet! I've added 500 to your account. Try again!"
        );
      }
      if (row.cash < amount) {
        let embed = new EmbedBuilder()
          .setTitle("Whoops!!")
          .setDescription(
            "you don't have enough cash. either Withdraw from the bank, or use less cash."
          );
        interaction.editReply({ embeds: [embed] });
      } else {
        if (eyes == dice) {
          let embed = new EmbedBuilder()
            .setTitle("Congrats!!")
            .setDescription(
              `You chose ${eyes} and it was ${dice} \nYou've won. You just doubled your bet. Your total cash is now ${
                amount * 2
              }`
            );
          amount = amount * 2;
          newCash = row.cash + amount;
          collection.updateOne({ _id: playerid }, { $set: { cash: newCash } });
          interaction.editReply({ embeds: [embed] });
        } else {
          let embed = new EmbedBuilder()
            .setTitle("Aww!!")
            .setDescription(
              `You chose ${eyes} and it was ${dice} \nYou've lost. You lost everything you've bet which leaves you with ${
                row.cash - amount
              }`
            );
          newCash = row.cash - amount;
          collection.updateOne({ _id: playerid }, { $set: { cash: newCash } });
          interaction.editReply({ embeds: [embed] });
        }
      }
      // MYSQL DB
      // conn
      //   .promise()
      //   .query(
      //     `SELECT * FROM ${interaction.guild.id}Currency WHERE id=${playerid}`
      //   )
      //   .then(([rows, fields]) => {
      //     if (!rows[0]) {
      //       conn
      //         .promise()
      //         .query(
      //           `UPDATE ${interaction.guild.id}Currency SET cash = 500 WHERE id=${playerid}`
      //         );
      //       interaction.editReply(
      //         "Sorry you had no cash yet! I've added 500 to your account. Try again!"
      //       );
      //     }
      //     if (rows[0].cash < amount) {
      //       let embed = new EmbedBuilder()
      //         .setTitle("Whoops!!")
      //         .setDescription(
      //           "you don't have enough cash. either Withdraw from the bank, or use less cash."
      //         );
      //       interaction.editReply({ embeds: [embed] });
      //     } else {
      //       if (eyes == dice) {
      //         let embed = new EmbedBuilder()
      //           .setTitle("Congrats!!")
      //           .setDescription(
      //             `You chose ${eyes} and it was ${dice} \nYou've won. You just doubled your bet. Your total cash is now ${
      //               amount * 2
      //             }`
      //           );
      //         amount = amount * 2;
      //         newCash = rows[0].cash + amount;
      //         conn
      //           .promise()
      //           .query(
      //             `UPDATE ${interaction.guild.id}Currency SET cash = ${newCash} WHERE id=${playerid}`
      //           );
      //         interaction.editReply({ embeds: [embed] });
      //       } else {
      //         let embed = new EmbedBuilder()
      //           .setTitle("Aww!!")
      //           .setDescription(
      //             `You chose ${eyes} and it was ${dice} \nYou've lost. You lost everything you've bet which leaves you with ${
      //               rows[0].cash - amount
      //             }`
      //           );

      //         newCash = rows[0].cash - amount;
      //         conn
      //           .promise()
      //           .query(
      //             `INSERT IGNORE INTO ${interaction.guild.id}Currency(id, user, guild, userName, bank, cash, bitcoin) VALUES (${playerid}, ${interaction.guild.id}, ${interaction.user.username}, 0, 500, 0)`
      //           );
      //         interaction.editReply({ embeds: [embed] });
      //       }
      //     }
    });
  },
};
