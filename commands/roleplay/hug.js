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
        .setName("hug")
        .setDescription("hug another user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("user you want to hug")
                .setRequired(true)
        ),
    async execute(client, interaction, conn) {
        await interaction.deferReply();
        const mentioned = interaction.options.getUser("target");
        //all url's of the gifs
        let gifs = [
            "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
            "https://media1.tenor.com/images/78d3f21a608a4ff0c8a09ec12ffe763d/tenor.gif?itemid=16509980",
            "https://media.tenor.com/images/ca682cecd6bff521e400f984502f370c/tenor.gif",
            "https://media.tenor.com/images/1ca37ea5d3ec66ea08893d8679c04ae1/tenor.gif",
            "https://media1.tenor.com/images/1d94b18b89f600cbb420cce85558b493/tenor.gif?itemid=15942846",
            "https://media1.tenor.com/images/daffa3b7992a08767168614178cce7d6/tenor.gif?itemid=15249774",
            "https://media1.tenor.com/images/6db54c4d6dad5f1f2863d878cfb2d8df/tenor.gif?itemid=7324587",
            "https://media1.tenor.com/images/c2156769899d169306d16b063a55d0b2/tenor.gif?itemid=14584871",
            "https://media1.tenor.com/images/cc805107341e281102a2280f08b582e0/tenor.gif?itemid=13925386",
            "https://media.tenor.com/images/6deb677d1a080655e2c916452e4b6ba5/tenor.gif",
            "https://media1.tenor.com/images/b7487d45af7950bfb3f7027c93aa49b1/tenor.gif?itemid=9882931",
            "https://media1.tenor.com/images/d19bfd9ba90422611ec3c2d835363ffc/tenor.gif?itemid=18374323",
        ];
        //will calculate which one to send
        const random = gifs[Math.floor(Math.random() * gifs.length)];
        //sends the random message =
        mentionedid = mentioned.id;
        userid = interaction.user.id;
        user = interaction.user;
        let rUser = client.getRoleplay.get(userid, interaction.guild.id);
        let rMentioned = client.getRoleplay.get(mentionedid, interaction.guild.id);
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
        rUser.hugged++;
        rMentioned.ghugged++;
        client.setRoleplay.run(rUser);
        client.setRoleplay.run(rMentioned);
        let embed = new EmbedBuilder()
            .setColor("#fc05cb")
            .setFooter({
                text: ` ${user.username} hugged others ${rUser.hugged} times and ${mentioned.username} got hugged ${rMentioned.ghugged} times`,
            })
            //embed.setTimestamp();
            .setTitle(`${user.username} hugs ${mentioned.username}`)
            .setImage(random);
        interaction.editReply({ embeds: [embed] });

    },
};
