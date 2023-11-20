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
        .setName("level")
        .setDescription("shows the user's level"),
    async execute(client, interaction) {
        await interaction.deferReply();
        userid = interaction.user.id;
        user = interaction.user;
        username = user.username;
        let rUser = client.getLevels.get(userid, interaction.guild.id);
        if (!rUser) {
            rUser = {
                id: `${interaction.guild.id}-${userid}`,
                user: userid,
                guild: interaction.guild.id,
                userName: username,
                level: 0,
                experience: 0,
            };
        }
        xp = rUser.experience;
        lvl_start = rUser.level;
        lvl_end = 5 * lvl_start ** 2 + 50 * lvl_start + 100 - xp;
        const embed = new EmbedBuilder();
        embed
            .setDescription(`your current level is ${lvl_start}`)
            .setFooter({ text: `current xp: ${xp} || xp till next: ${lvl_end}` }),
            interaction.editReply({
                embeds: [embed],
            });

    },
};
