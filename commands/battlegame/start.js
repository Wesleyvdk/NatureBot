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
} = require("discord.js");
const classes = require("./classes.json");

const errorHandler = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("start your adventure"),
  async execute(client, interaction, conn) {
    await interaction.deferReply();
    conn
      .promise()
      .query(
        `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "start"`
      );

    user = interaction.user;
    conn
      .promise()
      .query(`SELECT * FROM players WHERE id=${user.id}`)
      .then(async ([rows, fields]) => {
        if (rows[0].id) {
          interaction.editReply({
            content: `you already have an active character`,
            ephemeral: true,
          });
        } else {
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
              const Collector =
                interaction.channel.createMessageComponentCollector({
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
                  const row = new ActionRowBuilder().addComponents(select);
                  await i.reply({ embeds: [startEmbed], components: [row] });

                  const collector = i.channel.createMessageComponentCollector({
                    componentType: ComponentType.StringSelect,
                    max: 1,
                    time: 15_000,
                  });
                  collector.on("collect", async (k) => {
                    if (k.customId === "class") {
                      const selection = k.values[0];
                      if (selection == "shaman") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Shaman.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      // change to switch case
                      if (selection == "mage") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Mage.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "archer") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Archer.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "warrior") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Warrior.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "rogue") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Rogue.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "paladin") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Paladin.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "druid") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Druid.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "bard") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Bard.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "gunslinger") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Gunslinger.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
                      }
                      if (selection == "necromancer") {
                        conn
                          .promise()
                          .query(
                            `INSERT IGNORE INTO players(id, user, guild, level, class, equipedWeapon, equipedHelmet, equipedChestplate, equipedPants, equipedBoots) VALUES (${
                              (i.user.id,
                              i.user.username,
                              null,
                              0,
                              selection,
                              classes.class.Necromancer.Weapon,
                              null,
                              null,
                              null,
                              null)
                            })`
                          );
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
            } catch (e) {
              errorHandler(interaction, e, null);
            }
          } catch (e) {
            errorHandler(interaction, e, null);
          }
        }
      });
  },
};
