const { MongoClient, ServerApiVersion, Schema } = require("mongodb");
const uri =
  "mongodb+srv://ehzgodd:WesleyEnMaga2012@cluster0.bp8ci8c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const userDocuments = [
  {
    id: "user1CurrencyId", // Ensure unique IDs
    user: "User1",
    guild: "Guild1",
    userName: "UserName1",
    bank: 1500,
    cash: 250,
    bitcoin: 1,
  },
  {
    id: "user2CurrencyId",
    user: "User2",
    guild: "Guild2",
    userName: "UserName2",
    bank: 1200,
    cash: 500,
    bitcoin: 2,
  },
  // Add as many user documents as needed
];

const validationOptions = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user", "guild", "userName"],
      properties: {
        user: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        guild: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        userName: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        bank: {
          bsonType: "int",
          description: "must be an integer",
        },
        cash: {
          bsonType: "int",
          description: "must be an integer",
        },
        bitcoin: {
          bsonType: "int",
          description: "must be an integer",
        },
      },
    },
  },
};

async function main() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("test");

    // find query
    const query = { bank: { $gt: 1000 } };
    await createCollectionWithOptions(
      client,
      "newDatabase",
      "currencies",
      validationOptions
    );
    await addDocuments(client, "newDatabase", "currencies");
    await findUsers(client, "newDatabase", query);
  } finally {
    await client.close();
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
