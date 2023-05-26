/* eslint-disable comma-dangle */
/* eslint-disable indent */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("sends the help page"),
  new SlashCommandBuilder()
    .setName("starttruthordare")
    .setDescription(
      "give details about what you want. once we accept this, we'll notify you about it."
    ),
  new SlashCommandBuilder()
    .setName("tdquestion")
    .setDescription("asks a user a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Enter some text")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("level")
    .setDescription("shows the user's level"),
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("shows the leaderboard"),
  new SlashCommandBuilder()
    .setName("balance")
    .setDescription("shows the current balance of the user")
    .addUserOption((option) =>
      option.setName("user").setDescription("select a user")
    ),
  new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("deposits balance to the bank")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("specifies the amount to deposit")
    ),
  new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("deposits balance to the bank")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("specifies the amount to deposit")
    ),
  new SlashCommandBuilder()
    .setName("give")
    .setDescription("gives a specific amount to another user")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("specifies the amount to give")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to give to")
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName("shop").setDescription("shows the shop"),
  new SlashCommandBuilder()
    .setName("marry")
    .setDescription("marry another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("select user you want to marry")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("divorce another user"),
  new SlashCommandBuilder()
    .setName("partner")
    .setDescription("shows your partner, or the partner of another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("select user you want to know the partner of")
    ),
  new SlashCommandBuilder()
    .setName("adopt")
    .setDescription("adopt another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to adopt")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("disown")
    .setDescription("disown another user")
    // CHANGE TO LIST
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to disown")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("children")
    .setDescription("shows your children, or the children of another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("select user you want to know the children of")
    ),
  new SlashCommandBuilder()
    .setName("boop")
    .setDescription("boop another user")
    .addUserOption((option) =>
      option.setName("target").setDescription("user you want to boop")
    ),
  new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("kiss another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to kiss")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("hug")
    .setDescription("hug another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to hug")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("handholding")
    .setDescription("hold hands with another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to hold hands with")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("spank")
    .setDescription("spanks another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to spank")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("slap")
    .setDescription("slaps another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to slap")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("pat")
    .setDescription("pet another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user you want to pat")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("cry")
    .setDescription("cry or cries at another user")
    .addUserOption((option) =>
      option.setName("target").setDescription("user you want to cry at")
    ),
  new SlashCommandBuilder()
    .setName("start")
    .setDescription("start your adventure"),
  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("show's the user's battle profile"),
  new SlashCommandBuilder()
    .setName("suggestion")
    .setDescription("suggestions")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("send a suggestion for the bot to developer")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("set the command category of the suggestion ")
            .setRequired(true)
            .addChoices(
              { name: "Economy", value: "economy" },
              { name: "Roleplay", value: "roleplay" },
              { name: "Battle game", value: "battlegame" },
              { name: "Other", value: "other" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("suggestion")
            .setDescription("suggestion")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("list all active suggestions")
        .addStringOption((option) =>
          option
            .setName("order")
            .setDescription("choose the order of the suggestions")
            .setRequired(true)
            .addChoices(
              { name: "Default", value: "default" },
              { name: "User", value: "user" },
              //{ name: "Date Added", value: "dateAdded" },
              { name: "Category", value: "category" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("shows all the suggestions posted for a category")
            .addChoices(
              { name: "Economy", value: "economy" },
              { name: "Roleplay", value: "roleplay" },
              { name: "Battle Game", value: "battlegame" },
              { name: "Other", value: "other" }
            )
        )
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
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
