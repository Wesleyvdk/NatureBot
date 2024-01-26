const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();
const moment = require("moment/moment");

let CurrentDate = moment().format();

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

const token = process.env.BOT_TOKEN;

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    // for guild-based commands
    await rest
      .put(
        Routes.applicationGuildCommands(
          process.env.CLIENTID,
          process.env.GUILDID
        ),
        {
          body: [],
        }
      )
      .then(() => console.log("Successfully deleted all guild commands."))
      .catch(console.error);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENTID),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (e) {
    // And of course, make sure you catch and log any errors!
    console.log(`Error: ${e}`);
    console.log(`Date/Time: ${CurrentDate}`);
  }
})();
