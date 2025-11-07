import {
  SlashCommandBuilder,
  EmbedBuilder,
  ComponentType,
} from "discord.js";

import handleError from "../../handlers/errorHandler";

// Common 5-letter words for Wordle
const WORD_LIST = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIGN", "ALIKE", "ALIVE", "ALLOW",
  "ALONE", "ALONG", "ALTER", "ANGEL", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY",
  "ARENA", "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AVOID", "AWARD", "AWARE",
  "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEING", "BELOW",
  "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST",
  "BOOTH", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD",
  "BROKE", "BROWN", "BUILD", "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH", "CAUSE",
  "CHAIN", "CHAIR", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA",
  "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLOCK", "CLOSE", "COACH",
  "COAST", "COULD", "COUNT", "COURT", "COVER", "CRAFT", "CRASH", "CRAZY", "CREAM", "CRIME",
  "CROSS", "CROWD", "CROWN", "CRUDE", "CYCLE", "DAILY", "DANCE", "DATED", "DEALT", "DEATH",
  "DEBUT", "DELAY", "DEPTH", "DOING", "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRANK", "DRAWN",
  "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH",
  "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT",
  "EVERY", "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH",
  "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS",
  "FORCE", "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT",
  "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE",
  "GRAND", "GRANT", "GRASS", "GREAT", "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS",
  "GUEST", "GUIDE", "HAPPY", "HARRY", "HEART", "HEAVY", "HENCE", "HENRY", "HORSE", "HOTEL",
  "HOUSE", "HUMAN", "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE", "JAPAN", "JIMMY",
  "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL", "LARGE", "LASER", "LATER", "LAUGH", "LAYER",
  "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL", "LEMON", "LEVEL", "LEWIS", "LIGHT", "LIMIT",
  "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY", "LUNCH", "LYING", "MAGIC",
  "MAJOR", "MAKER", "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR", "MEANT", "MEDIA", "METAL",
  "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT",
  "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT", "NOISE", "NORTH",
  "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER", "OUGHT",
  "PAINT", "PANEL", "PANIC", "PAPER", "PARTY", "PEACE", "PETER", "PHASE", "PHONE", "PHOTO",
  "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND",
  "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD",
  "PROVE", "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO",
  "REACH", "READY", "REFER", "RIGHT", "RIVAL", "RIVER", "ROBIN", "ROGER", "ROMAN", "ROUGH",
  "ROUND", "ROUTE", "ROYAL", "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE",
  "SEVEN", "SHALL", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE",
  "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOWN", "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED",
  "SKILL", "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMITH", "SMOKE", "SOLID", "SOLVE",
  "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT",
  "SPOKE", "SPORT", "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL",
  "STICK", "STILL", "STOCK", "STONE", "STOOD", "STORE", "STORM", "STORY", "STRIP", "STUCK",
  "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE",
  "TAXES", "TEACH", "TEETH", "TERRY", "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE",
  "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT",
  "TIMES", "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE",
  "TRAIN", "TRAIT", "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES", "TROOP",
  "TRUCK", "TRULY", "TRUNK", "TRUST", "TRUTH", "TWICE", "UNCLE", "UNDER", "UNDUE", "UNION",
  "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE", "USUAL", "VALID", "VALUE", "VIDEO",
  "VIRUS", "VISIT", "VITAL", "VOCAL", "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE",
  "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE",
  "WORST", "WORTH", "WOULD", "WOUND", "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH"
];

interface GameState {
  word: string;
  guesses: string[];
  maxAttempts: number;
  gameOver: boolean;
  won: boolean;
}

export default {
  data: new SlashCommandBuilder()
    .setName("wordle")
    .setDescription("Play a game of Wordle! Guess the 5-letter word in 6 tries."),

  async execute(client: any, interaction: any) {
    await interaction.deferReply();

    try {
      // Initialize game state
      const gameState: GameState = {
        word: WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)],
        guesses: [],
        maxAttempts: 6,
        gameOver: false,
        won: false,
      };

      // Create initial embed
      const gameEmbed = createGameEmbed(gameState, interaction.user.username);
      await interaction.editReply({ embeds: [gameEmbed] });

      // Create message collector for user guesses
      const filter = (m: any) => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({
        filter,
        time: 300_000, // 5 minutes
      });

      collector.on("collect", async (message: any) => {
        // Validate guess
        const guess = message.content.toUpperCase().trim();

        // Delete the user's message
        try {
          await message.delete();
        } catch (error) {
          // Ignore if we can't delete (missing permissions)
        }

        // Check if game is over
        if (gameState.gameOver) {
          return;
        }

        // Validate guess format
        if (guess.length !== 5) {
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ Please enter a 5-letter word!")
            .setTimestamp();
          const errorMsg = await interaction.channel.send({ embeds: [errorEmbed] });
          setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
          return;
        }

        if (!/^[A-Z]+$/.test(guess)) {
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ Please use only letters!")
            .setTimestamp();
          const errorMsg = await interaction.channel.send({ embeds: [errorEmbed] });
          setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
          return;
        }

        // Add guess to game state
        gameState.guesses.push(guess);

        // Check if won
        if (guess === gameState.word) {
          gameState.gameOver = true;
          gameState.won = true;
          collector.stop("won");
        }

        // Check if out of attempts
        if (gameState.guesses.length >= gameState.maxAttempts) {
          gameState.gameOver = true;
          collector.stop("lost");
        }

        // Update embed with new guess
        const updatedEmbed = createGameEmbed(gameState, interaction.user.username);
        await interaction.editReply({ embeds: [updatedEmbed] });
      });

      collector.on("end", async (collected: any, reason: string) => {
        // Create final embed with game result
        const finalEmbed = createFinalEmbed(gameState, interaction.user.username, reason);
        await interaction.editReply({ embeds: [finalEmbed] });
      });

    } catch (error: any) {
      handleError(interaction, error, null);
    }
  },
};

/**
 * Creates the game board embed with current guesses
 */
function createGameEmbed(gameState: GameState, username: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor("#2B2D31")
    .setTitle(`🎮 Wordle - ${username}'s Game`)
    .setDescription(
      "Guess the 5-letter word! Type your guess in the chat.\n" +
      `Attempts: ${gameState.guesses.length}/${gameState.maxAttempts}\n\n` +
      generateBoard(gameState)
    )
    .setFooter({ text: "🟩 = Correct | 🟨 = Wrong position | ⬜ = Not in word" })
    .setTimestamp();

  return embed;
}

/**
 * Creates the final game embed with result
 */
function createFinalEmbed(gameState: GameState, username: string, reason: string): EmbedBuilder {
  const embed = new EmbedBuilder();

  if (gameState.won) {
    embed
      .setColor("#00FF00")
      .setTitle(`🎉 Congratulations ${username}!`)
      .setDescription(
        `You guessed the word **${gameState.word}** in ${gameState.guesses.length} ${
          gameState.guesses.length === 1 ? "try" : "tries"
        }!\n\n` +
        generateBoard(gameState)
      );
  } else if (reason === "time") {
    embed
      .setColor("#FF0000")
      .setTitle(`⏰ Time's Up!`)
      .setDescription(
        `The word was **${gameState.word}**\n\n` +
        generateBoard(gameState)
      );
  } else {
    embed
      .setColor("#FF0000")
      .setTitle(`😢 Game Over!`)
      .setDescription(
        `You ran out of attempts! The word was **${gameState.word}**\n\n` +
        generateBoard(gameState)
      );
  }

  embed
    .setFooter({ text: "🟩 = Correct | 🟨 = Wrong position | ⬜ = Not in word" })
    .setTimestamp();

  return embed;
}

/**
 * Generates the visual board with colored squares
 */
function generateBoard(gameState: GameState): string {
  let board = "";

  // Show guesses with feedback
  for (const guess of gameState.guesses) {
    const feedback = getFeedback(guess, gameState.word);
    board += feedback + " `" + guess + "`\n";
  }

  // Show remaining empty rows
  const remainingRows = gameState.maxAttempts - gameState.guesses.length;
  for (let i = 0; i < remainingRows; i++) {
    board += "⬜⬜⬜⬜⬜\n";
  }

  return board;
}

/**
 * Generates feedback for a guess using colored squares
 */
function getFeedback(guess: string, word: string): string {
  const feedback: string[] = [];
  const wordLetters = word.split("");
  const guessLetters = guess.split("");
  const used: boolean[] = new Array(5).fill(false);

  // First pass: mark correct positions (green)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === wordLetters[i]) {
      feedback[i] = "🟩";
      used[i] = true;
    }
  }

  // Second pass: mark wrong positions (yellow) and not in word (gray)
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === "🟩") continue;

    let found = false;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessLetters[i] === wordLetters[j] && feedback[j] !== "🟩") {
        feedback[i] = "🟨";
        used[j] = true;
        found = true;
        break;
      }
    }

    if (!found) {
      feedback[i] = "⬜";
    }
  }

  return feedback.join("");
}
