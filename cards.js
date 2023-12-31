// import pokemon from 'pokemontcgsdk'

// pokemon.configure({ apiKey: '48b74ce0-34b6-48c3-aa23-6248626c81cd' })

// pokemon.card.all({ q: 'name:blastoise' })
//     .then((cards) => {
//         console.log(cards[0]) // "Blastoise"
//     })

let clovers = [];
let spades = [];
let hearts = [];
let diamonds = [];

// every card has a number from 1 to 13 with 1 being ace, 11 being jack, 12 being queen, 13 being king

for (let i = 1; i <= 13; i++) {
  if (i == 1) {
    clovers.push(`clover ace`);
    spades.push(`spade ace`);
    hearts.push(`heart ace`);
    diamonds.push(`diamond ace`);
    continue;
  }
  if (i == 11) {
    clovers.push(`clover jack`);
    spades.push(`spade jack`);
    hearts.push(`heart jack`);
    diamonds.push(`diamonds jack`);
    continue;
  }
  if (i == 12) {
    clovers.push(`clover queen`);
    spades.push(`spade queen`);
    hearts.push(`heart queen`);
    diamonds.push(`diamonds queen`);
    continue;
  }
  if (i == 13) {
    clovers.push(`clover king`);
    spades.push(`spade king`);
    hearts.push(`heart king`);
    diamonds.push(`diamonds king`);
    continue;
  } else {
    clovers.push(`clover ${i}`);
    spades.push(`spades ${i}`);
    hearts.push(`hearts ${i}`);
    diamonds.push(`diamond ${i}`);
  }
}

let total = clovers.length + spades.length + hearts.length + diamonds.length;
