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

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("shows the shop"),
    async execute(client, interaction) {
        await interaction.deferReply();
        const shopembed = new EmbedBuilder()
            .setDescription("The shop is empty right now")
            .setFooter({ text: "leave some shop suggestions behind" });
        interaction.editReply({ embeds: [shopembed] });

    },
};
