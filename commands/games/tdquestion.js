const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Embed,
    ButtonInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
    AttachmentBuilder,
} = require('discord.js');
lastAsked = "";
module.exports = {
    data: new SlashCommandBuilder()
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
    async execute(client, interaction, conn) {
        await interaction.deferReply();
        // interaction options
        const question = interaction.options.getString("question");
        const asked = interaction.options.getUser("user");

        // embed
        const embed = new EmbedBuilder();

        // T/D Channel ID
        const channelId = "1087005900352540702";
        const channel = await client.channels.fetch(channelId);

        // TD Role
        const member = interaction.member;
        const role = interaction.guild.roles.cache.find(
            (role) => role.name === "truth or dare"
        );

        if (!member.roles.cache.has(role.id)) {
            embed.setDescription(
                "you are not participating in the game. Join the game using the join button, or if no game is ongoing use /starttruthordare to start one"
            );
            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        } else if (interaction.channel.id != channel.id) {
            embed.setDescription(
                `you can't use this command in this channel. please use it in <#${channel.id}>`
            );
            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        } else if (lastAsked === "") {
            lastAsked = asked.id;
            embed.setDescription(question);
            embed.setTitle(
                `${interaction.user.username} asks ${asked.username} a question`
            );
            interaction.editReply({
                embeds: [embed],
            });
        } else if (lastAsked === interaction.user.id) {
            lastAsked = asked.id;
            embed.setDescription(question);
            embed.setTitle(
                `${interaction.user.username} asks ${asked.username} a question`
            );
            interaction.editReply({
                embeds: [embed],
            });
        } else {
            interaction.editReply({
                content: "this command is not available rn, wait for your turn",
                ephemeral: true,
            });
        }

    },
};
