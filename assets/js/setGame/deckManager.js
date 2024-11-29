const card = (id, color, shape, number, filling) => {
  return {
    id,
    color,
    shape,
    number,
    filling,
    status: 'deck',
    set: false
  }
}

export const initDeck = () => {
  let deck = [];
  let id = 1;

  for (let color of ['DeepSkyBlue', 'Crimson', '#3d3d3d']) {
    for (let shape of [1, 2, 3]) {
      for (let number of [1, 2, 3]) {
        for (let filling of [1, 2, 3]) {
          deck.push(card(id++, color, shape, number, filling));
        }
      }
    }
  }

  return deck;
};

export const initialCards = () => {
  let deck = initDeck();
  let table = [];

  for (let i = 0; i < 12; i++) {
    let random = Math.floor(Math.random() * deck.length);
    let randomCard = deck[random];
    table.push(randomCard);
    randomCard.status = 'table';
    deck.splice(random, 1);
  }

  return [table, deck];
};
