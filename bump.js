const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require("discord.js");
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
require("dotenv").config();
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
  const keyword = "Bump done";
  const roleName = "bumper";
  const role = message.guild.roles.cache.find((role) => role.name === roleName);
  const embed = message.embeds[0];
  try {
    if (embed) {
      if (message.channel.id === "1176067648006672394") {
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
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});

client.login(process.env.BOT_TOKEN);
