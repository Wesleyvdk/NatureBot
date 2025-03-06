import { REST, Routes } from "discord.js";
import fs from "node:fs";
import { config } from "dotenv";
import { Command } from "./types";
config();

export const commands: Command[] = [];
const tempCommands: any[] = [];

const commandFolders = fs.readdirSync("./commands");

const token: string = process.env.BOT_TOKEN || "";
const clientId: string = process.env.CLIENTID || "";

(async () => {
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = await import(`./commands/${folder}/${file}`);
      const command = filePath;
      try {
        if (command.default.data && command.default.execute) {
          commands.push({
            data: command.default.data.toJSON(),
            execute: command.default.execute,
          });
          tempCommands.push(command.default.data.toJSON());
        } else {
          if (!command.default.data)
            console.log(
              `[WARNING] The command at ${JSON.stringify(
                filePath
              )} is missing a required data property`
            );
          if (!command.default.execute)
            console.log(
              `[WARNING] The command at ${JSON.stringify(
                filePath
              )} is missing a required execute property`
            );
        }
      } catch (e) {
        console.log(`failed for command ${JSON.stringify(command)} at ${JSON.stringify(file)}`)
      }
    }
  }

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const data: any = await rest.put(Routes.applicationCommands(clientId), {
      body: tempCommands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
