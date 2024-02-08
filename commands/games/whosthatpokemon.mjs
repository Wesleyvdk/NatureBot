import {
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
} from "discord.js";
import Pokedex from "pokedex-promise-v2";
import Jimp from "jimp";
import fs from "node:fs";
import https from "node:https";

const P = new Pokedex();

const errorHandler = require("../../handlers/errorHandler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whosthatpokemon")
    .setDescription("Who's That Pokemon?"),
  async execute(client, interaction, conn, queue) {
    await interaction.deferReply();

    try {
      conn
        .promise()
        .query(
          `UPDATE bot_commands SET usage_count = usage_count + 1 WHERE command_name = "whosThatPokemon"`
        );
      P.getPokemonSpeciesList(interval).then((response) => {
        // Generate a random number between 1 and the total count
        const randomId = Math.floor(Math.random() * response.count) + 1;

        // Fetch the Pokémon by its ID
        P.getPokemonByName(randomId)
          .then((pokemon) => {
            console.log(`Random Pokémon: ${pokemon.name}`);
            const request = https.get(
              pokemon.sprites.front_default,
              async function (response) {
                response.pipe(fs.createWriteStream("./pokemon.png"));
                Jimp.read(pokemon.sprites.front_default, (err, image) => {
                  if (err) throw err;
                  image
                    .color([{ apply: "darken", params: [100] }])
                    .write("image.png");
                  const attachment = "./image.png";
                  const embed = EmbedBuilder().setDescription(
                    "Who is that pokemon?"
                  );
                  interaction.editReply({
                    embeds: [embed],
                    files: [attachment],
                  });
                  fs.unlinkSync("./image.png");
                });
              }
            );

            request.on("error", function (err) {
              errorHandler(interaction, e, null);
            });
          })
          .catch((error) => {
            errorHandler(interaction, e, null);
          });
      });
    } catch (e) {
      errorHandler(interaction, e, null);
    }
  },
};
