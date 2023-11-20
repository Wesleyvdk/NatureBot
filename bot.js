const fs = require("node:fs");
require('dotenv').config()
const path = require("node:path");
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
const ldb = new Database("./databases/levels.sqlite");
const cdb = new Database("./databases/currency.sqlite");
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
const PREFIX = "."

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
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}
client.once(Events.ClientReady, async () => {
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
        const guild = client.guilds.cache.get("937728755223367741");
        if (message.guild.id == guild) {
            if (message.author.bot) return;
            userid = message.author.id;
            username = message.author.username;
            user = message.author;
            conn
                .promise()
                .query(
                    "INSERT IGNORE INTO VampLevels(id, name, level, exp) VALUES (?,?, 1, 0)",
                    [userid, username]
                );

            conn
                .promise()
                .execute("SELECT * FROM `VampLevels` WHERE id=?", [userid])
                .then(async ([rows, fields]) => {
                    add_experience(rows);
                    level_up(rows, user);

                });
        }

        async function check_level_reward(rows, message) {
            const roles = [
                "Member",
                "Ai Novice",
                "HiRe Pro",
                "Promptologist",
                "Ai Pro",
                "LoRe Expert",
                "Ultimate Upscale Pro",
            ];
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
                    const role = guild.roles.cache.find(
                        (role) => role.name === "Member"
                    );
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
                    try {
                        const prevRole = guild.roles.cache.find(
                            (prevRole) => prevRole.name === "Ai Novice"
                        );
                        message.member.roles.remove(prevRole);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (rows[0].level === 15) {
                    const role = message.guild.roles.cache.find(
                        (role) => role.name === "Promptologist"
                    );
                    message.member.roles.add(role);
                    try {
                        const prevRole = guild.roles.cache.find(
                            (prevRole) => prevRole.name === "HiRe Pro"
                        );
                        message.member.roles.remove(prevRole);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (rows[0].level === 20) {
                    const role = guild.roles.cache.find(
                        (role) => role.name === "Ai Pro"
                    );
                    message.member.roles.add(role);
                    try {
                        const prevRole = guild.roles.cache.find(
                            (prevRole) => prevRole.name === "Promptologist"
                        );
                        message.member.roles.remove(prevRole);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (rows[0].level === 25) {
                    const role = guild.roles.cache.find(
                        (role) => role.name === "LoRe Expert"
                    );
                    message.member.roles.add(role);
                    try {
                        const prevRole = guild.roles.cache.find(
                            (prevRole) => prevRole.name === "Ai Pro"
                        );
                        message.member.roles.remove(prevRole);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (rows[0].level === 30) {
                    const role = guild.roles.cache.find(
                        (role) => role.name === "Ultimate Upscale Pro"
                    );
                    message.member.roles.add(role);
                    try {
                        const prevRole = guild.roles.cache.find(
                            (prevRole) => prevRole.name === "LoRe Expert"
                        );
                        message.member.roles.remove(prevRole);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        async function add_experience(rows) {
            exp = rows[0].exp;
            newExp = exp += 5;

            conn.query(`UPDATE VampLevels SET exp = ${newExp} WHERE id = ?`, [userid]);
        }

        async function level_up(rows, user) {
            xp = rows[0].exp;
            lvl_start = rows[0].level;
            lvl_end = 5 * lvl_start ** 2 + 50 * lvl_start + 100 - xp;

            let round = Math.floor(lvl_end);
            let lvl_up = Number(round);

            if (lvl_up < 0) {
              const channelId = "1173064790340534412";
              const channel = await client.channels.fetch(channelId);
                conn
                    .promise()
                    .query(
                        `UPDATE VampLevels SET level = ${rows[0].level} + 1 WHERE id = ?`,
                        [userid]
                    )
                    .then(

                        channel.send(
                            `${user} has leveled up to level ${rows[0].level + 1}`
                        )
                    );
            }
            await check_level_reward(rows, message);
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

        const keyword = "Bump done";
        const roleName = "bumper";
        const role = message.guild.roles.cache.find(
            (role) => role.name === roleName
        );
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

                        // Log the title and description of the embed
                        // console.log(`Title: ${embed.title}`);
                        // console.log(`Description: ${embed.description}`);
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

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction, conn);
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
        ldb.exec("PRAGMA journal_mode = WAL;");
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
        cdb.exec("PRAGMA journal_mode = WAL;");
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
    // ------------------ BG Player Table ----------------
    if (!bgPlayerTable["count()"]) {
        battleDB
            .prepare(
                "CREATE TABLE player (id TEXT PRIMARY KEY, user TEXT, guild TEXT, level INTEGER, class TEXT, equipedWeapon TEXT, equipedHelmet TEXT, equipedChestplate TEXT, equipedPants TEXT, equipedBoots TEXT);"
            )
            .run();
        battleDB.prepare("CREATE UNIQUE INDEX idx_player_id ON player (id);").run();
        battleDB.exec("PRAGMA journal_mode = WAL;");
    }
    // ------------------ BG Loot Table ----------------
    if (!bgLootTable["count()"]) {
        battleDB
            .prepare(
                "CREATE TABLE loot (id INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, item TEXT, rarity TEXT);"
            )
            .run();
        battleDB.prepare("CREATE UNIQUE INDEX idx_loot_id ON loot (id);").run();
        battleDB.exec("PRAGMA journal_mode = WAL;");
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
        let username = user.username;
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


client.login(process.env.BOT_TOKEN);