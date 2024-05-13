import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});
import { config } from "dotenv";
config();
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {});

client.login(process.env.BOT_TOKEN);
