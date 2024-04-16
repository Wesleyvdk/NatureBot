const { MongoClient, ServerApiVersion } = require("mongodb");
const mysql = require("mysql2");
require("dotenv").config();

const uri = process.env.MONGODB;
const conn = mysql.createConnection(process.env.DATABASE_URL);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
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
          console.log("Skipping table: " + table.TABLE_NAME);
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
    await client.close();
    await conn.end();
  }
}

async function findUsers(client, dbName, query) {
  const db = client.db(dbName);
  const collection = db.collection("currencies");

  // additional options
  // const options = {
  // sort: { userName: 1 }, // Sort alphabetically by userName
  // limit: 10 // Limit the results to 10 documents
  // };

  // Use with find
  // const documents = await collection.find(query, options).toArray();

  try {
    const documents = await collection.find(query).toArray();
    console.log("Found documents:", documents);
  } catch (error) {
    console.error("Error finding documents:", error);
  }
}

async function createCollectionWithOptions(
  client,
  dbName,
  collectionName,
  options
) {
  const db = client.db(dbName);

  try {
    await db.createCollection(collectionName, options);
    console.log(`Collection with options created: ${collectionName}`);
  } catch (error) {
    console.error(`Could not create collection with options: ${error}`);
  }
}

async function addDocuments(client, dbName, collectionName) {
  // Insert a document
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const insertResult = await collection.insertMany(userDocuments); // insertOne for one document
  console.log("Number of documents inserted:", insertResult.insertedCount);
}

main().catch(console.dir);
