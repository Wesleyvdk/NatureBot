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
        .setName("handholding")
        .setDescription("hold hands with another user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("user you want to hold hands with")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        await interaction.deferReply();
        //all url's of the gifs
        let gifs = ["https://media.giphy.com/media/TnUJHKyjwHXOM/source.gif"];
        //will calculate which one to send
        const random = gifs[Math.floor(Math.random() * gifs.length)];
        //sends the random message =
        let mentioned = interaction.options.getUser("target");

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

        rUser.holdhands++;
        rMentioned.gholdhands++;
        client.setRoleplay.run(rUser);
        client.setRoleplay.run(rMentioned);
        let embed = new EmbedBuilder();
        embed.setColor("#fc05cb");
        embed.setFooter({
            text: `${user.username} held hands with others ${rUser.holdhands} times and ${mentioned.username}'s hands got held ${rMentioned.gholdhands} times`,
        });
        //embed.setTimestamp();
        embed.setTitle(`${user.username} holds hands with ${mentioned.username}`);
        embed.setImage(random);
        interaction.editReply({ embeds: [embed] });

    },
};
