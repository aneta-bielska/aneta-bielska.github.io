export const generateEmptyCard = () => {
  return {
    id: parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100,
    status: 'empty'
  };
};

export const drawCardFromDeck = (deck) => {
  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];
  deck.splice(randomIndex, 1);
  card.status = 'table';
  return card;
};

export const findValidSet = (table) => {
  return combination(table.filter(c => c.status !== 'empty'), 3).find(set => isValidSet(set));
};

const generateCombinations = (array, size, start = 0, current = []) => {
  if (current.length >= size) {
    return [current];
  }

  const combinations = [];
  for (let i = start; i < array.length; i++) {
    const newCombos = generateCombinations(array, size, i + 1, [...current, array[i]]);
    combinations.push(...newCombos);
  }
  return combinations;
}

export const combination = (array, size) => {
  if (size < 0 || size > array.length) {
    return [];
  }
  return generateCombinations(array, size);
}

export const isValidSet = (set) => {
  const [a, b, c] = set;
  const properties = ['number', 'shape', 'filling', 'color'];

  return properties.every(prop =>
    (a[prop] === b[prop] && b[prop] === c[prop]) ||
    (a[prop] !== b[prop] && b[prop] !== c[prop] && a[prop] !== c[prop])
  );
};

export const getThreeCards = (deck) => {
  let newCards = [];

  for (let i = 0; i < 3; i++) {
    let random = Math.floor(Math.random() * deck.length);
    let randomCard = deck[random];
    newCards.push(randomCard);
    deck.splice(random, 1);
    randomCard.status = 'table';
  }

  return newCards;
};

export const setsAvailable = (table) => {
  const sets = combination(table.filter(c => c.status !== 'empty'), 3).filter(set => isValidSet(set));

  return sets;
};
