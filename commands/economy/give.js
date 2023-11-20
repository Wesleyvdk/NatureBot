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
    async execute(client, interaction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");
        userid = interaction.user.id;
        user = interaction.user;
        username = user.username;
        let rUser = client.getCurrency.get(userid, interaction.guild.id);
        if (!rUser) {
            rUser = {
                id: `${interaction.guild.id}-${userid}`,
                user: userid,
                guild: interaction.guild.id,
                userName: username,
                bank: 0,
                cash: 0,
                bitcoin: 0,
            };
        }
        client.setCurrency.run(rUser);

        targetid = target.id;
        let targetinfo = `<@!${targetid}>`;
        let rTarget = client.getCurrency.get(targetid, interaction.guild.id);
        if (!rTarget) {
            rTarget = {
                id: `${interaction.guild.id}-${targetid}`,
                user: targetid,
                guild: interaction.guild.id,
                userName: target.username,
                bank: 0,
                cash: 0,
                bitcoin: 0,
            };
        }
        client.setCurrency.run(rTarget);
        if (amount > rUser.cash) {
            interaction.editReply({
                content: `you have insuficient cash! your current cash is: ${rUser.cash}`,
                ephemeral: true,
            });
        } else {
            let oldCashuser = rUser.cash;
            let oldCashTarget = rTarget.cash;
            newCashTarget = Number(`${oldCashTarget}`) + Number(`${amount}`);
            newCashuser = oldCashuser - amount;
            rUser.cash = newCashuser;
            rTarget.cash = newCashTarget;
            const giveEmbed = new EmbedBuilder()
                .setDescription(`${user} gave ${amount} to ${target}`)
                .setTimestamp();
            interaction.editReply({ embeds: [giveEmbed] });
            client.setCurrency.run(rUser);
            client.setCurrency.run(rTarget);
        }

    },
};
