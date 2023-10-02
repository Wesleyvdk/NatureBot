function Players() {
    let player1 = {
        playerId: '1',
        cards: [`Red +2`, `Red +2`, `Red +2`]
    }
    let player2 = {
        playerId: '2',
        cards: [`Red +2`, `Red +2`]
    }
    let player3 = {
        playerId: '3',
        cards: [`Red +2`]
    }
    let player4 = {
        playerId: '4',
        cards: [`Red +2`, `Red +2`, `Red +2`, `Red +2`]
    }
    let queue = [player1, player2, player3, player4]
    return queue
}

let players = Players()
console.log(players)

