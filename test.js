const { MongoClient, ServerApiVersion } = require("mongodb");
const mysql = require("mysql2");
require("dotenv").config();
const moment = require("moment/moment");
async function main() {
  console.log("Started backup at: ", moment().format());
  const conn = mysql.createConnection(process.env.DATABASE_URL);
  const uri = process.env.MONGODB;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    conn.connect(function (err) {
      if (err) throw err;
      console.log("Succesfully connected to PlanetScale!");
    });
    const db = client.db("Aylani");

    const [tables] = await conn
      .promise()
      .query(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'naturebot'"
      );

    for (table of tables) {
      const [rows] = await conn
        .promise()
        .query(`SELECT * FROM \`${table.TABLE_NAME}\``);

      for (row of rows) {
        if (table.TABLE_NAME.includes("Levels")) {
          if (db.collection(table.TABLE_NAME).findOne({ _id: row.id })) {
            await client
              .db("Aylani")
              .collection(table.TABLE_NAME)
              .updateOne(
                { _id: row.id },
                { $set: { name: row.name, exp: row.exp, level: row.level } }
              );
          } else {
            await client.db("Aylani").collection(table.TABLE_NAME).insertOne({
              _id: row.id,
              name: row.name,
              exp: row.exp,
              level: row.level,
            });
          }
        }
        if (table.TABLE_NAME.includes("Currency")) {
          if (db.collection(table.TABLE_NAME).findOne({ _id: row.id })) {
            await client
              .db("Aylani")
              .collection(table.TABLE_NAME)
              .updateOne(
                { _id: row.id },
                { $set: { name: row.userName, exp: row.exp, level: row.level } }
              );
          } else {
            await client.db("Aylani").collection(table.TABLE_NAME).insertOne({
              _id: row.id,
              name: row.userName,
              bank: row.bank,
              cash: row.cash,
              bitcoin: row.bitcoin,
            });
          }
        }
        if (table.TABLE_NAME.includes("Settings")) {
          if (db.collection(table.TABLE_NAME).findOne({ _id: row.id })) {
            await client
              .db("Aylani")
              .collection(table.TABLE_NAME)
              .updateOne(
                { _id: row.id },
                {
                  $set: {
                    command: row.command,
                    category: row.category,
                    turnedOn: row.turnedOn,
                  },
                }
              );
          } else {
            await client.db("Aylani").collection(table.TABLE_NAME).insertOne({
              _id: row.id,
              command: row.command,
              category: row.category,
              turnedOn: row.turnedOn,
            });
          }
        }
        if (table.TABLE_NAME.includes("sixmans")) {
          if (db.collection(table.TABLE_NAME).findOne({ _id: row.id })) {
            await client
              .db("Aylani")
              .collection(table.TABLE_NAME)
              .updateOne(
                { _id: row.id },
                {
                  $set: {
                    name: row.name,
                    amount: row.amount,
                    wins: row.wins,
                    loss: row.loss,
                    perc: row.perc,
                  },
                }
              );
          } else {
            await client.db("Aylani").collection(table.TABLE_NAME).insertOne({
              _id: row.id,
              name: row.name,
              amount: row.amount,
              wins: row.wins,
              loss: row.loss,
              perc: row.perc,
            });
          }
        }

        if (
          table.TABLE_NAME.includes("stories") ||
          table.TABLE_NAME.includes("users") ||
          table.TABLE_NAME.includes("config") ||
          table.TABLE_NAME.includes("bot_commands")
        ) {
        }
      }
    }

    const [rows] = await conn.promise().query("SELECT * FROM levels");
    for (row of rows) {
      if (db.collection("ophiussaLevels").findOne({ _id: row.id })) {
        await client
          .db("Aylani")
          .collection("ophiussaLevels")
          .updateOne(
            { _id: row.id },
            {
              $set: {
                name: row.name,
                exp: row.exp,
                level: row.level,
              },
            }
          );
      } else {
        let instered = await client
          .db("Aylani")
          .collection("ophiussaLevels")
          .insertOne({
            _id: row.id,
            name: row.name,
            exp: row.exp,
            level: row.level,
          });
      }
    }
  } finally {
    await client.close().then(() => console.log("MongoDB connection closed"));
    await conn.end();
    console.log("Backup completed at: ", moment().format());
  }
}

main().catch(console.dir);
setInterval(() => {
  main().catch(console.dir);
}, 12 * 60 * 60 * 1000);
