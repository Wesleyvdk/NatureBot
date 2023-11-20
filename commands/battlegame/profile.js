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
const { createCanvas, Image, GlobalFonts } = require("@napi-rs/canvas");
//const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { readFile } = require("fs/promises");
const { request } = require("undici");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("show's the user's battle profile"),
    async execute(client, interaction) {
        await interaction.deferReply();
        user = interaction.user;
        let rUser = client.getBattlePlayer.get(user.id);
        if (!rUser) {
            const canvas = createCanvas(564, 1002);
            const context = canvas.getContext("2d");

            const background = await readFile("./designs/profile.jpg");
            const backgroundImage = new Image();
            backgroundImage.src = background;
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            context.strokeStyle = "#0099ff";
            context.strokeRect(0, 0, canvas.width, canvas.height);

            context.font = "28px Arial";
            context.fillStyle = "#ffffff";
            context.fillText("Profile", canvas.width / 2.5, canvas.height / 3.5);

            context.font = applyText(canvas, `${rUser.user}!`);
            context.fillStyle = "#ffffff";
            context.fillText(
                `${interaction.member.displayName}!`,
                canvas.width / 1.5,
                canvas.height / 8
            );
            context.font = applyText(canvas, `${rUser.level}`);
            context.fillStyle = "#ffffff";
            context.fillText(
                `${rUser.level}!`,
                canvas.width / 2.5,
                canvas.height / 2.4
            );
            context.font = applyText(canvas, `${rUser.class}`);
            context.fillStyle = "#ffffff";
            context.fillText(
                `${rUser.class}!`,
                canvas.width / 2.5,
                canvas.height / 2.8
            );

            context.beginPath();
            context.arc(150, 150, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            const { body } = await request(
                interaction.user.displayAvatarURL({ format: "jpg" })
            );
            const avatar = new Image();
            avatar.src = Buffer.from(await body.arrayBuffer());
            context.drawImage(avatar, 25, 25, 250, 250);

            const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
                name: "profile-image.png",
            });

            await interaction.editReply({ files: [attachment] });
            // interaction.editReply({
            //     content:
            //         "you have not yet started your journey. to start your journey, please use /start",
            // });
        } else {

            const canvas = createCanvas(564, 1002);
            const context = canvas.getContext("2d");

            const background = await readFile("./designs/profile.jpg");
            const backgroundImage = new Image();
            backgroundImage.src = background;
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            context.strokeStyle = "#0099ff";
            context.strokeRect(0, 0, canvas.width, canvas.height);

            context.font = "28px Arial";
            context.fillStyle = "#ffffff";
            context.fillText("Profile", canvas.width / 2.5, canvas.height / 3.5);

            context.font = applyText(canvas, `${rUser.user}!`);
            context.fillStyle = "#ffffff";
            context.fillText(
                `${interaction.member.displayName}!`,
                canvas.width / 1.5,
                canvas.height / 8
            );
            context.font = applyText(canvas, `${rUser.level}`);
            context.fillStyle = "#ffffff";
            context.fillText(
                `${rUser.level}!`,
                canvas.width / 2.5,
                canvas.height / 2.4
            );
            context.font = applyText(canvas, `${rUser.class}`);
            context.fillStyle = "#ffffff";
            context.fillText(
                `${rUser.class}!`,
                canvas.width / 2.5,
                canvas.height / 2.8
            );

            context.beginPath();
            context.arc(150, 150, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            const { body } = await request(
                interaction.user.displayAvatarURL({ format: "jpg" })
            );
            const avatar = new Image();
            avatar.src = Buffer.from(await body.arrayBuffer());
            context.drawImage(avatar, 25, 25, 250, 250);

            const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
                name: "profile-image.png",
            });

            await interaction.editReply({ files: [attachment] });
        }
        const applyText = (canvas, text) => {
            const context = canvas.getContext("2d");
            let fontSize = 80;

            do {
                context.font = `${(fontSize -= 10)}px Arial`;
            } while (context.measureText(text).width > canvas.width - 300);

            return context.font;
        };

    }

};
