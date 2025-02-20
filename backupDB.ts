import { PrismaClient } from "@prisma/client";
import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";
import moment from "moment";

config(); // Load .env variables

const prisma = new PrismaClient();
const mongoClient = new MongoClient(process.env.MONGODB || "", {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function main() {
  console.log("Started backup at: ", moment().format());

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db("Aylani");
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;
      const match = collectionName.match(/^(\d+)([A-Za-z]+)$/); // Extract guildId and type (e.g., "1124304256518848543Levels")

      if (!match) continue; // Skip if not matching expected format

      const guildId = match[1]; // Extract guild ID from collection name
      const type = match[2]; // Extract type (Levels, Currency, etc.)

      console.log(`Processing: Guild ${guildId}, Type: ${type}`);

      const documents = await db.collection(collectionName).find().toArray();

      for (const doc of documents) {
        if (type === "Levels") {
          await prisma.levels.upsert({
            where: { id: doc._id.toString() },
            update: { userId: doc._id.toString(), guildId, name: doc.name, exp: doc.exp, level: doc.level },
            create: { id: doc._id.toString(), userId: doc._id.toString(), guildId, name: doc.name, exp: doc.exp, level: doc.level },
          });
        } else if (type === "Currency") {
          await prisma.currency.upsert({
            where: { id: doc._id.toString() },
            update: { userId: doc._id.toString(), guildId, name: doc.name, bank: doc.bank, cash: doc.cash, bitcoin: doc.bitcoin },
            create: { id: doc._id.toString(), userId: doc._id.toString(), guildId, name: doc.name, bank: doc.bank, cash: doc.cash, bitcoin: doc.bitcoin },
          });
        } else if (type === "Settings") {
          await prisma.settings.upsert({
            where: { id: doc._id.toString() },
            update: {
              guildId,
              command: doc.command,
              category: doc.category,
              turnedOn: Boolean(doc.turnedOn) // Convert int to boolean
            },
            create: {
              id: doc._id.toString(),
              guildId,
              command: doc.command,
              category: doc.category,
              turnedOn: Boolean(doc.turnedOn) // Convert int to boolean
            },
          });
        }
      }
    }

    console.log("Backup completed successfully at: ", moment().format());
  } catch (error) {
    console.error("Error during backup:", error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
    console.log("Connections closed.");
  }
}

// Run backup every 12 hours
main().catch(console.error);
setInterval(() => {
  main().catch(console.error);
}, 12 * 60 * 60 * 1000);
