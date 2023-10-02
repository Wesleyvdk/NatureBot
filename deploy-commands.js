import { REST, Routes } from 'discord.js';

const commands = [
    {
        name: 'bored',
        description: 'Replies with an activity!',
    },
    {
        name: "uno",
        description: 'uno'
    },
    {
        name: "codechallenge",
        description: "Shares a random coding challenge for programmers.",
    },
    {
        name: "technews",
        description: "Provides the latest news in technology.Provides the latest news in technology."
    },
    {
        name: "weather",
        description: "Gives current weather for a specified location."
    },
];

const rest = new REST({ version: '10' }).setToken("ODk0OTA2MDQ2MzgzMDE3OTk0.GT9kFq.1yiIzR6Id1ZdkT7iW3IRHL4LO6rRgQkkdYYxWU");

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("894906046383017994"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}