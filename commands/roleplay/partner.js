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
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("partner")
        .setDescription("shows your partner, or the partner of another user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("select user you want to know the partner of")
        ),
    async execute(client, interaction, conn) {
        await interaction.deferReply();
        const mentioned = interaction.options.getUser("target");
        //mentionedid = mentioned.id
        let userid = interaction.user.id;
        let user = interaction.user;
        let rUser = client.getFamily.get(userid);
        let uPartnerid = rUser.partnerID;
        let uPartnername = rUser.partnerName;
        if (!mentioned) {
            if (!rUser.partnerID) {
                let partnerembed = new EmbedBuilder();
                partnerembed.setDescription("you don't have a partner");
                interaction.reply({ embeds: [partnerembed] });
            } else {
                let date = rUser.date.split(",");
                let difference = getDaysBetween(date);
                let Partnerembed = new EmbedBuilder()
                    .setColor("#fc05cb")
                    .setFooter({ text: `married since ${date[0]}` })
                    .setDescription(
                        `your partner is ${uPartnername} and you've been married for ${difference} days`
                    );
                interaction.editReply({ embeds: [Partnerembed] });
            }
        } else if (mentioned) {
            let mentionedid = mentioned.id;
            let rMentioned = client.getFamily.get(mentionedid);
            let mPartnerid = rMentioned.partnerID;
            let mPartnername = rMentioned.partnerName;
            if (!rMentioned.partnerID) {
                let partnerembed = new EmbedBuilder().setDescription(
                    `${mentioned} doesn't have a partner`
                );
                interaction.editReply({ embeds: [partnerembed] });
            } else {
                let date = rMentioned.date.split(",");
                //date = date.split(",");
                let difference = getDaysBetween(date);
                let Partnerembed = new EmbedBuilder()
                    .setFooter({ text: `married since ${date[0]}` })
                    .setDescription(
                        `${mentioned.username} their partner is ${mPartnername} and they've been married for ${difference} days`
                    );
                interaction.editReply({ embeds: [Partnerembed] });
            }
        }
        function getDaysBetween(date) {
            const january = "January";
            const february = "February";
            const march = "March";
            const april = "April";
            const may = "May";
            const june = "June";
            const july = "July";
            const august = "August";
            const september = "September";
            const october = "October";
            const november = "November";
            const december = "December";

            try {
                let dateTime = date[1];
                let date = date[0].split(" ");
                let month = date[0];
                let day = date[1];

                if (day.includes("st")) {
                    day = day.replace("st", "");
                }
                if (day.includes("nd")) {
                    day = day.replace("nd", "");
                }

                switch (month) {
                    case january:
                        marriedDate = moment([Number(date[2]), 0, Number(day)]);
                    case february:
                        marriedDate = moment([Number(date[2]), 1, Number(day)]);
                        return diff(marriedDate);
                    case march:
                        marriedDate = moment([Number(date[2]), 2, Number(day)]);
                        return diff(marriedDate);
                    case april:
                        marriedDate = moment([Number(date[2]), 3, Number(day)]);
                        return diff(marriedDate);
                    case may:
                        marriedDate = moment([Number(date[2]), 4, Number(day)]);
                        return diff(marriedDate);
                    case june:
                        marriedDate = moment([Number(date[2]), 5, Number(day)]);
                        return diff(marriedDate);
                    case july:
                        marriedDate = moment([Number(date[2]), 6, Number(day)]);
                        return diff(marriedDate);
                    case august:
                        marriedDate = moment([Number(date[2]), 7, Number(day)]);
                        return diff(marriedDate);
                    case september:
                        marriedDate = moment([Number(date[2]), 8, Number(day)]);
                        return diff(marriedDate);
                    case october:
                        marriedDate = moment([Number(date[2]), 9, Number(day)]);
                        return diff(marriedDate);
                    case november:
                        marriedDate = moment([Number(date[2]), 10, Number(day)]);
                        return diff(marriedDate);
                    case december:
                        marriedDate = moment([Number(date[2]), 11, Number(day)]);
                        return diff(marriedDate);
                }
            } catch (e) {
                console.error(e);
            }
        }
        function diff(marriedDate) {
            let start_Date = marriedDate;
            let end_Date = moment([2023, 2, 29]);
            console.log(start_Date, end_Date);
            let totalDays = end_Date.diff(start_Date, "days");
            console.log(`TotalDays: ${totalDays}`);
            return totalDays;
        }

    },
};
