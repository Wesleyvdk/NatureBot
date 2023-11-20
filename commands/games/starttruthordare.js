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
        .setName("starttruthordare")
        .setDescription(
            "give details about what you want. once we accept this, we'll notify you about it."
        ),
    async execute(client, interaction, conn) {
        await interaction.deferReply();
        const usersIngame = [];

        const embed = new EmbedBuilder();
        try {
            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("join")
                    .setLabel("Join")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("leave")
                    .setLabel("Leave")
                    .setStyle(ButtonStyle.Danger)
            );
            embed
                .setDescription(
                    `${interaction.user.username} wants to play truth or dare`
                )
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed],
                components: [button],
            });
            try {
                const intCollector =
                    interaction.channel.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                    });
                intCollector.on("collect", async (i) => {
                    const roleName = "truth or dare";
                    const role = i.guild.roles.cache.find(
                        (role) => role.name === roleName
                    );
                    const channelId = "1087005900352540702";
                    const channel = await client.channels.fetch(channelId);
                    if (i.customId === "join") {
                        if (!usersIngame.includes(i.user.id)) {
                            usersIngame.push(i.user.id);
                            i.member.roles.add(role);
                            i.reply({
                                content: `${i.user} has joined the game. to play, go to <#${channel.id}>`,
                                components: [],
                            });
                        } else {
                            i.reply({
                                content: `${i.user} you're already in the game, to play, go to <#${channel.id}>`,
                                ephemeral: true,
                            });
                        }
                    }
                    if (i.customId === "leave") {
                        if (!usersIngame.includes(i.user.id)) {
                            i.reply({
                                content: `${i.user} you're not in the game`,
                            });
                        } else {
                            usersIngame.pop(i.user.id);
                            i.member.roles.remove(role);
                            i.reply({
                                content: `${i.user} has left the game`,
                                components: [],
                            });
                        }
                    }
                });
                intCollector.on("end", (collected) => {
                    console.log(`Collected ${collected.size} interactions.`);
                });
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            console.log(err);
        }

    },
};
