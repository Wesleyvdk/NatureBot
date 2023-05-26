/* eslint-disable comma-dangle */
/* eslint-disable indent */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./dev-config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("additem")
    .setDescription("Add items to database")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("sets the name of the item")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("item category")
        .setRequired(true)
        .addChoices(
          { name: "Helmet", value: "helmet" },
          { name: "Chestplate", value: "chestplate" },
          { name: "Pants", value: "pants" },
          { name: "Boots", value: "boots" },
          { name: "Weapon", value: "weapon" },
          { name: "Potion", value: "potion" },
          { name: "Ring", value: "ring" },
          { name: "Amulet", value: "amulet" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("set the rarity of the item")
        .setRequired(true)
        .addChoices(
          { name: "Common", value: "common" },
          { name: "Uncommon", value: "uncommon" },
          { name: "Rare", value: "rare" },
          { name: "Epic", value: "epic" },
          { name: "Legendary", value: "legendary" },
          { name: "Fabled", value: "fabled" },
          { name: "Mythic", value: "mythic" }
        )
    )
    .addIntegerOption((option) =>
      option.setName("mindmg").setDescription("sets minimum damage item does")
    )
    .addIntegerOption((option) =>
      option.setName("maxdmg").setDescription("sets maximum damage item does")
    )
    .addStringOption((option) =>
      option.setName("stats").setDescription("sets stats")
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    // for (let i = 0; i < commands.length; i++) {
    //   console.log(commands[i].name);
    //   console.log(commands[i].description);
    // }

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
