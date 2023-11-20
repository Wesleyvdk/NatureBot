import {
    Client,
    GatewayIntentBits,
    Partials,
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
} from 'discord.js';
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.GuildScheduledEvent,
    ],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'bored') {
        await interaction.deferReply();
        const response = await fetch("http://www.boredapi.com/api/activity/")
        const data = await response.json();
        interaction.editReply(data.activity);
    }
    if (interaction.commandName === 'trivia') {
        await interaction.deferReply();
        let answers = []
        const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple")
        const data = await response.json();
        for (let i = 0; i < data.results[0].incorrect_answers.length; i++)
            answers.push(data.results[0].incorrect_answers[i])
        answers.push(data.results[0].correct_answer)
        const correct = data.results[0].correct_answer
        shuffleArray(answers)
        const embed = new EmbedBuilder()
            .setDescription(data.results[0].question)
            .addFields(
                { name: `1 ${answers[0]}`, value: "\u200B" },
                { name: `2 ${answers[1]}`, value: "\u200B" },
                { name: `3 ${answers[2]}`, value: "\u200B" },
                { name: `4 ${answers[3]}`, value: "\u200B" }
            );

        const oneButton = new ButtonBuilder()
            .setCustomId("1")
            .setLabel("1")
            .setStyle(ButtonStyle.Primary)
        const twoButton = new ButtonBuilder()
            .setCustomId("2")
            .setLabel("2")
            .setStyle(ButtonStyle.Primary)
        const threeButton = new ButtonBuilder()
            .setCustomId("3")
            .setLabel("3")
            .setStyle(ButtonStyle.Primary)
        const fourButton = new ButtonBuilder()
            .setCustomId("4")
            .setLabel("4")
            .setStyle(ButtonStyle.Primary)
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                oneButton,
                twoButton,
                threeButton,
                fourButton
            );
        interaction.editReply({ embeds: [embed], components: [buttonRow] })
        try {
            const triviaCollector =
                interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button, max: 1, time: 60_000
                });
            triviaCollector.on("collect", async (i) => {
                if (i.customId === "1") {
                    if (answers[0] === correct) {
                        i.reply({
                            content: `Congratulations! You got the right answer!`,
                            components: [],
                        });
                        interaction.editReply({ components: [] })
                    }
                    else {
                        i.reply({ content: `Unlucky! Try again!` })
                        interaction.editReply({ components: [] })
                    }
                }

                else if (i.customId === "2") {
                    if (answers[1] === correct) {
                        i.reply({
                            content: `Congratulations! You got the right answer!`,
                            components: [],
                        });
                        interaction.editReply({ components: [] })
                    }
                    else {
                        i.reply({ content: `Unlucky! Try again!` })
                        interaction.editReply({ components: [] })
                    }
                }
                else if (i.customId === "3") {
                    if (answers[2] === correct) {
                        i.reply({
                            content: `Congratulations! You got the right answer!`,
                            components: [],
                        });
                        interaction.editReply({ components: [] })
                    }
                    else {
                        i.reply({ content: `Unlucky! Try again!` })
                        interaction.editReply({ components: [] })
                    }
                }
                else if (i.customId === "4") {
                    if (answers[3] === correct) {
                        i.reply({
                            content: `Congratulations! You got the right answer!`,
                            components: [],
                        });
                        interaction.editReply({ components: [] })
                    }
                    else {
                        i.reply({ content: `Unlucky! Try again!` })
                        interaction.editReply({ components: [] })
                    }
                }
            });
            triviaCollector.on("end", (collected) => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (err) {
            console.log(err);
        }
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];

        }
        return array
    }
    //start command
    if (interaction.commandName === 'uno') {
        await interaction.deferReply();
        const players = [];
        //wait for max 4 people to join
        const embed = new EmbedBuilder();
        embed.setDescription("Join this uno game!")
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("join")
                .setLabel("Join")
                .setStyle(ButtonStyle.Success)
        );
        interaction.editReply({ embeds: [embed], components: [button] })
        try {
            const intCollector =
                interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                });
            intCollector.on("collect", async (i) => {
                if (i.customId === "join") {
                    if (!players.includes(i.user.id)) {
                        players.push(i.user.id);
                        if (players.length == 2) {
                            const joinButton = new ButtonBuilder()
                                .setCustomId("join")
                                .setLabel("Join")
                                .setStyle(ButtonStyle.Success)
                            const startButton = new ButtonBuilder()
                                .setCustomId('start')
                                .setLabel('Start')
                                .setStyle(ButtonStyle.Primary);
                            const newRow = new ActionRowBuilder()
                                .addComponents(
                                    joinButton,
                                    startButton // New Button
                                );
                            await interaction.editReply({
                                components: [newRow]
                            });
                        }
                        if (players.length == 4) {
                            const newEmbed = new EmbedBuilder();
                            i.reply({ content: "This uno game is full!" })
                            newEmbed.setDescription("This uno game is full!").setFooter({ text: 'start a new game using /uno' })
                            interaction.editReply({ embeds: [newEmbed], components: [] })
                            let { queue, unoDeck, topCard } = StartGame(players)
                            const channelId = interaction.channelId;
                            Play(queue, unoDeck, topCard, channelId)
                        }
                        i.reply({
                            content: `${i.user} has joined the game.`,
                            components: [],
                        });
                    } else {
                        i.reply({
                            content: `${i.user} you're already in the game`,
                            ephemeral: true,
                        });
                    }
                }
                if (i.customId === "start") {
                    const newEmbed = new EmbedBuilder();
                    newEmbed.setDescription("This uno game Started!").setFooter({ text: 'start a new game using /uno' })
                    await interaction.editReply({ embeds: [newEmbed], components: [] })
                    const channelId = interaction.channelId;
                    let { queue, unoDeck, topCard } = StartGame(players)
                    Play(queue, unoDeck, topCard, channelId)
                }
                if (i.customId === "leave") {
                    if (!usersIngame.includes(i.user.id)) {
                        i.reply({
                            content: `${i.user} you're not in the game`,
                        });
                    } else {
                        usersIngame.pop(i.user.id);
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
    }

    function StartGame(players) {
        let unoDeck = []
        for (let k = 0; k <= 1; k++) {
            for (let j = 0; j <= 9; j++) {
                unoDeck.push(`Red ${j}`)
                unoDeck.push(`Green ${j}`)
                unoDeck.push(`Blue ${j}`)
                unoDeck.push(`Yellow ${j}`)
            }
            unoDeck.push(`Red +2`)
            unoDeck.push(`Green +2`)
            unoDeck.push(`Blue +2`)
            unoDeck.push(`Yellow +2`)

            unoDeck.push(`Red Switch`)
            unoDeck.push(`Green Switch`)
            unoDeck.push(`Blue Switch`)
            unoDeck.push(`Yellow Switch`)

            unoDeck.push(`Red Skip`)
            unoDeck.push(`Green Skip`)
            unoDeck.push(`Blue Skip`)
            unoDeck.push(`Yellow Skip`)

            for (let l = 0; l < 2; l++) {
                unoDeck.push(`+4`)
                unoDeck.push(`WildCard`)
            }
        }

        // give cards to players, implement way to check amount of players, link user with player number
        if (players.length === 2) {

            let player1 = {
                playerId: players[0],
                cards: []

            }
            let player2 = {
                playerId: players[1],
                cards: []

            }

            for (let a = 0; a < 7; a++) {

                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player1.cards.push(card)
            }
            for (let a = 0; a < 7; a++) {

                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player2.cards.push(card)
            }


            // dm users their cards
            client.users.send(player1.playerId, `Your cards: ${player1.cards} `)
            client.users.send(player2.playerId, `Your cards: ${player2.cards} `)


            let index = Math.floor(Math.random() * unoDeck.length)
            let topCard = unoDeck[index];
            unoDeck.splice(index, 1)

            let queue = [player1, player2]
            return { queue, unoDeck, topCard }

        }
        if (players.length === 3) {
            let player1 = {
                playerId: players[0],
                cards: []
            }
            let player2 = {
                playerId: players[1],
                cards: []
            }
            let player3 = {
                playerId: players[2],
                cards: []
            }

            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player1.cards.push(card)
            }
            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player2.cards.push(card)
            }
            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player3.cards.push(card)
            }


            // dm users their cards
            client.users.send(player1.playerId, `Your cards: ${player1.cards} `)
            client.users.send(player2.playerId, `Your cards: ${player2.cards} `)
            client.users.send(player3.playerId, `Your cards: ${player3.cards} `)

            let index = Math.floor(Math.random() * unoDeck.length)
            let topCard = unoDeck[index];
            unoDeck.splice(index, 1)

            let queue = [player1, player2, player3]
            return { queue, unoDeck, topCard }

        }

        if (players.length === 4) {
            let player1 = {
                playerId: players[0],
                cards: []
            }
            let player2 = {
                playerId: players[1],
                cards: []
            }
            let player3 = {
                playerId: players[2],
                cards: []
            }
            let player4 = {
                playerId: players[3],
                cards: []
            }

            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player1.cards.push(card)
            }
            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player2.cards.push(card)
            }
            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player3.cards.push(card)
            }
            for (let a = 0; a < 7; a++) {
                let index = Math.floor(Math.random() * unoDeck.length)
                let card = unoDeck[index];
                unoDeck.splice(index, 1)
                player4.cards.push(card)
            }

            // dm users their cards
            client.users.send(player1.playerId, `Your cards: ${player1.cards} `)
            client.users.send(player2.playerId, `Your cards: ${player2.cards} `)
            client.users.send(player3.playerId, `Your cards: ${player3.cards} `)
            client.users.send(player4.playerId, `Your cards: ${player4.cards} `)

            let index = Math.floor(Math.random() * unoDeck.length)
            let topCard = unoDeck[index];
            unoDeck.splice(index, 1)

            let queue = [player1, player2, player3, player4]
            return { queue, unoDeck, topCard }
        }
    }

    async function Play(queue, unoDeck, topCard, channelId) {
        let selection = null
        // let first player play turn
        const channel = client.channels.cache.get(channelId);
        channel.send(`The current top card is: ${topCard}`);
        let player = queue[0]
        queue.shift()

        client.users.send(player.playerId, `it's your turn `)
        const options = player.cards
            .filter(card => (
                card.split(" ")[0] === topCard.split(" ")[0] ||
                card.split(" ")[1] === topCard.split(" ")[1] ||
                card === "+4" || card === "WildCard"
            ))
            .map((card, i) => ({
                label: card,
                value: i.toString()
            }));
        const select = new StringSelectMenuBuilder()
            .setCustomId('cards')
            .setPlaceholder('Which card do you want to play?')
            .addOptions(options);
        const row = new ActionRowBuilder()
            .addComponents(select);
        const user = await client.users.fetch(player.playerId);
        let response = await user.send({ components: [row] })

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, max: 1, time: 60_000 });


        collector.on('collect', async i => {
            const selectedValue = i.values[0];
            const selectedOption = options.find(option => option.value === selectedValue);
            const selection = selectedOption.label;
            await i.reply(`${i.user} you played: ${selection}!`);
            channel.send(`${i.user} has played: ${selection}!`)
            const index = player.cards.indexOf(selection)
            player.cards.splice(index, 1)
            if (player.cards.length == 1) {
                channel.send(`${i.user}: UNO`)
            }
            if (player.cards.length == 0) {
                channel.send(`${i.user} has won this game!`)
                return;
            }
        });

        collector.on('end', async collected => {
            const interaction = collected.first();  // Get the first item collected
            const selectedValue = interaction.values[0];
            const selectedOption = options.find(option => option.value === selectedValue);
            const selection = selectedOption.label;

            queue.push(player)

            // check card being placed. +2 or +4: let next player grab; switch: reverse order; skip: skip next player.
            if (selection.includes('+2')) {
                if (queue[0].cards.includes("+2"))
                    client.users.send(queue[0].playerId, `You have to draw 2 cards`)
                for (let i = 0; i <= 1; i++) {
                    let index = Math.floor(Math.random() * unoDeck.length)
                    let card = unoDeck[index];
                    unoDeck.splice(index, 1)
                    queue[0].cards.push(card)
                    client.users.send(queue[0].playerId, `You picked up ${card}`)
                }
                let player = queue[0].shift
                queue.push(player)
            }
            if (selection.includes('+4')) {
                client.users.send(queue[0].playerId, `You have to draw 4 cards`)
                for (let i = 0; i <= 3; i++) {
                    let index = Math.floor(Math.random() * unoDeck.length)
                    let card = unoDeck[index];
                    unoDeck.splice(index, 1)
                    queue[0].cards.push(card)
                    client.users.send(queue[0].playerId, `You picked up ${card}`)
                }
                let player = queue[0].shift
                queue.push(player)
            }
            if (selection.includes('Skip')) {
                let player = queue.shift()
                queue.push(player)
            }
            if (selection.includes('Switch')) {
                let player = queue.pop()
                queue.reverse()
                queue.push(player)
            }

            // next player. if player can't, pick up till can and let decide whether to keep card, or play it.
            unoDeck.push(topCard)
            topCard = selection
            Play(queue, unoDeck, topCard, channelId)

            // if player has 1 card left, announce uno in chat.

            // if player has no cards left, player wins

        });
        collector.on('error', (error) => {
            console.error('Error collecting:', error);
        });

    }

});

client.login("ODk0OTA2MDQ2MzgzMDE3OTk0.GT9kFq.1yiIzR6Id1ZdkT7iW3IRHL4LO6rRgQkkdYYxWU");