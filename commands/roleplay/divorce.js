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
        .setName("divorce")
        .setDescription("divorce another user"),
    async execute(client, interaction) {
        await interaction.deferReply();
        let breakupmsg = [
            "Let's break up.",
            "I don't think this is working out.",
            "Roses are red. Violets are blue. I used to love you but not anymore.",
        ];
        let noone = [
            `you can't divorce no one`,
            `maybe try finding a partner first`,
            `a relationship doesn't come to you like magic`,
        ];
        userid = interaction.user.id;
        user = interaction.user;
        let rUser = client.getFamily.get(userid);
        mentionedid = rUser.partnerID;
        let rMentioned = client.getFamily.get(mentionedid);

        if (!rUser) {
            rUser = {
                id: `${userid}`,
                user: user.username,
                partnerID: null,
                partnerName: null,
                date: null,
                parent1: null,
                parent1Name: null,
                parent2: null,
                parent2Name: null,
                child1: null,
                child1Name: null,
                child2: null,
                child2Name: null,
                child3: null,
                child3Name: null,
                child4: null,
                child4Name: null,
                child5: null,
                child5Name: null,
            };
        }
        if (!rUser.partnerID) {
            const randomnoone = noone[Math.floor(Math.random() * noone.length)];
            interaction.editReply(randomnoone);
        } else {
            udivorceid = rUser.partnerID;
            udivorcename = rUser.partnerName;
            const randomBreak =
                breakupmsg[Math.floor(Math.random() * breakupmsg.length)];
            breakupEmbed = new EmbedBuilder()
                .setDescription(rUser.partnerName + ", " + randomBreak)
                .setTimestamp();

            interaction.editReply({ embeds: [breakupEmbed] });
            //message.channel.send(udivorcename.username + ', ' + randomBreak)
            rMentioned.partnerID = null;
            rMentioned.partnerName = null;
            rUser.partnerID = null;
            rUser.partnerName = null;
            rUser.date = null;
            rMentioned.date = null;
            client.setFamily.run(rUser);
            client.setFamily.run(rMentioned);
        }

    },
};
