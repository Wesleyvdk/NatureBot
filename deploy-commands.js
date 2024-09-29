import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
config();
import moment from "moment/moment.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

let CurrentDate = moment().format();

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const __dirname = dirname(fileURLToPath(import.meta.url));
//const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync("./commands");

const token = process.env.BOT_TOKEN;

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  //const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js") || file.endsWith(".mjs"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = await import(`./commands/${folder}/${file}`);
    const command = filePath;
    console.log(command);
    if (command.default.data && command.default.execute) {
      commands.push(command.default.data.toJSON());
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
