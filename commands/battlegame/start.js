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
const classes = require("./classes.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("start your adventure"),
    async execute(client, interaction, conn) {
        await interaction.deferReply();
        user = interaction.user;
        let rUser = client.getBattlePlayer.get(user.id);
        if (rUser.id) {
            interaction.editReply({
                content: `you already have an active character`,
                ephemeral: true,
            });
        }
        else {
            used = false;
            try {
                const embed = new EmbedBuilder()
                    .setTitle("start your own journey")
                    //.setFooter({ text: `${interaction.user.username}` })
                    .setTimestamp();
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("choose")
                        .setLabel("choose class")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setLabel("class info")
                        .setURL(
                            "https://nature-bot-docs.vercel.app/naturebot/battlegame/classes"
                        )
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setCustomId("cancel")
                        .setLabel("cancel")
                        .setStyle(ButtonStyle.Danger)
                );
                await interaction.editReply({
                    embeds: [embed],
                    components: [button],
                });
                try {
                    const Collector = interaction.channel.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                    });
                    Collector.on("collect", async (i) => {
                        if (i.customId === "choose") {
                            startEmbed = new EmbedBuilder()
                                .setDescription("Choose a class")
                                .setFooter({
                                    text: "If you don't know which class to choose, or want more info on classes, check out the docs",
                                });

                            const select = new StringSelectMenuBuilder()
                                .setCustomId("class")
                                .setPlaceholder("Make a selection!")
                                .addOptions(
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Archer")
                                        .setDescription("Skilled marksmen and women")
                                        .setValue("archer"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Mage")
                                        .setDescription("Masters of arcane magic")
                                        .setValue("mage"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Warrior")
                                        .setDescription("Masters of melee combat")
                                        .setValue("warrior"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Shaman")
                                        .setDescription("Attuned to the spirits of nature")
                                        .setValue("shaman"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Druid")
                                        .setDescription("Connected to the natural world")
                                        .setValue("druid"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Rogue")
                                        .setDescription("Sneaky and cunning")
                                        .setValue("rogue"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Paladin")
                                        .setDescription("Devoted to a higher power")
                                        .setValue("paladin"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Necromancer")
                                        .setDescription("Masters of death magic")
                                        .setValue("necromancer"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Bard")
                                        .setDescription("Skilled performers and musicians")
                                        .setValue("bard"),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("Gunslinger")
                                        .setDescription(" wielders of powerful guns")
                                        .setValue("gunslinger")
                                );
                            const row = new ActionRowBuilder()
                                .addComponents(select);
                            await i.reply({ embeds: [startEmbed], components: [row] })

                            const collector = i.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, max: 1, time: 15_000 });
                            collector.on('collect', async k => {
                                if (k.customId === "class") {
                                    const selection = k.values[0];
                                    if (selection == "shaman") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${i.user.id}`,
                                                user: `${i.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Shaman.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "mage") {
                                        if (!rUser) {
                                            let rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Mage.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "archer") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Archer.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "warrior") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Warrior.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "rogue") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Rogue.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "paladin") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Paladin.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "druid") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Druid.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "bard") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Bard.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "gunslinger") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Gunslinger.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }
                                    if (selection == "necromancer") {
                                        if (!rUser) {
                                            rUser = {
                                                id: `${k.user.id}`,
                                                user: `${k.user.username}`,
                                                guild: null,
                                                level: 0,
                                                class: `${selection}`,
                                                equipedWeapon: classes.class.Necromancer.Weapon.WeaponId,
                                                equipedHelmet: "",
                                                equipedChestplate: "",
                                                equipedPants: "",
                                                equipedBoots: "",
                                            };
                                            client.setBattlePlayer.run(rUser);
                                        }

                                    }

                                    await k.reply(
                                        `${i.user} has selected ${selection}! good luck on your adventure!`
                                    );
                                }
                            });
                            collector.on("end", (collected) => {
                                console.log(`Collected ${collected.size} interactions.`);
                            });
                        }

                        if (i.customId === "cancel") {
                            i.reply("hope to see you play soon!");
                        }
                    });
                    Collector.on("end", (collected) => {
                        console.log(`Collected ${collected.size} interactions.`);
                    });
                } catch (err) {
                    console.log(err);
                }
            } catch (err) {
                console.log(err);
            }
        }

    },
};
