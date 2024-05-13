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

import bumpHandler from "./handlers/bumpHandler.js";

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
  bumpHandler();
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
        .catch((e) => {
          errorHandler(null, e, message);
        });
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
});

client.login(process.env.BOT_TOKEN);
