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
        .setName("kiss")
        .setDescription("kiss another user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("user you want to kiss")
                .setRequired(true)
        ),
    async execute(client, interaction) {

        await interaction.deferReply();
        let gifs = [
            "https://media1.tenor.com/images/d307db89f181813e0d05937b5feb4254/tenor.gif?itemid=16371489",
            "https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865",
            "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif",
            "https://media1.tenor.com/images/bc5e143ab33084961904240f431ca0b1/tenor.gif?itemid=9838409",
            "https://media1.tenor.com/images/b8d0152fbe9ecc061f9ad7ff74533396/tenor.gif?itemid=5372258",
            "https://media1.tenor.com/images/7fd98defeb5fd901afe6ace0dffce96e/tenor.gif?itemid=9670722",
            "https://media.tenor.com/images/9fb52dbfd3b7695ae50dfd00f5d241f7/tenor.gif",
            "https://media1.tenor.com/images/9fac3eab2f619789b88fdf9aa5ca7b8f/tenor.gif?itemid=12925177",
            "https://media1.tenor.com/images/632a3db90c6ecd87f1242605f92120c7/tenor.gif?itemid=5608449",
            "https://media1.tenor.com/images/61dba0b61a2647a0663b7bde896c966c/tenor.gif?itemid=5262571",
            "https://media1.tenor.com/images/37633f0b8d39daf70a50f69293e303fc/tenor.gif?itemid=13344412",
        ];
        //will calculate which one to send
        const random = gifs[Math.floor(Math.random() * gifs.length)];
        //sends the random message
        let mentioned = interaction.options.getUser("target");
        mentionedid = mentioned.id;
        userid = interaction.user.id;
        user = interaction.user;
        let rUser = client.getRoleplay.get(userid, interaction.guild.id);
        let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
        if (!rUser) {
            rUser = {
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
        rUser.kissed++;
        rMentioned.gkissed++;
        client.setRoleplay.run(rUser);
        client.setRoleplay.run(rMentioned);
        let embed = new EmbedBuilder();
        embed.setColor("#fc05cb");
        embed.setFooter({
            text: `${user.username} kissed others ${rUser.kissed} times and ${mentioned.username} got kissed ${rMentioned.gkissed} times `,
        });
        //embed.setTimestamp();
        embed.setTitle(`${user.username} kisses ${mentioned.username}`);
        embed.setImage(random);
        interaction.editReply({ embeds: [embed] });

    },
};
