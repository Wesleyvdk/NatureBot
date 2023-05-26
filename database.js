const db = require("better-sqlite3");
const ldb = new db("../databases/levels.sqlite");
const cdb = new db("../databases/currency.sqlite");
const fdb = new db("../databases/family.sqlite");
const rdb = new db("../databases/roleplay.sqlite");
const battleDB = new db("../databases/battlegame.sqlite");
const suggestionDB = new db("../databases/suggestion.sqlite");

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
createDatabases(
  levelTable,
  currencyTable,
  familyTable,
  rpTable,
  bgPlayerTable,
  bgLootTable,
  suggestionTable
);

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
