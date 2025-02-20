import { Collection, Client } from "discord.js";

export interface Command {
  data: CommandData;
  execute: (client: Client, interaction: any, browser: any) => void;
  // Add other properties as needed
}

interface CommandData {
  options: any[];
  name: string;
  name_localizations: Collection<string, string>;
  description: string;
  description_localizations: Collection<string, string>;
  default_permission: any;
  default_member_permissions: any;
  dm_permission: any;
  nsfw: boolean;
}
