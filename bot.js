import fs from "node:fs";
import { config } from "dotenv";
import path from "node:path";
import axios from "axios";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} from "discord.js";
import mysql from "mysql2";
import Database from "better-sqlite3";
import moment from "moment/moment.js";
import { Player } from "discord-player";
import { MongoClient, ObjectId } from "mongodb";
import { fileURLToPath } from "url";
import { dirname } from "path";

config();

const uri = process.env.MONGODB; // Fill in your MongoDB connection string here
const mongoclient = new MongoClient(uri);

import errorHandler from "./handlers/errorHandler.js";
import usageHandler from "./handlers/usageHandler.js";
import { messageCounter } from "./handlers/activityHandler.js";
import levelRoleHandler from "./handlers/levelRoleHandler.js";

const conn = "";

// const conn = mysql.createConnection(process.env.DATABASE_URL);

// conn.connect(function (err) {
//   if (err) throw err;
//   console.log("Succesfully connected to PlanetScale!");
// });
// arrays
const number = [
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
  69,
];

// databases
const fdb = new Database("./databases/family.sqlite");
const rdb = new Database("./databases/roleplay.sqlite");
const battleDB = new Database("./databases/battlegame.sqlite");
const suggestionDB = new Database("./databases/suggestion.sqlite");
const leaveDB = new Database("./databases/leave.sqlite");
// variables
let counter = 0;
let dropMessage = false;
let randomMoney = 0;
let randNumber = number[Math.floor(Math.random() * number.length)];

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
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
const PREFIX = ".";
const botREPO = "Wesleyvdk/NatureBot";
const webREPO = "Wesleyvdk/DiscordBotAdminDashboard";
const botBRANCH = "V2";
const webBRANCH = "main";
let lastBotCommitSha = null;
let lastWebCommitSha = null;

let CurrentDate = moment().format();

const player = new Player(client);

player.extractors.loadDefault();

client.commands = new Collection();
const __dirname = dirname(fileURLToPath(new URL(import.meta.url)));
//const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(`./commands`);

for (const folder of commandFolders) {
  //const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js") || file.endsWith(".mjs"));
  for (const file of commandFiles) {
    const filePath = await import(`./commands/${folder}/${file}`);
    const command = filePath;
    const commandObject = {
      command: command, // This is your command structure
      category: folder, // Category of the command
    };
    if (command.default.data && command.default.execute) {
      client.commands.set(command.default.data.name, commandObject);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, async () => {
  await mongoclient.connect().then(() => console.log("Connected to MongoDB!"));
  client.commands.forEach(async (commandObject) => {
    // MONGO DB
    const collection = mongoclient.db("Aylani").collection(`botcommands`);
    const existingCommand = await collection.findOne({
      command: commandObject.command.default.data.name,
    });

    if (!existingCommand) {
      collection.insertOne({
        command: commandObject.command.default.data.name,
        category: commandObject.category,
        usage_count: 0,
      });
    }
  });

  const leaveTable = leaveDB
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'leave';"
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
  const suggestionTable = suggestionDB
    .prepare(
      "SELECT count() FROM sqlite_master WHERE type='table' AND name = 'suggestion';"
    )
    .get();
  await createDatabases(leaveTable, familyTable, rpTable, suggestionTable);
  await getDatabases();

  // MONGO DB
  // Happens automatically on insertion

  // MYSQL DB
  // conn.promise().query(
  //   `CREATE TABLE IF NOT EXISTS activity (
  //     id INTEGER PRIMARY KEY AUTO_INCREMENT,
  //     userID varchar(255),
  //     guildID varchar(255),
  //     message INTEGER,
  //     voice INTEGER
  //   );`
  // );
  // conn.promise().query(
  //   `CREATE TABLE IF NOT EXISTS players (
  //       id char(30) PRIMARY KEY,
  //       user varchar(255),
  //       guild varchar(255),
  //       level INTEGER,
  //       class varchar(255),
  //       equipedWeapon varchar(255),
  //       equipedHelmet varchar(255),
  //       equipedChestplate varchar(255),
  //       equipedPants varchar(255),
  //       equipedBoots varchar(255)
  //       );`
  // );
  // conn.promise().query(
  //   `CREATE TABLE IF NOT EXISTS loot (
  //       id INTEGER PRIMARY KEY AUTO_INCREMENT,
  //       userID varchar(255),
  //       item varchar(255),
  //       rarity varchar(255)
  //       );`
  // );
  client.guilds.cache.forEach((guild) => {
    // conn.promise().query(
    //   `CREATE TABLE IF NOT EXISTS ${guild.id}Currency(
    //     id char(30) NOT NULL PRIMARY KEY UNIQUE,
    //     user varchar(255),
    //     guild varchar(255),
    //     userName varchar(255),
    //     bank Integer,
    //     cash Integer,
    //     bitcoin Integer
    //     );`
    // );
    // conn.promise().query(
    //   `CREATE TABLE IF NOT EXISTS ${guild.id}Levels(
    //   id char(30) NOT NULL PRIMARY KEY UNIQUE,
    //   name varchar(255) NOT NULL,
    //   level int NOT NULL,
    //   exp int NOT NULL
    //   );`
    // );

    // const settingsTable = `CREATE TABLE IF NOT EXISTS ${guild.id}Settings(
    //   id int AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE,
    //   command varchar(255) NOT NULL UNIQUE,
    //   category varchar(255) NOT NULL,
    //   turnedOn bool NOT NULL
    //   );`;
    // conn.promise().query(settingsTable);

    client.commands.forEach(async (commandObject) => {
      // MONGO DB
      const collection = mongoclient
        .db("Aylani")
        .collection(`${guild.id}Settings`);
      const existingCommand = await collection.findOne({
        command: commandObject.command.default.data.name,
      });

      if (!existingCommand) {
        collection.insertOne({
          command: commandObject.command.default.data.name,
          category: commandObject.category,
          turnedOn: true,
        });
      }
    });

    // MYSQL DB
    // const commandSettings = `INSERT IGNORE INTO ${guild.id}Settings(
    //     command, category, turnedOn) VALUES (?, ?, True);
    // `;
    // conn
    //   .promise()
    //   .query(commandSettings, [
    //     commandObject.command.default.data.name,
    //     commandObject.category,
    //   ]);
    // });
  });
  const Guilds = client.guilds.cache.map((guild) => [
    guild.id,
    guild.name,
    guild.features,
  ]);
  console.log(Guilds);
  console.log(
    `logged in as: ${client.user.username}. ready to be used! (${CurrentDate})`
  );
});

client.on(Events.GuildMemberRemove, async (member) => {
  let userId = member.id;
  let guildId = member.guild.id;
  let username = member.username;
  let leaveTime = new Date().toString();

  await leaveDB
    .prepare(`INSERT INTO leave(id, user, guild, date) VALUES (?, ?, ?, ?)`)
    .run(userId, username, guildId, leaveTime);
});

client.on("guildMemberAdd", async (member) => {
  let joiner = member.user;
  let joinerid = member.user.id;
  if (member.guild.id === "929352993655124000") {
    const channel = member.guild.channels.cache.get("1104478351114129570");
    const api_key = process.env.TENOR_KEY;
    const search_term = "anime_wave";
    const limit = 1;
    const url = `https://tenor.googleapis.com/v2/search?q=${search_term}&key=${api_key}&limit=${limit}&random=true`;

    let totalLeavers;
    leaveDB
      .prepare(`SELECT COUNT(*) as total FROM leave WHERE guild = ?`)
      .all(member.guild.id);

    try {
      const response = await axios({
        method: "GET",
        url: url,
        headers: {
          "User-Agent": "PostmanRuntime/7.28.4",
        },
      });
      const data = response.data;
      if (!data.results || data.results.length === 0) {
        console.log("no gifs were found");
      }
      const gif = data.results[0].media_formats.gif.url;
      let welcomeMessage = `give ${joiner} a warm welcome`;
      const welcomeEmbed = new EmbedBuilder()
        .setColor("#5cf000")
        .setDescription(
          `Welcome to ${member.guild.name}\n\nMake sure to check out:\n-> <#929352994158419968>\n-> <#982734226808012801>\n\nEnjoy your stay!`
        )
        .setImage(gif)
        .setFooter({
          text: `We now have ${member.guild.memberCount} Members. ${totalLeavers} members have left.`,
        })
        .setTimestamp();
      channel.send({ content: welcomeMessage, embeds: [welcomeEmbed] });
    } catch (e) {
      console.log(`Error: ${e}`);
      console.log(`Date/Time: ${CurrentDate}`);
      let welcomeMessage = `give ${joiner} a warm welcome`; //<@&771100361326985229>
      const welcomeEmbed = new EmbedBuilder()
        .setColor("#5cf000")
        .setDescription(
          `Welcome to ${member.guild.name}\nMake sure to check out:\n-> <#929352994158419968>\n-> <#982734226808012801>\nEnjoy your stay!`
        )
        .setImage(
          "https://media2.giphy.com/media/3ov9jIYPU7NMT6TS7K/giphy.gif?cid=ecf05e47dp3ynov4tbepk3akc4wb7kpiv7l0jq5p6526jzi9&rid=giphy.gif&ct=g"
        )
        .setFooter({
          text: `We now have ${member.guild.memberCount} Members. ${totalLeave} members have left.`,
        })
        .setTimestamp();
      channel.send({ content: welcomeMessage, embeds: [welcomeEmbed] });
    }
    const role = member.guild.roles.cache.find(
      (role) => role.id === "929352993655124002"
    );
    member.roles.add(role);
  }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (newMember.guild.id == "929352993655124000") {
    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;
    const newStatusDate = moment(newStatus);
    const currentDate = moment();
    const isNow = newStatusDate.isSame(currentDate, "minute");
    if (isNow) {
      console.log(
        `old Status: ${oldStatus} \nnew Status: ${newStatus}\n oldMember: ${oldMember}\n newMember: ${newMember}\nis now? ${isNow}`
      );
      if (!oldStatus && newStatus) {
        client.channels.cache
          .get("1104478351114129570")
          .send(`Thank you ${newMember.user} for boosting!!`);
      }
    }
  }
});

client.on("guildCreate", async (guild) => {
  // MONGO DB
  // Happens automatically on insertion
  // MYSQL DB
  // conn.promise().query(
  //   `CREATE TABLE IF NOT EXISTS ${guild.id}Currency(
  //     id char(30) NOT NULL PRIMARY KEY UNIQUE,
  //     user varchar(255),
  //     guild varchar(255),
  //     userName varchar(255),
  //     bank Integer,
  //     cash Integer,
  //     bitcoin Integer)`
  // );
  // conn.promise().query(`CREATE TABLE IF NOT EXISTS ${guild.id}Levels(
  //   id char(30) NOT NULL PRIMARY KEY UNIQUE,
  //   name varchar(255) NOT NULL,
  //   level int NOT NULL,
  //   exp int NOT NULL
  //   );`);

  // conn.promise().query(
  //   `CREATE TABLE IF NOT EXISTS ${guild.id}Settings(
  //       id int AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE,
  //       command varchar(255) NOT NULL,
  //       category varchar(255) NOT NULL,
  //       turnedOn bool NOT NULL
  //       );`
  // );

  client.commands.forEach((commandObject) => {
    // MONGO DB
    mongoclient.db("Aylani").collection(`${guild.id}Settings`).insertOne({
      command: commandObject.command.default.data.name,
      category: commandObject.category,
      turnedOn: true,
    });

    // MYSQL DB
    // const commandSettings = `INSERT IGNORE INTO ${guild.id}Settings(
    //     command, category, turnedOn) VALUES (?, ?, True);
    //   `;
    // conn
    //   .promise()
    //   .query(commandSettings, [
    //     commandObject.command.default.data.name,
    //     commandObject.category,
    //   ]);
  });
  // send "hello" message
});

client.on("guildDelete", async (guild) => {
  // MONGO DB
  mongoclient.db("Aylani").collection(`${guild.id}Currency`).drop();
  mongoclient.db("Aylani").collection(`${guild.id}Levels`).drop();
  mongoclient.db("Aylani").collection(`${guild.id}Settings`).drop();
  // MYSQL DB
  // conn.promise().query(`DROP TABLE ${guild.id}Currency`);
  // conn.promise().query(`DROP TABLE ${guild.id}Levels`);
  // conn.promise().query(`DROP TABLE ${guild.id}Settings`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;

    let guild = message.guild.id;
    let userid = message.author.id;
    let username = message.author.username;
    let user = message.author;

    // You can use a function to handle database updates
    await messageCounter(userid, guild, conn, mongoclient);

    // MONGO DB
    addExperienceMongoDB(user, guild);
    levelRoleHandler(user, guild, mongoclient);
    // MYSQL DB
    // conn
    //   .promise()
    //   .query(
    //     `INSERT IGNORE INTO ${guild}Levels(id, name, level, exp) VALUES (?,?, 1, 0)`,
    //     [userid, username]
    //   );

    // conn
    //   .promise()
    //   .execute(`SELECT * FROM ${guild}Levels WHERE id=?`, [userid])
    //   .then(async ([rows, fields]) => {
    //     addExperienceMySQL(rows, user, guild);
    //   });

    // MAKE PREMIUM
    // NEED TO BE FIXED
    // const member = message.member;
    // for (i = 0; i < roles.length; i++) {
    //   const role = message.guild.roles.cache.find(
    //     (role) => role.name === roles[i]
    //   );
    //   if (!role) {
    //     guild.roles
    //       .create({
    //         name: roles[i],
    //       })
    //       .then((createdRole) => {
    //         console.log(`Role created: ${createdRole.name}`);
    //         // if (roleLevel == 1) roleLevel + 4
    //         // else if (roleLevel == 5) roleLevel + 5
    //         // else if (roleLevel >= 10) roleLevel + 10
    //       })
    //       .catch((e) => {
    //         errorHandler(null, e, message);
    //       });
    //   }
    // }

    // MONGO DB
    async function addExperienceMongoDB(user, guild) {
      const filter = { _id: user.id };
      const update = {
        $inc: { exp: 5 },
        $setOnInsert: { name: user.username, level: 1 },
      };
      const options = { upsert: true };
      mongoclient
        .db("Aylani")
        .collection(`${guild}Levels`)
        .updateOne(filter, update, options)
        .then(levelUpMongoDB(user, guild));
    }
    async function levelUpMongoDB(user, guild) {
      try {
        mongoclient
          .db("Aylani")
          .collection(`${guild}Levels`)
          .findOne({ _id: user.id })
          .then((doc) => {
            try {
              let lvl_start = doc.level;
              let lvl_end = 5 * lvl_start ** 2 + 50 * lvl_start + 100 - doc.exp;

              let round = Math.floor(lvl_end);
              let lvl_up = Number(round);

              if (lvl_up < 0) {
                const filter = { _id: user.id };
                const update = { $inc: { level: 1 } };
                const options = { upsert: true };
                mongoclient
                  .db("Aylani")
                  .collection(`${guild}Levels`)
                  .updateOne(filter, update, options)
                  .then(
                    message.channel.send(
                      `${user} has leveled up to level ${doc.level + 1}`
                    )
                  );
                //await check_level_reward(rows, message);
              }
            } catch (e) {
              console.log(`Error: ${e}`);
              console.log(`On: ${user} ${doc}`);
              console.log(`Date/Time: ${CurrentDate}`);
            }
          });
      } catch (e) {
        errorHandler(null, e, message);
      }
    }
    // MYSQL DB
    async function levelUpMySQL(rows, user, guild) {
      try {
        let xp = rows[0].exp;
        let lvl_start = rows[0].level;
        let lvl_end = 5 * lvl_start ** 2 + 50 * lvl_start + 100 - xp;

        let round = Math.floor(lvl_end);
        let lvl_up = Number(round);

        if (lvl_up < 0) {
          // const channelId = "1173064790340534412";
          // const channel = await client.channels.cache.get(channelId);
          conn
            .promise()
            .query(
              `UPDATE ${guild}Levels SET level = ${rows[0].level} + 1 WHERE id = ?`,
              [user.id]
            )
            .then(
              message.channel.send(
                `${user} has leveled up to level ${rows[0].level + 1}`
              )
            );
        }
      } catch (e) {
        errorHandler(null, e, message);
      }
      //await check_level_reward(rows, message);
    }
    async function addExperienceMySQL(rows, user, guild) {
      try {
        let exp = await rows[0].exp;
        let newExp = (exp += 5);
      } catch (e) {
        console.log(`Error: ${e}`);
        console.log(`Date/Time: ${CurrentDate}`);
        conn
          .promise()
          .query(
            `INSERT IGNORE INTO ${guild}Levels(id, name, level, exp) VALUES (?,?, 1, 0)`,
            [user.id, user.username]
          );

        conn
          .promise()
          .execute(`SELECT * FROM '${guild}Levels' WHERE id=${user.id}`)
          .then(async ([rows, fields]) => {
            addExperienceMySQL(rows, user);
          });
      }
      let exp = await rows[0].exp;
      let newExp = (exp += 5);

      conn
        .promise()
        .query(`UPDATE ${guild}Levels SET exp = ${newExp} WHERE id = ?`, [
          user.id,
        ])
        .then(levelUpMySQL(rows, user, guild));
    }

    if (message.channel.id === "929352993701253154") return;
    if (message.channel.id === "929352993701253154") return;
    if (message.channel.id === "929352994158419971") return;
    if (message.channel.id === "1085133582596591657") return;
    if (message.channel.id === "1085129112961691729") return;
    if (message.channel.id === "1007281491568492634") return;
    if (message.channel.id === "938036238101921844") return;
    currDrop(message);
  } catch (e) {
    errorHandler(null, e, message);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    // MONGO DB
    await mongoclient
      .db("Aylani")
      .collection(`${interaction.guild.id}Settings`)
      .findOne({ command: command.command.default.data.name })
      .then(async (doc) => {
        if (doc.turnedOn === 0) {
          interaction.reply({
            content:
              "This command is not turned on in this server. Contact the server owner if you're interested in this command.",
            ephemeral: true,
          });
          return;
        } else {
          const { useQueue } = await import("discord-player");
          const queue = useQueue(interaction.guild.id);
          await command.command.default.execute(
            client,
            interaction,
            conn,
            mongoclient,
            queue
          );
          usageHandler(command.command.default.data.name, mongoclient, conn);
        }
      });

    // MYSQL DB
    // conn
    //   .promise()
    //   .query(
    //     `SELECT * FROM ${interaction.guild.id}Settings WHERE command = ?`,
    //     [command.command.default.data.name]
    //   )
    //   .then(async ([rows, fields]) => {
    //     if (rows[0].turnedOn == 0) {
    //       interaction.reply({
    //         content:
    //           "This command is not turned on in this server. Contact the server owner if you're interested in this command.",
    //         ephemeral: true,
    //       });
    //       return;
    //     } else {
    //       const { useQueue } = await import("discord-player");
    //       const queue = useQueue(interaction.guild.id);
    //       await command.command.default.execute(
    //         client,
    //         interaction,
    //         conn,
    //         mongoclient,
    //         queue
    //       );
    //       usageHandler(command.command.default.data.name, mongoclient, conn);
    //     }
    //   });
  } catch (e) {
    errorHandler(interaction, e, null);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

player.events.on("playerStart", (queue, track) => {
  if (!track.requestedBy) track.requestedBy = bot.user;

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Now playing" })
    .setTitle(`${track.title}`)
    .setURL(`${track.url}`)
    .setThumbnail(`${track.thumbnail}`)
    .setFooter({
      text: `Played by: ${track.requestedBy.username}`,
      iconURL: `${track.requestedBy.displayAvatarURL({ dynamic: true })}`,
    });
  queue.metadata.channel.send({ embeds: [embed] });
});
player.events.on("emptyQueue", (queue) => {
  queue.metadata.channel.send(`No more tracks to play, leaving now.`);
});
player.events.on("error", (queue) => {
  const embed = new EmbedBuilder()
    .setTitle("An error occured while playing")
    .setDescription(`Reason: \`${error.message}\``)
    .setColor(Colors.Red);

  queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
});
player.events.on("playerError", (queue) => {
  const embed = new EmbedBuilder()
    .setTitle("An error occured while playing")
    .setDescription(`Reason: \`${error.message}\``)
    .setColor(Colors.Red);
  queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
});
player.events.on("playerSkip", (queue, track) => {
  queue.metadata.channel.send(`Skipping **${track.title}** due to an issue!`);
});
player.events.on("emptyChannel", (queue) => {
  metadata.channel.send("Feeling lonely, leaving now.");
});
player.events.on("audioTrackAdd", (queue, track) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Track queued - Position ${queue.node.getTrackPosition(track) + 1}`,
    })
    .setTitle(`${track.title}`)
    .setURL(`${track.url}`)
    .setFooter({
      text: `Requested by: ${track.requestedBy.tag}`,
      iconURL: track.requestedBy.displayAvatarURL({ dynamic: true }),
    });

  queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
});
player.events.on("audioTracksAdd", (queue, tracks) => {
  const embed = new EmbedBuilder()
    .setTitle(`${tracks.length} tracks queued.`)
    .setFooter({
      text: `Requested by: ${tracks[0].requestedBy.tag}`,
      iconURL: tracks[0].requestedBy.displayAvatarURL({ dynamic: true }),
    });

  return queue.metadata.send({ embeds: [embed] }).catch(console.error);
});
function createDatabases(leaveTable, familyTable, rpTable, suggestionTable) {
  // ------------------ Family Table ----------------
  if (!leaveTable["count()"]) {
    // If the table isn't there, create it and setup the database correctly.
    leaveDB
      .prepare(
        "CREATE TABLE leave (id TEXT PRIMARY KEY, user TEXT, guild TEXT, date TEXT);"
      )
      .run();
    // Ensure that the "id" row is always unique and indexed.
    leaveDB.prepare("CREATE UNIQUE INDEX idx_leave_id ON leave (id);").run();
    leaveDB.exec("PRAGMA journal_mode = WAL;");
  }
  if (!familyTable["count()"]) {
    // If the table isn't there, create it and setup the database correctly.
    fdb
      .prepare(
        "CREATE TABLE family (id TEXT PRIMARY KEY, user TEXT, partnerID TEXT, partnerName TEXT, date TEXT, parent1 TEXT, parent1Name TEXT, parent2 TEXT, parent2Name TEXT, child1 TEXT, child1Name TEXT, child2 TEXT, child2Name TEXT, child3 TEXT, child3Name TEXT, child4 TEXT, child4Name TEXT, child5 TEXT, child5Name TEXT);"
      )
      .run();

    fdb.prepare("CREATE UNIQUE INDEX idx_family_id ON family (id);").run();
    fdb.exec("PRAGMA journal_mode = WAL;");
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
    rdb.exec("PRAGMA journal_mode = WAL;");
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
    suggestionDB.exec("PRAGMA journal_mode = WAL;");
  }
}

function getDatabases() {
  client.getLeave = leaveDB.prepare("SELECT * FROM leave WHERE user = ?");
  client.setLeave = leaveDB.prepare(
    "INSERT OR REPLACE INTO leave (id, user, guild, date) VALUES (@id, @user, @guild, @date);"
  );
  console.log(`leaveDB table loaded successfully`);
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

  if (++counter === randNumber) {
    let counter = 0;
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
    try {
      message.channel
        .send({ embeds: [dropembed] })
        .then((message) =>
          setTimeout(() => message.delete(), 10000)
        ); /*Time until delete in milliseconds*/
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }
  if (
    message.content.startsWith(`${PREFIX}pick`) ||
    message.content.startsWith(`${PREFIX}pick`)
  ) {
    let userid = message.author.id;
    let user = message.author;
    if (dropMessage == true) {
      message.delete();
      message.channel
        .send(`${user} picked up ${randomMoney}`)
        .then((message) =>
          setTimeout(() => message.delete(), 10000)
        ); /*Time until delete in milliseconds*/
      dropMessage = false;

      // MONGO DB
      mongoclient
        .db("Aylani")
        .collection(`${message.guild.id}Currency`)
        .findOne({ id: userid })
        .then(async function (doc) {
          try {
            oldCash = doc.cash;
            newCash = oldCash + randomMoney;
            mongoclient
              .db("Aylani")
              .collection(`${message.guild.id}Currency`)
              .updateOne({ id: userid }, { $set: { cash: newCash } });
            counter = 0;
            randNumber = number[Math.floor(Math.random() * number.length)];
          } catch (e) {
            console.log(`Error: ${e}\nUser: ${user}\nrows: ${doc}`);
          }
        });

      // MYSQL DB
      // conn
      //   .promise()
      //   .query(`SELECT * FROM ${message.guild.id}Currency WHERE id=?`, [userid])
      //   .then(async function ([rows, fields]) {
      //     console.log(rows);
      //     try {
      //       oldCash = rows[0].cash;
      //       newCash = oldCash + randomMoney;
      //       conn
      //         .promise()
      //         .query(
      //           `UPDATE ${message.guild.id}Currency SET cash = ${newCash} WHERE id=${userid}`
      //         );
      //       counter = 0;
      //       randNumber = number[Math.floor(Math.random() * number.length)];
      //     } catch (e) {
      //       console.log(`Error: ${e}\nUser: ${user}\nrows: ${rows}`);
      //     }
      //   });
    } else {
      //console.log(`nothing to pick: ${dropMessage}`)
      message.delete();
    }
  }
}
client.login(process.env.BOT_TOKEN);
