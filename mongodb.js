const mongoose = require("mongoose");
require("dotenv").config();
const mysql = require("mysql2/promise");
const conn = mysql.createConnection(process.env.DATABASE_URL);
Main().catch((e) => console.error(e));

async function Main() {
  conn.connect(function (err) {
    if (err) throw err;
    console.log("Succesfully connected to PlanetScale!");
  });
  mongoose
    .connect(
      "mongodb+srv://ehzgodd:WesleyEnMaga2012@cluster0.bp8ci8c.mongodb.net/Aylani?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

  const Schema = mongoose.Schema;

  const currencySchema = new Schema({
    id: { type: String, required: true, unique: true },
    user: String,
    guild: String,
    userName: String,
    bank: Number,
    cash: Number,
    bitcoin: Number,
  });
  const Currency = mongoose.model("Currency", currencySchema);
  const levelsSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    xp: { type: Number },
    level: { type: Number },
  });
  const Levels = mongoose.model("Level", levelsSchema);

  const Banana = mongoose.model("Banana", new Schema({ name: String }));
  const bananaRecord = Banana.insertMany([
    { name: "Banana1" },
    { name: "Banana2" },
  ]);
  createLevelsRecord(Levels);
  insertAndExtractCurrencyFromSQLtoMongoDB(Currency);
}

async function createLevelsRecord(Levels) {
  const levelsRecord = Levels.insertMany([
    {
      id: "123421424215215",
      name: "ehzgodd",
      xp: 100,
      level: 1,
    },
    { id: "132412124251", name: "vampy", xp: 200, level: 2 },
  ])
    .then(() => console.log(levelsRecord))
    .catch((e) => console.error("Error saving the levels record: ", e));
}

async function insertAndExtractCurrencyFromSQLtoMongoDB(Currency) {
  const currencyRecord = Currency.insertMany([
    {
      id: "uniqueCurrencyId123", // Make sure this is unique
      user: "User123",
      guild: "Guild456",
      userName: "UserName789",
      bank: 1000,
      cash: 500,
      bitcoin: 2,
    },
    {
      id: "uniqueCurrencyId456",
      user: "User456",
      guild: "Guild789",
      userName: "userName123",
      bank: 2000,
      cash: 1000,
      bitcoin: 5,
    },
  ])
    .then(() => console.log(currencyRecord))
    .catch((error) =>
      console.error("Error saving the currency record:", error)
    );
}
