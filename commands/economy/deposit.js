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
        .setName("deposit")
        .setDescription("deposits balance to the bank")
        .addIntegerOption((option) =>
            option.setName("amount").setDescription("specifies the amount to deposit")
        ),
    async execute(client, interaction) {
        await interaction.deferReply();
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
        if (!amount) {
            oldCash = rUser.cash;
            oldBank = rUser.bank;
            newBank = Number(oldCash) + Number(oldBank);
            newCash = 0;
            rUser.cash = newCash;
            rUser.bank = newBank;
            const balEmbed = new EmbedBuilder();
            balEmbed.setDescription(
                `Your new balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
            );
            interaction.editReply({ embeds: [balEmbed] });
            client.setCurrency.run(rUser);
        } else if (amount > rUser.cash) {
            interaction.editReply(
                `you have insufficient cash, your cash is: ${rUser.cash}`
            );
        } else if (amount < rUser.cash) {
            let oldCash = rUser.cash;
            let oldBank = rUser.bank;
            await oldBank;
            await oldCash;
            deposit(oldCash, oldBank, amount);
            rUser.bank = newBank;
            rUser.cash = newCash;
            const balEmbed = new EmbedBuilder();
            balEmbed.setDescription(
                `Your new balance:\nbank: ${rUser.bank}\ncash: ${rUser.cash}\nbitcoin ${rUser.bitcoin}`
            );
            interaction.editReply({ embeds: [balEmbed] });
            client.setCurrency.run(rUser);
        }
        function deposit(oldCash, oldBank, amount) {
            newCash = oldCash - amount;
            newBank = Number(`${oldBank}`) + Number(`${amount}`);
        }

    },

};
