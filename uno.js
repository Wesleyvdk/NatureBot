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
    interaction.reply({ embeds: [embed], components: [button] })
    try {
        const intCollector =
            interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });
        intCollector.on("collect", async (i) => {
            if (i.customId === "join") {
                if (!players.includes(i.user.id)) {
                    players.push(i.user.id);
                    i.reply({
                        content: `${i.user} has joined the game.`,
                        components: [],
                    });
                    if (players.length == 4) {
                        const newEmbed = new EmbedBuilder();
                        i.reply({ content: "This uno game is full!" })
                        newEmbed.setDescription("This uno game is full!").setFooter("start a new game using /uno")
                        interaction.editReply({ embeds: [newEmbed] })
                        let queue, unoDeck = await StartGame()
                        Play(queue, unoDeck)
                    }
                } else {
                    i.reply({
                        content: `${i.user} you're already in the game`,
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

async function StartGame() {
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

    for (let i = 0; i <= players.length; i++) {
        if (i = 0) {
            let player1 = {
                playerId: players[i],
                cards: []
            }
        }
        if (i = 1) {
            let player2 = {
                playerId: players[i],
                cards: []
            }
        }
        if (i = 2) {
            let player3 = {
                playerId: players[i],
                cards: []
            }
        }
        if (i = 3) {
            let player4 = {
                playerId: players[i],
                cards: []
            }
        }
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
    return queue, unoDeck, topCard
}

async function Play(queue, unoDeck, topCard) {
    let selection = null;
    let queue = queue
    let unoDeck = unoDeck

    // let first player play turn
    let player = queue[0]
    queue.shift()
    client.users.send(player.playerId, `The current top card is: ${topCard}`)
    const select = new StringSelectMenuBuilder()
        .setCustomId('cards')
        .setPlaceholder('Which card do you want to play?')
        .addOptions(() => {
            for (let i = 0; i <= player.cards.length; i++) {
                new StringSelectMenuOptionBuilder()
                    .setLabel(player.cards[i])
                    .setValue(player.cards[i].toLowercase)
            }
        });
    const row = new ActionRowBuilder()
        .addComponents(select);
    client.users.send({ id: player.playerId, components: [row] })
    const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60_000 });

    collector.on('collect', async i => {
        selection = i.values[0];
        await i.reply(`${i.user} has played card: ${selection}!`);
        const index = player.cards.indexOf(selection)
        player.cards.splice(index, 1)
    });
    queue.push(player)

    // check card being placed. +2 or +4: let next player grab; switch: reverse order; skip: skip next player.
    if (selection.includes('+ 2')) {
        for (let i = 0; i <= 1; i++) {
            let index = Math.floor(Math.random() * unoDeck.length)
            let card = unoDeck[index];
            unoDeck.splice(index, 1)
            queue[0].cards.push(card)
        }

    }
    if (selection.includes('+ 4')) {
        for (let i = 0; i <= 3; i++) {
            let index = Math.floor(Math.random() * unoDeck.length)
            let card = unoDeck[index];
            unoDeck.splice(index, 1)
            queue[0].cards.push(card)
        }

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
    let topCard = selection
    Play(queue, unoDeck, topCard)

    // if player has 1 card left, announce uno in chat.

    // if player has no cards left, player wins

}
