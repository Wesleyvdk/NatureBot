const fs = require("node:fs");
require("dotenv").config();
const path = require("node:path");
const axios = require("axios");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require("discord.js");
const mysql = require("mysql2");
const Database = require("better-sqlite3");
const conn = mysql.createConnection(process.env.DATABASE_URL);
conn.connect(function (err) {
  if (err) throw err;
  console.log("Succesfully connected to PlanetScale!");
});
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

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    const commandObject = {
      command: command, // This is your command structure
      category: folder, // Category of the command
    };
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, commandObject);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
client.once(Events.ClientReady, async () => {
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
  await createDatabases(familyTable, rpTable, suggestionTable);
  await getDatabases();
  conn.promise().query(
    `CREATE TABLE IF NOT EXISTS players (
        id char(30) PRIMARY KEY,
        user varchar(255),
        guild varchar(255),
        level INTEGER,
        class varchar(255),
        equipedWeapon varchar(255),
        equipedHelmet varchar(255),
        equipedChestplate varchar(255),
        equipedPants varchar(255),
        equipedBoots varchar(255)
        );`
  );
  conn.promise().query(
    `CREATE TABLE IF NOT EXISTS loot (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        userID varchar(255),
        item varchar(255),
        rarity varchar(255)
        );`
  );
  client.guilds.cache.forEach((guild) => {
    conn.promise().query(
      `CREATE TABLE IF NOT EXISTS ${guild.id}Currency(
        id char(30) NOT NULL PRIMARY KEY UNIQUE, 
        user varchar(255), 
        guild varchar(255), 
        userName varchar(255), 
        bank Integer, 
        cash Integer, 
        bitcoin Integer
        );`
    );
    conn.promise().query(
      `CREATE TABLE IF NOT EXISTS ${guild.id}Levels(
      id char(30) NOT NULL PRIMARY KEY UNIQUE,
      name varchar(255) NOT NULL,
      level int NOT NULL,
      exp int NOT NULL
      );`
    );

    const settingsTable = `CREATE TABLE IF NOT EXISTS ${guild.id}Settings(
      id int AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE, 
      command varchar(255) NOT NULL UNIQUE, 
      category varchar(255) NOT NULL,
      turnedOn bool NOT NULL
      );`;
    conn.promise().query(settingsTable);

    client.commands.forEach((commandObject) => {
      const commandSettings = `INSERT IGNORE INTO ${guild.id}Settings(
        command, category, turnedOn) VALUES (?, ?, True);
      `;
      conn
        .promise()
        .query(commandSettings, [
          commandObject.command.data.name,
          commandObject.category,
        ]);
    });
  });

  console.log(`logged in as: ${client.user.username}. ready to be used!`);
});

client.on("guildMemberAdd", async (member) => {
  let joiner = member.user;
  let joinerid = member.user.id;
  const channel = member.guild.channels.cache.get("1104478351114129570");
  const api_key = process.env.TENOR_KEY;
  const search_term = "anime_wave";
  const limit = 1;
  const url = `https://tenor.googleapis.com/v2/search?q=${search_term}&key=${api_key}&limit=${limit}&random=true`;

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
      .setFooter({ text: `We now have ${member.guild.memberCount} Members` })
      .setTimestamp();
    channel.send({ content: welcomeMessage, embeds: [welcomeEmbed] });
  } catch (e) {
    console.log(e);
    let welcomeMessage = `give ${joiner} a warm welcome`; //<@&771100361326985229>
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#5cf000")
      .setDescription(
        `Welcome to ${member.guild.name}\nMake sure to check out:\n-> <#929352994158419968>\n-> <#982734226808012801>\nEnjoy your stay!`
      )
      .setImage(
        "https://media2.giphy.com/media/3ov9jIYPU7NMT6TS7K/giphy.gif?cid=ecf05e47dp3ynov4tbepk3akc4wb7kpiv7l0jq5p6526jzi9&rid=giphy.gif&ct=g"
      )
      .setFooter({ text: `We now have ${member.guild.memberCount} Members` })
      .setTimestamp();
    channel.send({ content: welcomeMessage, embeds: [welcomeEmbed] });
  }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (newMember.guild.id == "929352993655124000") {
    const oldStatus = oldMember.premiumSince;
    const newStatus = newMember.premiumSince;

    if (!oldStatus && newStatus) {
      client.channels.cache
        .get("1104478351114129570")
        .send(`Thank you ${newMember.user} for boosting!!`);
    }
  }
});

client.on("guildCreate", async (guild) => {
  conn.promise().query(
    `CREATE TABLE IF NOT EXISTS ${guild.id}Currency(
      id char(30) NOT NULL PRIMARY KEY UNIQUE, 
      user varchar(255), 
      guild varchar(255), 
      userName varchar(255), 
      bank Integer, 
      cash Integer, 
      bitcoin Integer)`
  );
  conn.promise().query(`CREATE TABLE IF NOT EXISTS ${guild.id}Levels(
    id char(30) NOT NULL PRIMARY KEY UNIQUE,
    name varchar(255) NOT NULL,
    level int NOT NULL,
    exp int NOT NULL
    );`);

  conn.promise().query(
    `CREATE TABLE IF NOT EXISTS ${guild.id}Settings(
        id int AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE, 
        command varchar(255) NOT NULL, 
        category varchar(255) NOT NULL, 
        turnedOn bool NOT NULL
        );`
  );

  client.commands.forEach((commandObject) => {
    const commandSettings = `INSERT IGNORE INTO ${guild.id}Settings(
        command, category, turnedOn) VALUES (?, ?, True);
      `;
    conn
      .promise()
      .query(commandSettings, [
        commandObject.command.data.name,
        commandObject.category,
      ]);
  });
  // send "hello" message
});

client.on("guildDelete", async (guild) => {
  conn.promise().query(`DROP TABLE ${guild.id}Currency`);
  conn.promise().query(`DROP TABLE ${guild.id}Levels`);
  conn.promise().query(`DROP TABLE ${guild.id}Settings`);
});

client.on("messageCreate", async (message) => {
  const keyword = "Bump done";
  const roleName = "bumper";
  const role = message.guild.roles.cache.find((role) => role.name === roleName);
  const embed = message.embeds[0];
  try {
    if (embed) {
      try {
        if (embed.description.includes(keyword)) {
          message.channel.send(
            `thank you for bumping! next bump is ready in 2 hours. to get the bump reminder role, use \`.addBump\`\n
              if this role does not exist, the role will be created on first use of the .addBump command`
          );

          const delay = 2 * 60 * 60 * 1000;
          // in milliseconds
          if (role) {
            const roleMention = role.toString();
            setTimeout(() => {
              // Send a message to the channel where the command was used
              message.channel.send(`bump is ready ${roleMention}`);
            }, delay);
          } else {
            setTimeout(() => {
              // Send a message to the channel where the command was used
              message.channel.send("bump is ready");
            }, delay);
          }
        } else {
          return;
        }
      } catch (e) {
        console.log(`Error: ${e.message}`);
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
  try {
    if (message.author.bot) return;

    let guild = message.guild.id;
    userid = message.author.id;
    username = message.author.username;
    user = message.author;
    conn
      .promise()
      .query(
        `INSERT IGNORE INTO ${guild}Levels(id, name, level, exp) VALUES (?,?, 1, 0)`,
        [userid, username]
      );

    conn
      .promise()
      .execute(`SELECT * FROM ${guild}Levels WHERE id=?`, [userid])
      .then(async ([rows, fields]) => {
        add_experience(rows, user, guild);
      });

    async function check_level_reward(rows, message) {
      // MAKE PREMIUM

      // const roles = [
      //   "Member",
      //   "Ai Novice",
      //   "HiRe Pro",
      //   "Promptologist",
      //   "Ai Pro",
      //   "LoRe Expert",
      //   "Ultimate Upscale Pro",
      // ];
      const member = message.member;
      const roleLevel = 1;
      const roleName = `level ${roleLevel}`;
      for (i = 0; i < roles.length; i++) {
        const role = message.guild.roles.cache.find(
          (role) => role.name === roles[i]
        );
        if (!role) {
          guild.roles
            .create({
              name: roles[i],
            })
            .then((createdRole) => {
              console.log(`Role created: ${createdRole.name}`);
              // if (roleLevel == 1) roleLevel + 4
              // else if (roleLevel == 5) roleLevel + 5
              // else if (roleLevel >= 10) roleLevel + 10
            })
            .catch(console.error);
        }
        if (rows[0].level === 1) {
          const role = guild.roles.cache.find((role) => role.name === "Member");
          message.member.roles.add(role);
        }
        if (rows[0].level === 5) {
          const role = guild.roles.cache.find(
            (role) => role.name === "Ai Novice"
          );
          message.member.roles.add(role);
        }
        if (rows[0].level === 10) {
          const role = guild.roles.cache.find(
            (role) => role.name === "HiRe Pro"
          );
          message.member.roles.add(role);
        }
        if (rows[0].level === 15) {
          const role = message.guild.roles.cache.find(
            (role) => role.name === "Promptologist"
          );
          message.member.roles.add(role);
        }
        if (rows[0].level === 20) {
          const role = guild.roles.cache.find((role) => role.name === "Ai Pro");
          message.member.roles.add(role);
        }
        if (rows[0].level === 25) {
          const role = guild.roles.cache.find(
            (role) => role.name === "LoRe Expert"
          );
          message.member.roles.add(role);
        }
        if (rows[0].level === 30) {
          const role = guild.roles.cache.find(
            (role) => role.name === "Ultimate Upscale Pro"
          );
          message.member.roles.add(role);
        }
      }
    }
    async function add_experience(rows, user, guild) {
      try {
        exp = rows[0].exp;
        newExp = exp += 5;
      } catch (e) {
        conn
          .promise()
          .query(
            `INSERT IGNORE INTO ${guild}Levels(id, name, level, exp) VALUES (?,?, 1, 0)`,
            [user.id, user.username]
          );

        conn
          .promise()
          .execute(`SELECT * FROM "${guild}Levels" WHERE id=?`, [user.id])
          .then(async ([rows, fields]) => {
            add_experience(rows, user);
          });
      }
      exp = rows[0].exp;
      newExp = exp += 5;

      conn
        .promise()
        .query(`UPDATE ${guild}Levels SET exp = ${newExp} WHERE id = ?`, [
          user.id,
        ])
        .then(level_up(rows, user, guild));
    }

    async function level_up(rows, user, guild) {
      xp = rows[0].exp;
      lvl_start = rows[0].level;
      lvl_end = 5 * lvl_start ** 2 + 50 * lvl_start + 100 - xp;

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
      //await check_level_reward(rows, message);
    }

    if (message.content.startsWith(".addBump")) {
      const roleName = "bumper";
      const guild = message.guild;
      const role = guild.roles.cache.find((role) => role.name === roleName);
      if (!role) {
        await guild.roles
          .create({
            name: roleName,
          })
          .then((createdRole) => {
            console.log(`Role created: ${createdRole.name}`);
            message.channel.send(`I created the role ${createdRole.name}`);
            message.member.roles.add(createdRole);
            message.reply(
              `I gave you the role. remove the role using \`.delBump\``
            );
          })
          .catch(console.error);
      } else {
        message.member.roles.add(role).then(() => {
          message.reply(
            `I gave you the role. remove the role using \`.delBump\``
          );
        });
      }
    }
    if (message.content.startsWith(".delBump")) {
      const roleName = "bumper";
      const role = message.guild.roles.cache.find(
        (role) => role.name === roleName
      );

      message.member.roles.remove(role).then(() => {
        message.reply(
          `I removed the role. If you want to be reminded of bumps, use \`.addBump\``
        );
      });
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
    console.log(e);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    conn
      .promise()
      .query(
        `SELECT * FROM ${interaction.guild.id}Settings WHERE command = ?`,
        [command.command.data.name]
      )
      .then(async ([rows, fields]) => {
        if (rows[0].turnedOn == 0) {
          interaction.reply({
            content:
              "This command is not turned on in this server. Contact the server owner if you're interested in this command.",
            ephemeral: true,
          });
          return;
        } else {
          await command.command.execute(client, interaction, conn);
        }
      });
  } catch (error) {
    console.error(error);
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

function createDatabases(familyTable, rpTable, suggestionTable) {
  // ------------------ Family Table ----------------
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
      conn
        .promise()
        .query(`SELECT * FROM ${message.guild.id}Currency WHERE id=?`, [userid])
        .then(async function ([rows, fields]) {
          oldCash = rows[0].cash;
          newCash = oldCash + randomMoney;
          conn
            .promise()
            .query(
              `UPDATE ${message.guild.id}Currency SET cash = ${newCash} WHERE id=${userid}`
            );
          counter = 0;
          randNumber = number[Math.floor(Math.random() * number.length)];
        });
    } else {
      //console.log(`nothing to pick: ${dropMessage}`)
      message.delete();
    }
  }
}

client.login(process.env.BOT_TOKEN);
