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
        .setName("cry")
        .setDescription("cry or cries at another user")
        .addUserOption((option) =>
            option.setName("target").setDescription("user you want to cry at")
        ),
    async execute(client, interaction) {
        await interaction.deferReply();
        //all url's of the gifs
        let gifs = ["https://media.giphy.com/media/ROF8OQvDmxytW/source.gif"];
        //will calculate which one to send
        const random = gifs[Math.floor(Math.random() * gifs.length)];
        //sends the random message =

        userid = interaction.user.id;
        user = interaction.user;
        let rUser = client.getRoleplay.get(userid, interaction.guild.id);
        let mentioned = interaction.options.getUser("target");
        if (!mentioned) {
            if (!rUser) {
                rUser = {
                    id: `${interaction.guild.id}-${userid}`,
                    user: userid,
                    guild: interaction.guild.id,
                    kissed: 0,
                    gkissed: 0,
                    boop: 0,
                    gboop: 0,
                    hugged: 0,
                    ghugged: 0,
                    cried: 0,
                    gcried: 0,
                    holdhands: 0,
                    gholdhands: 0,
                    pet: 0,
                    gpet: 0,
                    slapped: 0,
                    gslapped: 0,
                    spanked: 0,
                    gspanked: 0,
                    partner: null,
                    date: null,
                };
            }
            rUser.cried++;
            client.setRoleplay.run(rUser);
            let embed1 = new EmbedBuilder()
                .setColor("#fc05cb")
                .setFooter({ text: `${user.username} cried ${rUser.cried} times` })
                //embed.setTimestamp();
                .setTitle(`${user.username} is crying`)
                .setImage(random);
            interaction.reply({ embeds: [embed1] });
        } else {
            mentionedid = mentioned.id;
            let rMentioned = client.getRoleplay.get(
                mentionedid,
                interaction.guild.id
            );
            if (!rUser) {
                rUser = {
                    id: `${interaction.guild.id}-${userid}`,
                    user: userid,
                    guild: interaction.guild.id,
                    kissed: 0,
                    gkissed: 0,
                    boop: 0,
                    gboop: 0,
                    hugged: 0,
                    ghugged: 0,
                    cried: 0,
                    gcried: 0,
                    holdhands: 0,
                    gholdhands: 0,
                    pet: 0,
                    gpet: 0,
                    slapped: 0,
                    gslapped: 0,
                    spanked: 0,
                    gspanked: 0,
                    partner: null,
                    date: null,
                };
            }
            if (!rMentioned) {
                rMentioned = {
                    id: `${interaction.guild.id}-${mentionedid}`,
                    user: mentionedid,
                    guild: interaction.guild.id,
                    kissed: 0,
                    gkissed: 0,
                    boop: 0,
                    gboop: 0,
                    hugged: 0,
                    ghugged: 0,
                    cried: 0,
                    gcried: 0,
                    holdhands: 0,
                    gholdhands: 0,
                    pet: 0,
                    gpet: 0,
                    slapped: 0,
                    gslapped: 0,
                    spanked: 0,
                    gspanked: 0,
                    partner: null,
                    date: null,
                };
            }
            rUser.cried++;
            rMentioned.gcried++;
            client.setRoleplay.run(rUser);
            client.setRoleplay.run(rMentioned);
            let embed = new EmbedBuilder()
                .setColor("#fc05cb")
                .setFooter({
                    text: `${user.username} cried at others ${rUser.cried} times and ${mentioned.username} got cried at ${rMentioned.gcried} times`,
                })
                //embed.setTimestamp();
                .setTitle(`${user.username} cries at ${mentioned.username}`)
                .setImage(random);
            interaction.editReply({ embeds: [embed] });
        }

    },
};
