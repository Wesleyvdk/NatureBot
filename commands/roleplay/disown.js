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
        .setName("disown")
        .setDescription("disown another user")
        // CHANGE TO LIST
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("user you want to disown")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        await interaction.deferReply();
        const mentioned = interaction.options.getUser("target");
        const mentionedId = mentioned.id;
        userid = interaction.user.id;
        user = interaction.user;
        let rUser = client.getFamily.get(userid);
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
        if (!rMentioned) {
            rMentioned = {
                id: `${mentionedid}`,
                user: mentioned.username,
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
        const children = [
            rUser.child1,
            rUser.child2,
            rUser.child3,
            rUser.child4,
            rUser.child5,
        ];
        if (children.includes(mentionedId)) {
            let index = children.indexOf(mentionedId);
            const embed = new EmbedBuilder().setDescription(
                `I'm sad to say that ${mentioned.username} is not your child anymore.`
            );
            interaction.editReply({ embeds: [embed] });
            if (rUser.child1 === mentionedId) {
                rUser.child1 = null;
                rUser.child1Name = null;
                rMentioned.parent1 = null;
                rMentioned.parent1Name = null;
                rMentioned.parent2 = null;
                rMentioned.parent2Name = null;
            } else if (rUser.child2 === mentionedId) {
                rUser.child2 = null;
                rUser.child2Name = null;
                rMentioned.parent1 = null;
                rMentioned.parent1Name = null;
                rMentioned.parent2 = null;
                rMentioned.parent2Name = null;
            } else if (rUser.child3 === mentionedId) {
                rUser.child3 = null;
                rUser.child3Name = null;
                rMentioned.parent1 = null;
                rMentioned.parent1Name = null;
                rMentioned.parent2 = null;
                rMentioned.parent2Name = null;
            } else if (rUser.child4 === mentionedId) {
                rUser.child4 = null;
                rUser.child4Name = null;
                rMentioned.parent1 = null;
                rMentioned.parent1Name = null;
                rMentioned.parent2 = null;
                rMentioned.parent2Name = null;
            } else if (rUser.child5 === mentionedId) {
                rUser.child5 = null;
                rUser.child5Name = null;
                rMentioned.parent1 = null;
                rMentioned.parent1Name = null;
                rMentioned.parent2 = null;
                rMentioned.parent2Name = null;
            }
            client.setFamily.run(rUser);
            client.setFamily.run(rMentioned);
        } else {
            const embed = new EmbedBuilder().setDescription(
                `${mentioned.username} is not your child`
            );
            interaction.editReply({ embeds: [embed] });
        }

    },
};
