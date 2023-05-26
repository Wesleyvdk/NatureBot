const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { token } = require("./dev-config.json");
const db = require("better-sqlite3");

const ldb = new db("../databases/levels.sqlite");
const cdb = new db("../databases/currency.sqlite");
const fdb = new db("../databases/family.sqlite");
const rdb = new db("../databases/roleplay.sqlite");
const battleDB = new db("../databases/battlegame.sqlite");
const suggestionDB = new db("../databases/suggestion.sqlite");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  await getDatabases();
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (commandName === "suggestion") {
    if (interaction.options.getSubcommand() === "delete") {
      id = interaction.options.getInteger("id");
      Sugg = await client.getSuggestion.get(id);
      try {
        const embed = new EmbedBuilder()
          .setTitle("Are you sure you want to delete this suggestion?")
          .addFields(
            { name: "Suggestion", value: `${Sugg.suggestion}`, inline: true },
            { name: "Category", value: `${Sugg.category}`, inline: true }
          );
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("Delete")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        interaction.reply({ embeds: [embed], components: [button] });
        const Collector = interaction.channel.createMessageComponentCollector({
          componentType: ComponentType.Button,
        });
        Collector.on("collect", async (i) => {
          if (i.customId === "delete") {
            const $rowid = id;
            const deleteStatement = suggestionDB.prepare(
              `DELETE FROM suggestion WHERE id = ${$rowid}`
            );
            deleteStatement.run();
            i.reply("Deleted the suggestion from database");
          }
          if (i.customId === "cancel") {
            i.reply("cancelled");
          }
        });
        Collector.on("end", (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
});
// Log in to Discord with your client's token
client.login(token);

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
    "SELECT * FROM suggestion WHERE id = ?"
  );
  client.setSuggestion = suggestionDB.prepare(
    "INSERT OR REPLACE INTO suggestion (id, userID, suggestion, category, upvotes, downvotes, dateAdded) VALUES (@id, @userid, @suggestion, @category, @upvotes, @downvotes, @dateAdded);"
  );
  console.log(`suggestion table loaded successfully`);
}
