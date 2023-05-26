/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable space-before-function-paren */
/* eslint-disable space-before-blocks */
/* eslint-disable comma-dangle */
/* eslint-disable brace-style */
/* eslint-disable indent */
// Require the necessary discord.js classes
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  Events,
  // eslint-disable-next-line no-unused-vars
  MessageSelectMenu,
  // eslint-disable-next-line no-unused-vars
  Modal,
  // eslint-disable-next-line no-unused-vars
  TextInputComponent,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  AttachmentBuilder,
} = require("discord.js");
const { token, PREFIX, DO_API_TOKEN, DROPLET_ID } = require("./config.json");
const classes = require("./classes.json");
const db = require("better-sqlite3");
const moment = require("moment");
const { readFile } = require("fs/promises");
const { createCanvas, Image, GlobalFonts } = require("@napi-rs/canvas");
const { request } = require("undici");
const digitalocean = require("digitalocean");
const { runMain } = require("module");
const { off } = require("process");

// connectivities

const DOClient = digitalocean.client(DO_API_TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.GuildScheduledEvent,
  ],
});

// database tables

const ldb = new db("../databases/levels.sqlite");
const cdb = new db("../databases/currency.sqlite");
const fdb = new db("../databases/family.sqlite");
const rdb = new db("../databases/roleplay.sqlite");
const battleDB = new db("../databases/battlegame.sqlite");
const suggestionDB = new db("../databases/suggestion.sqlite");

// arrays
number = [
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
  69,
];
// databases

// variables
counter = 0;
dropMessage = false;
randomMoney = 0;
randNumber = number[Math.floor(Math.random() * number.length)];

lastAsked = "";

// When the client is ready, run this code (only once)
client.once("ready", async () => {
  const levelTable = ldb
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'levels';"
    )
    .get();
  const currencyTable = cdb
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'currency';"
    )
    .get();

  const familyTable = fdb
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'family';"
    )
    .get();
  const rpTable = rdb
    .prepare(
      "SELECT count() FROM sqlite_master where type='table' AND name = 'roleplay';"
    )
    .get();
  const bgPlayerTable = battleDB
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'player';"
    )
    .get();
  const bgLootTable = battleDB
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'loot';"
    )
    .get();
  const suggestionTable = suggestionDB
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'suggestion';"
    )
    .get();
  await createDatabases(
    levelTable,
    currencyTable,
    familyTable,
    rpTable,
    bgPlayerTable,
    bgLootTable,
    suggestionTable
  );
  await getDatabases();

  console.log(`logged in as: ${client.user.username}. ready to be used!`);
  console.log();
  const DO_API_TOKEN = require("./config.json");

  const channelId = "929363312527953950";
  const channel = await client.channels.fetch(channelId);
  // const embed = new EmbedBuilder()
  //   .setTitle("BOT UPDATES")
  //   .addFields(
  //     { name: "ADDED", value: "Boop", inline: true },
  //     { name: "ADDED", value: "Hug", inline: true },
  //     { name: "ADDED", value: "Kiss", inline: true },
  //     { name: "ADDED", value: "Slap", inline: true },
  //     { name: "ADDED", value: "Cry", inline: true },
  //     { name: "ADDED", value: "Handholding", inline: true },
  //     { name: "ADDED", value: "Pat", inline: true },
  //     { name: "ADDED", value: "Spank", inline: true },
  //     { name: "\u200B", value: "\u200B", inline: true },
  //     { name: "ADDED", value: "Adopt", inline: true },
  //     { name: "ADDED", value: "Disown", inline: true },
  //     { name: "ADDED", value: "Children", inline: true }
  //   )
  //   .setTimestamp();

  // channel.send({ embeds: [embed] });
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (message.channel.id === "929352993701253154") return;
    if (message.channel.id === "929352993701253154") return;
    if (message.channel.id === "929352994158419971") return;
    if (message.channel.id === "1085133582596591657") return;
    if (message.channel.id === "1085129112961691729") return;
    if (message.channel.id === "1007281491568492634") return;
    if (message.channel.id === "938036238101921844") return;
    currDrop(message);
  } catch (e) {
    console.log(e);
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  const channelId = "929352994460434433";
  const channel = await client.channels.fetch(channelId);
  if (reaction.channel != channel) return;
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  if (user.bot) {
    return;
  }
  if (!reaction.message.embeds[0]) return;
  suggestion = reaction.message.embeds[0].description;

  reactNum = reaction.count - 1;
  // Now the message has been cached and is fully available
  try {
    Sugg = client.getSuggestion.get(suggestion);

    if (reaction.emoji.name == "⬆️") {
      Sugg.upvotes = reactNum;
      client.setSuggestion.run(Sugg);
    }
    if (reaction.emoji.name == "⬇️") {
      Sugg.downvotes = reactNum;
      client.setSuggestion.run(Sugg);
    }
  } catch (e) {
    console.log(e);
  }
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  const channelId = "929352994460434433";
  const channel = await client.channels.fetch(channelId);
  if (reaction.channel != channel) return;
  if (reaction.partial) {
    // When a reaction is received, check if the structure is partial
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  if (user.bot) {
    return;
  }
  if (!reaction.message.embeds[0]) return;
  suggestion = reaction.message.embeds[0].description;
  reactNum = reaction.count - 1;
  // Now the message has been cached and is fully available

  try {
    Sugg = client.getSuggestion.get(suggestion);

    if (reaction.emoji.name == "⬆️") {
      Sugg.upvotes = reactNum;
      client.setSuggestion.run(Sugg);
    }
    if (reaction.emoji.name == "⬇️") {
      Sugg.downvotes = reactNum;
      client.setSuggestion.run(Sugg);
    }
  } catch (e) {
    console.log(e);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.deferReply();
    await interaction.editReply("Pong!");
  }
  if (commandName === "help") {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    try {
      embed.setDescription(`use the button below to go to the web page`);
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL("https://nature-bot-docs.vercel.app")
          .setLabel("Link")
          .setStyle(ButtonStyle.Link)
      );
      interaction.editReply({ embeds: [embed], components: [button] });
    } catch (e) {
      console.log(e);
    }
  }
  if (commandName === "suggestion") {
    if (interaction.options.getSubcommand() === "add") {
      await interaction.deferReply({ ephemeral: true });
      const suggestion = interaction.options.getString("suggestion");
      const category = interaction.options.getString("category");
      const userId = interaction.user.id;

      const embed = new EmbedBuilder()
        .setTitle(`Category: ${category}`)
        .setDescription(`${suggestion}`);
      const serverButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Support")
          .setURL("https://discord.gg/PPCgrHZK5P")
          .setStyle(ButtonStyle.Link)
      );
      const channelId = "929352994460434433";
      const channel = await client.channels.fetch(channelId);
      let time = moment().format("MMMM Do YYYY, h:mm:ss a");
      Suggest = client.getSuggestion.get(suggestion, category);
      if (!Suggest) {
        Suggest = {
          id: null,
          userid: `${userId}`,
          suggestion: `${suggestion}`,
          category: `${category}`,
          upvotes: 0,
          downvotes: 0,
          dateAdded: time,
        };
      }
      client.setSuggestion.run(Suggest);
      const message = await channel.send({ embeds: [embed] });
      await message.react("⬆️").then(() => message.react("⬇️"));

      interaction.editReply({
        content: "your suggestion has been submitted",
        components: [serverButton],
      });
    }
    if (interaction.options.getSubcommand() === "list") {
      await interaction.deferReply({});
      const ordered = interaction.options.getString("order");
      const category = interaction.options.getString("category");
      if (!category) {
        if (ordered === "default") {
          const suggestions = suggestionDB
            .prepare("SELECT * FROM suggestion;")
            .all();
          const embed = new EmbedBuilder().setTitle("list of all suggestions");
          for (const data of suggestions) {
            embed.addFields(
              { name: `id`, value: `${data.id}`, inline: true },
              { name: `suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `category`, value: `${data.category}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
        if (ordered === "user") {
          const suggestions = suggestionDB
            .prepare("SELECT * FROM suggestion ORDER BY userid;")
            .all();
          const embed = new EmbedBuilder()
            .setTitle("list of all suggestions")
            .setFooter({ text: `ordered by user` });
          for (const data of suggestions) {
            user = data.userid;
            embed.addFields(
              { name: `user`, value: `${user}`, inline: true },
              { name: `suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `category`, value: `${data.category}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
        if (ordered === "dateadded") {
          const suggestions = suggestionDB
            .prepare("SELECT * FROM suggestion ORDER BY dateAdded;")
            .all();
          const embed = new EmbedBuilder()
            .setTitle("list of all suggestions")
            .setFooter({ text: `ordered by date` });
          for (const data of suggestions) {
            user = data.userid;
            embed.addFields(
              { name: `Suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `Category`, value: `${data.category}`, inline: true },
              { name: `Date Added`, value: `${data.dateAdded}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
        if (ordered === "category") {
          const suggestions = suggestionDB
            .prepare("SELECT * FROM suggestion ORDER BY category;")
            .all();
          const embed = new EmbedBuilder()
            .setTitle("list of all suggestions")
            .setFooter({ text: `ordered by category` });
          for (const data of suggestions) {
            user = data.userid;
            embed.addFields(
              { name: `id`, value: `${data.id}`, inline: true },
              { name: `Suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `Category`, value: `${data.category}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
      }
      if (category) {
        if (ordered === "default") {
          const suggestions = suggestionDB
            .prepare("SELECT * FROM suggestion WHERE category = ?;")
            .all(category);
          const embed = new EmbedBuilder().setTitle("list of all suggestions");
          for (const data of suggestions) {
            embed.addFields(
              { name: `id`, value: `${data.id}`, inline: true },
              { name: `suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `category`, value: `${data.category}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
        if (ordered === "user") {
          const suggestions = suggestionDB
            .prepare(
              "SELECT * FROM suggestion WHERE category = ? ORDER BY userid;"
            )
            .all(category);
          const embed = new EmbedBuilder()
            .setTitle("list of all suggestions")
            .setFooter({ text: `ordered by user` });
          for (const data of suggestions) {
            user = data.userid;
            embed.addFields(
              { name: `user`, value: `${user}`, inline: true },
              { name: `suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `category`, value: `${data.category}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
        // if (ordered === "dateadded") {
        //   const suggestions = suggestionDB
        //     .prepare(
        //       "SELECT * FROM suggestion WHERE category = ? ORDER BY dateAdded;"
        //     )
        //     .all(category);
        //   const embed = new EmbedBuilder()
        //     .setTitle("list of all suggestions")
        //     .setFooter({ text: `ordered by date` });
        //   for (const data of suggestions) {
        //     user = data.userid;
        //     embed.addFields(
        //       { name: `Suggestion`, value: `${data.suggestion}`, inline: true },
        //       { name: `Category`, value: `${data.category}`, inline: true },
        //       { name: `Date Added`, value: `${data.dateAdded}`, inline: true }
        //     );
        //   }
        //   await interaction.editReply({ embeds: [embed] });
        // }
        if (ordered === "category") {
          const suggestions = suggestionDB
            .prepare(
              "SELECT * FROM suggestion WHERE category = ? ORDER BY category;"
            )
            .all(category);
          const embed = new EmbedBuilder()
            .setTitle("list of all suggestions")
            .setFooter({ text: `ordered by category` });
          for (const data of suggestions) {
            user = data.userid;
            embed.addFields(
              { name: `id`, value: `${data.id}`, inline: true },
              { name: `Suggestion`, value: `${data.suggestion}`, inline: true },
              { name: `Category`, value: `${data.category}`, inline: true }
            );
          }
          await interaction.editReply({ embeds: [embed] });
        }
      }
    }
  }
  if (commandName === "starttruthordare") {
    await interaction.deferReply();
    const usersIngame = [];

    const embed = new EmbedBuilder();
    try {
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("join")
          .setLabel("Join")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("leave")
          .setLabel("Leave")
          .setStyle(ButtonStyle.Danger)
      );
      embed
        .setDescription(
          `${interaction.user.username} wants to play truth or dare`
        )
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
        components: [button],
      });
      try {
        const intCollector =
          interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
          });
        intCollector.on("collect", async (i) => {
          const roleName = "truth or dare";
          const role = i.guild.roles.cache.find(
            (role) => role.name === roleName
          );
          const channelId = "1087005900352540702";
          const channel = await client.channels.fetch(channelId);
          if (i.customId === "join") {
            if (!usersIngame.includes(i.user.id)) {
              usersIngame.push(i.user.id);
              i.member.roles.add(role);
              i.reply({
                content: `${i.user} has joined the game. to play, go to <#${channel.id}>`,
                components: [],
              });
            } else {
              i.reply({
                content: `${i.user} you're already in the game, to play, go to <#${channel.id}>`,
                ephemeral: true,
              });
            }
          }
          if (i.customId === "leave") {
            if (!usersIngame.includes(i.user.id)) {
              i.reply({
                content: `${i.user} you're not in the game`,
              });
            } else {
              usersIngame.pop(i.user.id);
              i.member.roles.remove(role);
              i.reply({
                content: `${i.user} has left the game`,
                components: [],
              });
            }
          }
        });
        intCollector.on("end", (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
  if (commandName === "tdquestion") {
    await interaction.deferReply();
    // interaction options
    const question = interaction.options.getString("question");
    const asked = interaction.options.getUser("user");

    // embed
    const embed = new EmbedBuilder();

    // T/D Channel ID
    const channelId = "1087005900352540702";
    const channel = await client.channels.fetch(channelId);

    // TD Role
    const member = interaction.member;
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === "truth or dare"
    );

    if (!member.roles.cache.has(role.id)) {
      embed.setDescription(
        "you are not participating in the game. Join the game using the join button, or if no game is ongoing use /starttruthordare to start one"
      );
      interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } else if (interaction.channel.id != channel.id) {
      embed.setDescription(
        `you can't use this command in this channel. please use it in <#${channel.id}>`
      );
      interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } else if (lastAsked === "") {
      lastAsked = asked.id;
      embed.setDescription(question);
      embed.setTitle(
        `${interaction.user.username} asks ${asked.username} a question`
      );
      interaction.editReply({
        embeds: [embed],
      });
    } else if (lastAsked === interaction.user.id) {
      lastAsked = asked.id;
      embed.setDescription(question);
      embed.setTitle(
        `${interaction.user.username} asks ${asked.username} a question`
      );
      interaction.editReply({
        embeds: [embed],
      });
    } else {
      interaction.editReply({
        content: "this command is not available rn, wait for your turn",
        ephemeral: true,
      });
    }
  }
  if (commandName === "level") {
    await interaction.deferReply();
    userid = interaction.user.id;
    user = interaction.user;
    username = user.username;
    let rUser = client.getLevels.get(userid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        userName: username,
        level: 0,
        experience: 0,
      };
    }
    xp = rUser.experience;
    lvl_start = rUser.level;
    lvl_end = 5 * lvl_start ** 2 + 50 * lvl_start + 100 - xp;
    const embed = new EmbedBuilder();
    embed
      .setDescription(`your current level is ${lvl_start}`)
      .setFooter({ text: `current xp: ${xp} || xp till next: ${lvl_end}` }),
      interaction.editReply({
        embeds: [embed],
      });
  }
  if (commandName === "leaderboard") {
    await interaction.deferReply();
    const top10 = ldb
      .prepare(
        "SELECT * FROM levels WHERE guild = ? ORDER BY experience DESC LIMIT 10;"
      )
      .all(interaction.guild.id);
    // let user = client.getLevels.get(userid, interaction.guild.id);
    // Now shake it and show it! (as a nice embed, too!)
    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      //.setAuthor(client.user.username, client.user.displayAvatarURL())
      .setDescription("Our top 10 level leaders!")
      .setColor(0x00ae86);

    for (const data of top10) {
      //const user = client.users.cache.get(data.user);
      //console.log(data.user, user)
      embed.addFields({
        name: data.userName,
        value: `level: ${data.level}  exp:   ${data.experience}`,
      });
    }
    return interaction.editReply({ embeds: [embed] });
  }
  // -------------------- ECONOMY --------------------------------
  if (commandName === "balance") {
    await interaction.deferReply();
    const mentioned = interaction.options.getUser("user");
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
    // let mentioned = interaction.mentions.users.first();
    if (mentioned) {
      mentionedid = mentioned.id;
      let rMentioned = client.getCurrency.get(
        mentionedid,
        interaction.guild.id
      );
      if (!rMentioned) {
        rMentioned = {
          id: `${interaction.guild.id}-${mentionedid}`,
          user: mentionedid,
          guild: interaction.guild.id,
          userName: mentioned.username,
          bank: 0,
          cash: 0,
          bitcoin: 0,
        };
      }
      client.setCurrency.run(rMentioned);
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `${mentioned}'s current balance:\nbank: ${rMentioned.bank}\ncash: ${rMentioned.cash}\nbitcoin ${rMentioned.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    } else {
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `Your current balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
      );
      await interaction.editReply({ embeds: [balEmbed] });
    }
  }
  if (commandName === "deposit") {
    await interaction.deferReply();
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
      oldCash = rUser.cash;
      oldBank = rUser.bank;
      newBank = Number(oldCash) + Number(oldBank);
      newCash = 0;
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
      let oldCash = rUser.cash;
      let oldBank = rUser.bank;
      await oldBank;
      await oldCash;
      deposit(oldCash, oldBank, amount);
      rUser.bank = newBank;
      rUser.cash = newCash;
      const balEmbed = new EmbedBuilder();
      balEmbed.setDescription(
        `Your new balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
      );
      interaction.editReply({ embeds: [balEmbed] });
      client.setCurrency.run(rUser);
    }
  }
  if (commandName === "withdraw") {
    await interaction.deferReply();
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
  }
  if (commandName === "give") {
    await interaction.deferReply();
    const target = interaction.options.getUser("user");
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

    targetid = target.id;
    let targetinfo = `<@!${targetid}>`;
    let rTarget = client.getCurrency.get(targetid, interaction.guild.id);
    if (!rTarget) {
      rTarget = {
        id: `${interaction.guild.id}-${targetid}`,
        user: targetid,
        guild: interaction.guild.id,
        userName: target.username,
        bank: 0,
        cash: 0,
        bitcoin: 0,
      };
    }
    client.setCurrency.run(rTarget);
    if (amount > rUser.cash) {
      interaction.editReply({
        content: `you have insuficient cash! your current cash is: ${rUser.cash}`,
        ephemeral: true,
      });
    } else {
      let oldCashuser = rUser.cash;
      let oldCashTarget = rTarget.cash;
      newCashTarget = Number(`${oldCashTarget}`) + Number(`${amount}`);
      newCashuser = oldCashuser - amount;
      rUser.cash = newCashuser;
      rTarget.cash = newCashTarget;
      const giveEmbed = new EmbedBuilder()
        .setDescription(`${user} gave ${amount} to ${target}`)
        .setTimestamp();
      interaction.editReply({ embeds: [giveEmbed] });
      client.setCurrency.run(rUser);
      client.setCurrency.run(rTarget);
    }
  }
  if (commandName === "shop") {
    await interaction.deferReply();
    const shopembed = new EmbedBuilder()
      .setDescription("The shop is empty right now")
      .setFooter({ text: "leave some shop suggestions behind" });
    interaction.editReply({ embeds: [shopembed] });
  }

  // -------------------- ROLEPLAY --------------------------------
  if (commandName === "marry") {
    await interaction.deferReply();
    let marrymsg = ["Do you wanna marry me?"];
    let marriedmsg = [
      "you're now pronounced husband and wife",
      "you're now married",
    ];
    let mentioned = interaction.options.getUser("target");
    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
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
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (commandName === "divorce") {
    await interaction.deferReply();
    let breakupmsg = [
      "Let's break up.",
      "I don't think this is working out.",
      "Roses are red. Violets are blue. I used to love you but not anymore.",
    ];
    let noone = [
      `you can't divorce no one`,
      `maybe try finding a partner first`,
      `a relationship doesn't come to you like magic`,
    ];
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getFamily.get(userid);
    mentionedid = rUser.partnerID;
    let rMentioned = client.getFamily.get(mentionedid);

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
    if (!rUser.partnerID) {
      const randomnoone = noone[Math.floor(Math.random() * noone.length)];
      interaction.editReply(randomnoone);
    } else {
      udivorceid = rUser.partnerID;
      udivorcename = rUser.partnerName;
      const randomBreak =
        breakupmsg[Math.floor(Math.random() * breakupmsg.length)];
      breakupEmbed = new EmbedBuilder()
        .setDescription(rUser.partnerName + ", " + randomBreak)
        .setTimestamp();

      interaction.editReply({ embeds: [breakupEmbed] });
      //message.channel.send(udivorcename.username + ', ' + randomBreak)
      rMentioned.partnerID = null;
      rMentioned.partnerName = null;
      rUser.partnerID = null;
      rUser.partnerName = null;
      rUser.date = null;
      rMentioned.date = null;
      client.setFamily.run(rUser);
      client.setFamily.run(rMentioned);
    }
  }
  if (commandName === "partner") {
    await interaction.deferReply();
    const mentioned = interaction.options.getUser("target");
    //mentionedid = mentioned.id
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getFamily.get(userid);
    uPartnerid = rUser.partnerID;
    uPartnername = rUser.partnerName;
    if (!mentioned) {
      if (!rUser.partnerID) {
        let partnerembed = new EmbedBuilder();
        partnerembed.setDescription("you don't have a partner");
        interaction.reply({ embeds: [partnerembed] });
      } else {
        date = rUser.date.split(",");
        difference = getDaysBetween(date);
        let Partnerembed = new EmbedBuilder()
          .setColor("#fc05cb")
          .setFooter({ text: `married since ${date[0]}` })
          .setDescription(
            `your partner is ${uPartnername} and you've been married for ${difference} days`
          );
        interaction.editReply({ embeds: [Partnerembed] });
      }
    } else if (mentioned) {
      mentionedid = mentioned.id;
      let rMentioned = client.getFamily.get(mentionedid);
      mPartnerid = rMentioned.partnerID;
      mPartnername = rMentioned.partnerName;
      if (!rMentioned.partnerID) {
        let partnerembed = new EmbedBuilder().setDescription(
          `${mentioned} doesn't have a partner`
        );
        interaction.editReply({ embeds: [partnerembed] });
      } else {
        date = rMentioned.date.split(",");
        //date = date.split(",");
        difference = getDaysBetween(date);
        let Partnerembed = new EmbedBuilder()
          .setFooter({ text: `married since ${date[0]}` })
          .setDescription(
            `${mentioned.username} their partner is ${mPartnername} and they've been married for ${difference} days`
          );
        interaction.editReply({ embeds: [Partnerembed] });
      }
    }
  }
  if (commandName === "adopt") {
    await interaction.deferReply();
    const mentioned = interaction.options.getUser("target");
    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
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
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (commandName === "disown") {
    await interaction.deferReply();
    const mentioned = interaction.options.getUser("target");
    const mentionedId = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getFamily.get(userid);
    let rMentioned = client.getFamily.get(mentionedid);
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
    const children = [
      rUser.child1,
      rUser.child2,
      rUser.child3,
      rUser.child4,
      rUser.child5,
    ];
    if (children.includes(mentionedId)) {
      let index = children.indexOf(mentionedId);
      const embed = new EmbedBuilder().setDescription(
        `I'm sad to say that ${mentioned.username} is not your child anymore.`
      );
      interaction.editReply({ embeds: [embed] });
      if (rUser.child1 === mentionedId) {
        rUser.child1 = null;
        rUser.child1Name = null;
        rMentioned.parent1 = null;
        rMentioned.parent1Name = null;
        rMentioned.parent2 = null;
        rMentioned.parent2Name = null;
      } else if (rUser.child2 === mentionedId) {
        rUser.child2 = null;
        rUser.child2Name = null;
        rMentioned.parent1 = null;
        rMentioned.parent1Name = null;
        rMentioned.parent2 = null;
        rMentioned.parent2Name = null;
      } else if (rUser.child3 === mentionedId) {
        rUser.child3 = null;
        rUser.child3Name = null;
        rMentioned.parent1 = null;
        rMentioned.parent1Name = null;
        rMentioned.parent2 = null;
        rMentioned.parent2Name = null;
      } else if (rUser.child4 === mentionedId) {
        rUser.child4 = null;
        rUser.child4Name = null;
        rMentioned.parent1 = null;
        rMentioned.parent1Name = null;
        rMentioned.parent2 = null;
        rMentioned.parent2Name = null;
      } else if (rUser.child5 === mentionedId) {
        rUser.child5 = null;
        rUser.child5Name = null;
        rMentioned.parent1 = null;
        rMentioned.parent1Name = null;
        rMentioned.parent2 = null;
        rMentioned.parent2Name = null;
      }
      client.setFamily.run(rUser);
      client.setFamily.run(rMentioned);
    } else {
      const embed = new EmbedBuilder().setDescription(
        `${mentioned.username} is not your child`
      );
      interaction.editReply({ embeds: [embed] });
    }
  }
  if (commandName === "children") {
    await interaction.deferReply();
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
  }
  if (commandName === "boop") {
    await interaction.deferReply();
    const mentioned = interaction.options.getUser("target");
    //all url's of the gifs
    let gifs = [
      "https://media1.tenor.com/images/cbf38a2e97a348a621207c967a77628a/tenor.gif?itemid=6287077",
    ];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =

    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }

    rUser.boop++;
    rMentioned.gboop++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} booped others ${rUser.boop} times and ${mentioned.username} got booped ${rMentioned.gboop} times `,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} boops ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  }
  if (commandName === "hug") {
    await interaction.deferReply();
    const mentioned = interaction.options.getUser("target");
    //all url's of the gifs
    let gifs = [
      "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
      "https://media1.tenor.com/images/78d3f21a608a4ff0c8a09ec12ffe763d/tenor.gif?itemid=16509980",
      "https://media.tenor.com/images/ca682cecd6bff521e400f984502f370c/tenor.gif",
      "https://media.tenor.com/images/1ca37ea5d3ec66ea08893d8679c04ae1/tenor.gif",
      "https://media1.tenor.com/images/1d94b18b89f600cbb420cce85558b493/tenor.gif?itemid=15942846",
      "https://media1.tenor.com/images/daffa3b7992a08767168614178cce7d6/tenor.gif?itemid=15249774",
      "https://media1.tenor.com/images/6db54c4d6dad5f1f2863d878cfb2d8df/tenor.gif?itemid=7324587",
      "https://media1.tenor.com/images/c2156769899d169306d16b063a55d0b2/tenor.gif?itemid=14584871",
      "https://media1.tenor.com/images/cc805107341e281102a2280f08b582e0/tenor.gif?itemid=13925386",
      "https://media.tenor.com/images/6deb677d1a080655e2c916452e4b6ba5/tenor.gif",
      "https://media1.tenor.com/images/b7487d45af7950bfb3f7027c93aa49b1/tenor.gif?itemid=9882931",
      "https://media1.tenor.com/images/d19bfd9ba90422611ec3c2d835363ffc/tenor.gif?itemid=18374323",
    ];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =
    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    rUser.hugged++;
    rMentioned.ghugged++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder()
      .setColor("#fc05cb")
      .setFooter({
        text: ` ${user.username} hugged others ${rUser.hugged} times and ${mentioned.username} got hugged ${rMentioned.ghugged} times`,
      })
      //embed.setTimestamp();
      .setTitle(`${user.username} hugs ${mentioned.username}`)
      .setImage(random);
    interaction.editReply({ embeds: [embed] });
  }
  if (commandName === "kiss") {
    await interaction.deferReply();
    let gifs = [
      "https://media1.tenor.com/images/d307db89f181813e0d05937b5feb4254/tenor.gif?itemid=16371489",
      "https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865",
      "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif",
      "https://media1.tenor.com/images/bc5e143ab33084961904240f431ca0b1/tenor.gif?itemid=9838409",
      "https://media1.tenor.com/images/b8d0152fbe9ecc061f9ad7ff74533396/tenor.gif?itemid=5372258",
      "https://media1.tenor.com/images/7fd98defeb5fd901afe6ace0dffce96e/tenor.gif?itemid=9670722",
      "https://media.tenor.com/images/9fb52dbfd3b7695ae50dfd00f5d241f7/tenor.gif",
      "https://media1.tenor.com/images/9fac3eab2f619789b88fdf9aa5ca7b8f/tenor.gif?itemid=12925177",
      "https://media1.tenor.com/images/632a3db90c6ecd87f1242605f92120c7/tenor.gif?itemid=5608449",
      "https://media1.tenor.com/images/61dba0b61a2647a0663b7bde896c966c/tenor.gif?itemid=5262571",
      "https://media1.tenor.com/images/37633f0b8d39daf70a50f69293e303fc/tenor.gif?itemid=13344412",
    ];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message
    let mentioned = interaction.options.getUser("target");
    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    rUser.kissed++;
    rMentioned.gkissed++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} kissed others ${rUser.kissed} times and ${mentioned.username} got kissed ${rMentioned.gkissed} times `,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} kisses ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  }
  if (commandName === "slap") {
    await interaction.deferReply();
    let gifs = ["https://media.giphy.com/media/Gf3AUz3eBNbTW/source.gif"];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =
    let mentioned = interaction.options.getUser("target");
    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    rUser.slapped++;
    rMentioned.gslapped++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} slapped others ${rUser.slapped} times and ${mentioned.username} got slapped ${rMentioned.gslapped} times `,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} slaps ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  }
  if (commandName === "cry") {
    await interaction.deferReply();
    //all url's of the gifs
    let gifs = ["https://media.giphy.com/media/ROF8OQvDmxytW/source.gif"];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =

    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let mentioned = interaction.options.getUser("target");
    if (!mentioned) {
      if (!rUser) {
        rUser = {
          id: `${interaction.guild.id}-${userid}`,
          user: userid,
          guild: interaction.guild.id,
          kissed: 0,
          gkissed: 0,
          boop: 0,
          gboop: 0,
          hugged: 0,
          ghugged: 0,
          cried: 0,
          gcried: 0,
          holdhands: 0,
          gholdhands: 0,
          pet: 0,
          gpet: 0,
          slapped: 0,
          gslapped: 0,
          spanked: 0,
          gspanked: 0,
          partner: null,
          date: null,
        };
      }
      rUser.cried++;
      client.setRoleplay.run(rUser);
      let embed1 = new EmbedBuilder()
        .setColor("#fc05cb")
        .setFooter({ text: `${user.username} cried ${rUser.cried} times` })
        //embed.setTimestamp();
        .setTitle(`${user.username} is crying`)
        .setImage(random);
      interaction.reply({ embeds: [embed1] });
    } else {
      mentionedid = mentioned.id;
      let rMentioned = client.getRoleplay.get(
        mentionedid,
        interaction.guild.id
      );
      if (!rUser) {
        rUser = {
          id: `${interaction.guild.id}-${userid}`,
          user: userid,
          guild: interaction.guild.id,
          kissed: 0,
          gkissed: 0,
          boop: 0,
          gboop: 0,
          hugged: 0,
          ghugged: 0,
          cried: 0,
          gcried: 0,
          holdhands: 0,
          gholdhands: 0,
          pet: 0,
          gpet: 0,
          slapped: 0,
          gslapped: 0,
          spanked: 0,
          gspanked: 0,
          partner: null,
          date: null,
        };
      }
      if (!rMentioned) {
        rMentioned = {
          id: `${interaction.guild.id}-${mentionedid}`,
          user: mentionedid,
          guild: interaction.guild.id,
          kissed: 0,
          gkissed: 0,
          boop: 0,
          gboop: 0,
          hugged: 0,
          ghugged: 0,
          cried: 0,
          gcried: 0,
          holdhands: 0,
          gholdhands: 0,
          pet: 0,
          gpet: 0,
          slapped: 0,
          gslapped: 0,
          spanked: 0,
          gspanked: 0,
          partner: null,
          date: null,
        };
      }
      rUser.cried++;
      rMentioned.gcried++;
      client.setRoleplay.run(rUser);
      client.setRoleplay.run(rMentioned);
      let embed = new EmbedBuilder()
        .setColor("#fc05cb")
        .setFooter({
          text: `${user.username} cried at others ${rUser.cried} times and ${mentioned.username} got cried at ${rMentioned.gcried} times`,
        })
        //embed.setTimestamp();
        .setTitle(`${user.username} cries at ${mentioned.username}`)
        .setImage(random);
      interaction.editReply({ embeds: [embed] });
    }
  }
  if (commandName === "handholding") {
    await interaction.deferReply();
    //all url's of the gifs
    let gifs = ["https://media.giphy.com/media/TnUJHKyjwHXOM/source.gif"];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =
    let mentioned = interaction.options.getUser("target");

    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }

    rUser.holdhands++;
    rMentioned.gholdhands++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} held hands with others ${rUser.holdhands} times and ${mentioned.username}'s hands got held ${rMentioned.gholdhands} times`,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} holds hands with ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  }
  if (commandName === "pat") {
    await interaction.deferReply();
    //all url's of the gifs
    let gifs = ["https://media.giphy.com/media/109ltuoSQT212w/source.gif"];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =
    let mentioned = interaction.options.getUser("target");

    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    rUser.pet++;
    rMentioned.gpet++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} pat others ${rUser.pet} times and ${mentioned.username} got pat ${rMentioned.gpet} times`,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} pats ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  }
  if (commandName === "spank") {
    await interaction.deferReply();
    //all url's of the gifs
    let gifs = [
      "https://media1.tenor.com/images/d0f32f61c2964999b344c6846b30e1d6/tenor.gif?itemid=13665166",
      "https://media.giphy.com/media/pRotk2UQTsozm/source.gif",
    ];
    //will calculate which one to send
    const random = gifs[Math.floor(Math.random() * gifs.length)];
    //sends the random message =
    let mentioned = interaction.options.getUser("target");

    mentionedid = mentioned.id;
    userid = interaction.user.id;
    user = interaction.user;
    let rUser = client.getRoleplay.get(userid, interaction.guild.id);
    let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
    if (!rUser) {
      rUser = {
        id: `${interaction.guild.id}-${userid}`,
        user: userid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    if (!rMentioned) {
      rMentioned = {
        id: `${interaction.guild.id}-${mentionedid}`,
        user: mentionedid,
        guild: interaction.guild.id,
        kissed: 0,
        gkissed: 0,
        boop: 0,
        gboop: 0,
        hugged: 0,
        ghugged: 0,
        cried: 0,
        gcried: 0,
        holdhands: 0,
        gholdhands: 0,
        pet: 0,
        gpet: 0,
        slapped: 0,
        gslapped: 0,
        spanked: 0,
        gspanked: 0,
        partner: null,
        date: null,
      };
    }
    rUser.spanked++;
    rMentioned.gspanked++;
    client.setRoleplay.run(rUser);
    client.setRoleplay.run(rMentioned);
    let embed = new EmbedBuilder();
    embed.setColor("#fc05cb");
    embed.setFooter({
      text: `${user.username} spanked others ${rUser.spanked} times and ${mentioned.username} got spanked ${rMentioned.gspanked} times`,
    });
    //embed.setTimestamp();
    embed.setTitle(`${user.username} spanks ${mentioned.username}`);
    embed.setImage(random);
    interaction.editReply({ embeds: [embed] });
  }

  // -------------------------------- BATTLE GAME --------------------------------

  if (commandName === "start") {
    await interaction.deferReply();
    user = interaction.user;
    let rUser = client.getBattlePlayer.get(user.id);
    if (rUser) {
      interaction.reply({
        content: `you already have an active character`,
        ephemeral: true,
      });
    }
    used = false;
    try {
      const embed = new EmbedBuilder()
        .setTitle("start your own journey")
        //.setFooter({ text: `${interaction.user.username}` })
        .setTimestamp();
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("choose")
          .setLabel("choose class")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setLabel("class info")
          .setURL(
            "https://nature-bot-docs.vercel.app/naturebot/battlegame/classes"
          )
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("cancel")
          .setStyle(ButtonStyle.Danger)
      );
      await interaction.editReply({
        embeds: [embed],
        components: [button],
      });
      try {
        const Collector = interaction.channel.createMessageComponentCollector({
          componentType: ComponentType.Button,
        });
        Collector.on("collect", async (i) => {
          if (i.customId === "choose") {
            startEmbed = new EmbedBuilder()
              .setDescription("Choose a class")
              .setFooter({
                text: "If you don't know which class to choose, or want more info on classes, check out the docs",
              });

            const select = new StringSelectMenuBuilder()
              .setCustomId("class")
              .setPlaceholder("Make a selection!")
              .addOptions(
                new StringSelectMenuOptionBuilder()
                  .setLabel("Archer")
                  .setDescription("Skilled marksmen and women ")
                  .setValue("archer"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Mage")
                  .setDescription("Masters of arcane magic")
                  .setValue("mage"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Warrior")
                  .setDescription("Masters of melee combat")
                  .setValue("warrior"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Shaman")
                  .setDescription("Attuned to the spirits of nature")
                  .setValue("shaman"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Druid")
                  .setDescription("Connected to the natural world")
                  .setValue("druid"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Rogue")
                  .setDescription("Sneaky and cunning")
                  .setValue("rogue"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Paladin")
                  .setDescription("Devoted to a higher power")
                  .setValue("paladin"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Necromancer")
                  .setDescription("Masters of death magic")
                  .setValue("necromancer"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Bard")
                  .setDescription("Skilled performers and musicians")
                  .setValue("bard"),
                new StringSelectMenuOptionBuilder()
                  .setLabel("Gunslinger")
                  .setDescription(" wielders of powerful guns")
                  .setValue("gunslinger")
              );
            const row = new ActionRowBuilder().addComponents(select);
            const response = await i.reply({
              embeds: [startEmbed],
              components: [row],
            });
            const collector = response.createMessageComponentCollector({
              componentType: ComponentType.StringSelect,
              time: 15000,
            });
            try {
              collector.on("collect", async (i) => {
                const selection = i.values[0];
                if (selection == "shaman") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Shaman.Weapon.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "mage") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Mage.Weapons.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "archer") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Archer.Weapons.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "warrior") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Warrior.Weapons.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "rogue") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Rogue.Weapons.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "paladin") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Paladin.Weapons.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "druid") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Druid.Weapons.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "bard") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Bard.Weapon.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "gunslinger") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Gunslinger.Weapon.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }
                if (selection == "necromancer") {
                  if (!rUser) {
                    rUser = {
                      id: `${i.user.id}`,
                      user: `${i.user}`,
                      guild: null,
                      level: 0,
                      class: `${selection}`,
                      equipedWeapon: classes.class.Necromancer.Weapon.WeaponId,
                      equipedHelmet: "",
                      equipedChestplate: "",
                      equipedPants: "",
                      equipedBoots: "",
                    };
                  }
                  client.setBattlePlayer.run(rUser);
                }

                await i.reply(
                  `${i.user} has selected ${selection}! good luck on your adventure!`
                );
              });
            } catch (e) {}
          }
          if (i.customId === "cancel") {
            i.reply("hope to see you play soon!");
          }
        });
        Collector.on("end", (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
  if (commandName === "profile") {
    await interaction.deferReply();
    user = interaction.user;
    let rUser = client.getBattlePlayer.get(user.id);
    if (!rUser) {
      interaction.editReply({
        content:
          "you have not yet started your journey. to start your journey, please use /start",
      });
    } else {
      const canvas = createCanvas(564, 1002);
      const context = canvas.getContext("2d");

      const background = await readFile("./designs/profile.jpg");
      const backgroundImage = new Image();
      backgroundImage.src = background;
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      context.strokeStyle = "#0099ff";
      context.strokeRect(0, 0, canvas.width, canvas.height);

      context.font = "28px Arial";
      context.fillStyle = "#ffffff";
      context.fillText("Profile", canvas.width / 2.5, canvas.height / 3.5);

      context.font = applyText(canvas, `${rUser.user}!`);
      context.fillStyle = "#ffffff";
      context.fillText(
        `${interaction.member.displayName}!`,
        canvas.width / 1.5,
        canvas.height / 8
      );
      context.font = applyText(canvas, `${rUser.level}`);
      context.fillStyle = "#ffffff";
      context.fillText(
        `${rUser.level}!`,
        canvas.width / 2.5,
        canvas.height / 2.4
      );
      context.font = applyText(canvas, `${rUser.class}`);
      context.fillStyle = "#ffffff";
      context.fillText(
        `${rUser.class}!`,
        canvas.width / 2.5,
        canvas.height / 2.8
      );

      context.beginPath();
      context.arc(150, 150, 100, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const { body } = await request(
        interaction.user.displayAvatarURL({ format: "jpg" })
      );
      const avatar = new Image();
      avatar.src = Buffer.from(await body.arrayBuffer());
      context.drawImage(avatar, 25, 25, 250, 250);

      const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
        name: "profile-image.png",
      });

      await interaction.editReply({ files: [attachment] });
    }
  }
});

// Login to Discord with your client's token
client.login(token);

// functions

function createDatabases(
  levelTable,
  currencyTable,
  familyTable,
  rpTable,
  bgPlayerTable,
  bgLootTable,
  suggestionTable
) {
  // ------------------ Level Table ----------------
  if (!levelTable["count(*)"]) {
    // If the table isn't there, create it and setup the database correctly.
    ldb
      .prepare(
        "CREATE TABLE levels (id TEXT PRIMARY KEY, user TEXT, guild TEXT, userName TEXT, level INTEGER, experience INTEGER);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    ldb.prepare("CREATE UNIQUE INDEX idx_levels_id ON levels (id);").run();
    ldb.pragma("synchronous = 1");
    ldb.pragma("journal_mode = wal");
    console.log(`level table created successfully`);
  }

  // ------------------ Currency Table ----------------
  if (!currencyTable["count()"]) {
    // If the table isn't there, create it and setup the database correctly.
    cdb
      .prepare(
        "CREATE TABLE currency (id TEXT PRIMARY KEY, user TEXT, guild TEXT, userName TEXT, bank Integer, cash Integer, bitcoin Integer);"
      )
      .run();

    // Ensure that the "id" row is always unique and indexed.
    cdb.prepare("CREATE UNIQUE INDEX idx_currency_id ON currency (id);").run();
    cdb.pragma("synchronous = 1");
    cdb.pragma("journal_mode = wal");
    console.log(`currency table created successfully`);
  }

  // ------------------ Family Table ----------------
  if (!familyTable["count()"]) {
    // If the table isn't there, create it and setup the database correctly.
    fdb
      .prepare(
        "CREATE TABLE family (id TEXT PRIMARY KEY, user TEXT, partnerID TEXT, partnerName TEXT, date TEXT, parent1 TEXT, parent1Name TEXT, parent2 TEXT, parent2Name TEXT, child1 TEXT, child1Name TEXT, child2 TEXT, child2Name TEXT, child3 TEXT, child3Name TEXT, child4 TEXT, child4Name TEXT, child5 TEXT, child5Name TEXT);"
      )
      .run();

    fdb.prepare("CREATE UNIQUE INDEX idx_family_id ON family (id);").run();
    fdb.pragma("synchronous = 1");
    fdb.pragma("journal_mode = wal");
  }
  // ------------------ RolePlay Table ----------------
  if (!rpTable["count()"]) {
    // If the table isn't there, create it and setup the database correctly.
    rdb
      .prepare(
        "CREATE TABLE roleplay (id TEXT PRIMARY KEY, user TEXT, guild TEXT, kissed INTEGER, gkissed INTEGER, hugged INTEGER, ghugged INTEGER, cried INTEGER, gcried INTEGER, holdhands INTEGER, gholdhands INTEGER, boop INTEGER, gboop INTEGER, slapped INTEGER, gslapped INTEGER, spanked INTEGER, gspanked INTEGER, pet INTEGER, gpet INTEGER);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    rdb.prepare("CREATE UNIQUE INDEX idx_roleplay_id ON roleplay (id);").run();
    rdb.pragma("synchronous = 1");
    rdb.pragma("journal_mode = wal");
  }
  // ------------------ BG Player Table ----------------
  if (!bgPlayerTable["count()"]) {
    battleDB
      .prepare(
        "CREATE TABLE player (id TEXT PRIMARY KEY, user TEXT, guild TEXT, level INTEGER, class TEXT, equipedWeapon TEXT, equipedHelmet TEXT, equipedChestplate TEXT, equipedPants TEXT, equipedBoots TEXT);"
      )
      .run();
    battleDB.prepare("CREATE UNIQUE INDEX idx_player_id ON player (id);").run();
    battleDB.pragma("synchronous = 1");
    battleDB.pragma("journal_mode = wal");
  }
  // ------------------ BG Loot Table ----------------
  if (!bgLootTable["count()"]) {
    battleDB
      .prepare(
        "CREATE TABLE loot (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, item TEXT, rarity TEXT);"
      )
      .run();
    battleDB.prepare("CREATE UNIQUE INDEX idx_loot_id ON loot (id);").run();
    battleDB.pragma("synchronous = 1");
    battleDB.pragma("journal_mod = wal");
  }
  // ------------------ Suggestion Table ----------------
  if (!suggestionTable["count()"]) {
    suggestionDB
      .prepare(
        "CREATE TABLE suggestion (id INTEGER PRIMARY KEY AUTOINCREMENT, userid TEXT, suggestion TEXT, category TEXT, upvotes INTEGER, downvotes INTEGER, dateAdded TEXT);"
      )
      .run();
    suggestionDB
      .prepare("CREATE UNIQUE INDEX idx_suggestion_id ON suggestion (id);")
      .run();
    suggestionDB.pragma("synchronous = 1");
    suggestionDB.pragma("journal_mod = wal");
  }
}

function getDatabases() {
  client.getLevels = ldb.prepare(
    "SELECT * FROM levels WHERE user = ? and guild = ?"
  );
  client.setLevels = ldb.prepare(
    "INSERT OR REPLACE INTO levels (id, user, guild, userName, level, experience) VALUES (@id, @user, @guild, @userName, @level, @experience);"
  );
  console.log(`Levels table loaded successfully`);

  client.getCurrency = cdb.prepare(
    "SELECT * FROM currency WHERE user = ? AND guild = ?"
  );
  client.setCurrency = cdb.prepare(
    "INSERT OR REPLACE INTO currency (id, user, guild, userName, bank, cash, bitcoin) VALUES (@id, @user, @guild, @userName, @bank, @cash, @bitcoin);"
  );
  console.log(`Currency table loaded successfully`);

  client.getFamily = fdb.prepare("SELECT * FROM family WHERE user = ?");
  client.setFamily = fdb.prepare(
    "INSERT OR REPLACE INTO family (id, user, partnerID, partnerName, date, parent1 , parent1Name , parent2, parent2Name, child1, child1Name, child2, child2Name, child3, child3Name, child4, child4Name, child5, child5Name) VALUES (@id, @user, @partnerID, @partnerName, @date, @parent1, @parent1Name, @parent2, @parent2Name,@child1, @child1Name, @child2, @child2Name, @child3, @child3Name, @child4, @child4Name, @child5, @child5Name);"
  );
  console.log(`Family table loaded successfully`);

  client.getRoleplay = rdb.prepare(
    "SELECT * FROM roleplay WHERE user = ? AND guild = ?"
  );
  client.setRoleplay = rdb.prepare(
    "INSERT OR REPLACE INTO roleplay (id, user, guild, kissed, gkissed, hugged, ghugged, cried, gcried, holdhands, gholdhands, boop, gboop, slapped, gslapped, spanked, gspanked, pet, gpet) VALUES (@id, @user, @guild, @kissed, @gkissed, @hugged, @ghugged, @cried, @gcried, @holdhands, @gholdhands, @boop, @gboop, @slapped, @gslapped, @spanked, @gspanked, @pet, @gpet);"
  );
  console.log(`Roleplay table loaded successfully`);
  client.getBattlePlayer = battleDB.prepare(
    "SELECT * FROM player WHERE id = ?"
  );
  client.setBattlePlayer = battleDB.prepare(
    "INSERT OR REPLACE INTO player (id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (@id, @user, @guild, @level, @class, @equipedWeapon, @equipedHelmet, @equipedChestplate, @equipedPants, @equipedBoots);"
  );
  console.log(`battle game player table loaded successfully`);
  client.getBattleLoot = battleDB.prepare("SELECT * FROM loot WHERE id = ?");
  client.setBattleLoot = battleDB.prepare(
    "INSERT OR REPLACE INTO loot (id, userID, item, rarity) VALUES (@id, @userID, @item, @rarity);"
  );
  console.log(`battle game loot table loaded successfully`);
  client.getSuggestion = suggestionDB.prepare(
    "SELECT * FROM suggestion WHERE suggestion = ? AND category = ?"
  );
  client.setSuggestion = suggestionDB.prepare(
    "INSERT OR REPLACE INTO suggestion (id, userID, suggestion, category, upvotes, downvotes, dateAdded) VALUES (@id, @userid, @suggestion, @category, @upvotes, @downvotes, @dateAdded);"
  );
  console.log(`suggestion table loaded successfully`);
}

function loading() {
  setTimeout(function () {
    dropMessage = false;
  }, 20000);
  //console.log(dropMessage + "after timeout")
}

function currDrop(message) {
  let randMoney = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
  //console.log(randNumber)
  //console.log(randNumber, counter)
  if (++counter === randNumber) {
    counter = 0;
    let dropembed = new EmbedBuilder();
    dropembed.setDescription(
      `Quick! Someone dropped ${randMoney}$, pick it using \`.pick\``
    );
    dropMessage = true;
    //console.log(dropMessage)
    loading();
    randomMoney = randMoney;

    randNumber = number[Math.floor(Math.random() * number.length)];
    //message.channel.send(`${randNumber} messages were sent!`)//.then(message=>message.delete({timeout:"20000"/*Time until delete in milliseconds*/}))
    message.channel
      .send({ embeds: [dropembed] })
      .then((message) =>
        setTimeout(() => message.delete(), 10000)
      ); /*Time until delete in milliseconds*/
  }
  if (
    message.content.startsWith(`${PREFIX}pick`) ||
    message.content.startsWith(`${PREFIX}pick`)
  ) {
    userid = message.author.id;
    user = message.author;
    username = user.username;
    let rUser = client.getCurrency.get(userid, message.guild.id);
    if (!rUser) {
      rUser = {
        id: `${message.guild.id}-${userid}`,
        user: userid,
        guild: message.guild.id,
        userName: username,
        bank: 0,
        cash: 0,
        bitcoin: 0,
      };
    }
    if (dropMessage == true) {
      message.delete();
      message.channel
        .send(`${user} picked up ${randomMoney}`)
        .then((message) =>
          setTimeout(() => message.delete(), 10000)
        ); /*Time until delete in milliseconds*/
      dropMessage = false;
      oldCash = rUser.cash;
      newCash = oldCash + randomMoney;
      //console.log(oldCash + " + " +  randomMoney + " = " + newCash)
      rUser.cash = newCash;
      client.setCurrency.run(rUser);
      counter = 0;
    } else {
      //console.log(`nothing to pick: ${dropMessage}`)
      message.delete();
    }
  }
}

function deposit(oldCash, oldBank, amount) {
  newCash = oldCash - amount;
  newBank = Number(`${oldBank}`) + Number(`${amount}`);
}

function withdraw(oldCash, oldBank, amount) {
  newCash = Number(`${oldCash}`) + Number(`${amount}`);
  newBank = oldBank - amount;
}

function getDaysBetween(date) {
  const january = "January";
  const february = "February";
  const march = "March";
  const april = "April";
  const may = "May";
  const june = "June";
  const july = "July";
  const august = "August";
  const september = "September";
  const october = "October";
  const november = "November";
  const december = "December";

  try {
    dateTime = date[1];
    date = date[0].split(" ");
    month = date[0];
    day = date[1];

    if (day.includes("st")) {
      day = day.replace("st", "");
    }
    if (day.includes("nd")) {
      day = day.replace("nd", "");
    }

    switch (month) {
      case january:
        marriedDate = moment([Number(date[2]), 0, Number(day)]);
      case february:
        marriedDate = moment([Number(date[2]), 1, Number(day)]);
        return diff(marriedDate);
      case march:
        marriedDate = moment([Number(date[2]), 2, Number(day)]);
        return diff(marriedDate);
      case april:
        marriedDate = moment([Number(date[2]), 3, Number(day)]);
        return diff(marriedDate);
      case may:
        marriedDate = moment([Number(date[2]), 4, Number(day)]);
        return diff(marriedDate);
      case june:
        marriedDate = moment([Number(date[2]), 5, Number(day)]);
        return diff(marriedDate);
      case july:
        marriedDate = moment([Number(date[2]), 6, Number(day)]);
        return diff(marriedDate);
      case august:
        marriedDate = moment([Number(date[2]), 7, Number(day)]);
        return diff(marriedDate);
      case september:
        marriedDate = moment([Number(date[2]), 8, Number(day)]);
        return diff(marriedDate);
      case october:
        marriedDate = moment([Number(date[2]), 9, Number(day)]);
        return diff(marriedDate);
      case november:
        marriedDate = moment([Number(date[2]), 10, Number(day)]);
        return diff(marriedDate);
      case december:
        marriedDate = moment([Number(date[2]), 11, Number(day)]);
        return diff(marriedDate);
    }
  } catch (e) {
    console.error(e);
  }
}

function diff(marriedDate) {
  start_Date = marriedDate;
  end_Date = moment([2023, 2, 29]);
  console.log(start_Date, end_Date);
  let totalDays = end_Date.diff(start_Date, "days");
  console.log(`TotalDays: ${totalDays}`);
  return totalDays;
}

function level() {}

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 80;

  do {
    context.font = `${(fontSize -= 10)}px Arial`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};
