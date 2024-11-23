// Core game logic functions
const getCombinations = (array, size, start, initialStuff, output) => {
  if (initialStuff.length >= size) {
    output.push(initialStuff);
  } else {
    for (let i = start; i < array.length; ++i) {
      getCombinations(array, size, i + 1, initialStuff.concat(array[i]), output);
    }
  }
}

const combination = (array, size) => {
  let output = [];
  getCombinations(array, size, 0, [], output);
  return output;
}

const isValidSet = (set) => {
  let a = set[0];
  let b = set[1];
  let c = set[2];

  if (!((a.number == b.number) && (b.number == c.number) ||
    (a.number != b.number) && (a.number != c.number) && (b.number != c.number))) {
    return false;
  }
  if (!((a.shape == b.shape) && (b.shape == c.shape) ||
    (a.shape != b.shape) && (a.shape != c.shape) && (b.shape != c.shape))) {
    return false;
  }
  if (!((a.filling == b.filling) && (b.filling == c.filling) ||
    (a.filling != b.filling) && (a.filling != c.filling) && (b.filling != c.filling))) {
    return false;
  }
  if (!((a.color == b.color) && (b.color == c.color) ||
    (a.color != b.color) && (a.color != c.color) && (b.color != c.color))) {
    return false;
  }
  return true;
};

class CreateCard {
  constructor(id, color, shape, number, filling) {
    this.id = id;
    this.color = color;
    this.shape = shape;
    this.number = number;
    this.filling = filling;
    this.status = 'deck';
    this.set = false;
  }
}

const createDeck = () => {
  let deck = [];
  let id = 1;

  for (let color of [1, 2, 3]) {
    for (let shape of [1, 2, 3]) {
      for (let number of [1, 2, 3]) {
        for (let filling of [1, 2, 3]) {
          deck.push(new CreateCard(id++, color, shape, number, filling));
        }
      }
    }
  }

  return deck;
};

const createTable = () => {
  let deck = createDeck();
  let table = [];

  for (let i = 0; i < 12; i++) {
    let random = Math.floor(Math.random() * deck.length);
    let randomCard = deck[random];
    table.push(randomCard);
    randomCard.status = 'table';
    deck.splice(random, 1);
  }

  return { table, deck };
};

let userValidSetsCounter = 0;
let gameState = {
  table: [],
  deck: [],
  gameOver: false,
  lastValidSet: [],
  gameStatus: 'off'
};

const getTheIds = (cards) => {
  let a = combination(cards, 3).filter(set => isValidSet(set));
  return (a.map(e => e.map(m => m.id)));
};

const getThreeCards = (deck) => {
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

const checkForSets = (remainingCards) => {
  if (remainingCards.length < 22) {
    return combination(remainingCards, 3).some(set => isValidSet(set));
  }
  return false;
};

// UI Rendering Functions
const renderCard = (card) => {
  if (card.status === 'empty') {
    return `<div class="card empty-card"></div>`;
  }

  let cardItems = '';
  for (let i = 0; i < card.number; i++) {
    cardItems += renderCardShape(card.id, card.shape, card.color, card.filling);
  }

  return `
    <div class="card"
         onclick="handleCardClick(${card.id})"
         style="border-color: ${card.set ? 'lightpink' : 'darkgrey'}">
      ${cardItems}
    </div>
  `;
};

const renderCardShape = (id, shape, color, filling) => {
  const colorMap = {
    1: 'DeepSkyBlue',
    2: 'Crimson',
    3: 'black'
  };
  const fillMap = {
    1: 'none',
    2: 'striped',
    // 2: 'none',
    3: colorMap[color]
  };

  const shapeMap = {
    1: 'rectangle',
    2: 'circle',
    3: 'triangle'
  };

  const actualColor = colorMap[color];
  const actualFill = fillMap[filling];

  if (shape === 1) {
    return renderReactShape(id, actualColor, actualFill);
  } else if (shape === 2) {
    return renderRubyShape(id, actualColor, actualFill);
  } else {
    return renderGhShape(id, actualColor, actualFill);
  }
};


const renderReactShape = (id, color, filling) => {
  return `
    <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 100 100" style="margin: 2px">
      <defs>
        <pattern id="react-stripes-${id}" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" style="stroke:${color}; stroke-width:3" />
        </pattern>
      </defs>
      <rect width="80" height="40" x="10" y="30"
            style="stroke: ${color}; fill: ${filling === 'striped' ? `url(#react-stripes-${id})` : filling}; stroke-width: 6"/>
    </svg>
  `;
};

const renderRubyShape = (id, color, filling) => {
  return `
    <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 100 100" style="margin: 2px">
      <defs>
        <pattern id="ruby-stripes-${id}" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" style="stroke:${color}; stroke-width:3" />
        </pattern>
      </defs>
      <circle cx="50" cy="50" r="30"
              style="stroke: ${color}; fill: ${filling === 'striped' ? `url(#ruby-stripes-${id})` : filling}; stroke-width: 6"/>
    </svg>
  `;
};

const renderGhShape = (id, color, filling) => {
  return `
    <svg width="10mm" height="10mm" version="1.1" viewBox="0 0 100 100" style="margin: 2px">
      <defs>
        <pattern id="gh-stripes-${id}" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" style="stroke:${color}; stroke-width:3" />
        </pattern>
      </defs>
      <polygon points="50,20 20,80 80,80"
               style="stroke: ${color}; fill: ${filling === 'striped' ? `url(#gh-stripes-${id})` : filling}; stroke-width: 6"/>
    </svg>
  `;
};

// Game Actions
const handleCardClick = (id) => {
  const card = gameState.table.find(c => c.id === id);
  if (card) {
    card.set = !card.set;
  }

  const selectedCards = gameState.table.filter(c => c.set);
  if (selectedCards.length === 3) {
    checkSelectedSet();
  }

  renderGame();
};

const checkSelectedSet = () => {
  const selectedCards = gameState.table.filter(c => c.set);

  if (isValidSet(selectedCards)) {
    userValidSetsCounter++;
    handleValidSet(selectedCards);
  } else {
    selectedCards.forEach(card => card.set = false);
  }
};

let startTime;
let timerInterval;

const startTimer = () => {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
};

const displayTimer = () => {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const updateTimer = () => {
  displayTimer();
};
const stopTimer = () => {
  clearInterval(timerInterval);
  displayTimer();
};

const handleValidSet = (validSet) => {
  gameState.lastValidSet = validSet;

  if (gameState.table.length > 12) {
    gameState.table = gameState.table.filter(card =>
      !validSet.find(v => v.id === card.id)
    );
  } else {
    gameState.table = gameState.table.map(card => {
      if (!card.set) return card;

      if (gameState.deck.length > 0) {
        const random = Math.floor(Math.random() * gameState.deck.length);
        const newCard = gameState.deck[random];
        gameState.deck.splice(random, 1);
        return newCard;
      }

      return {
        id: parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100,
        status: 'empty'
      };
    });
  }

  const setsLeft = combination(gameState.table.filter(c => c.status !== 'empty'), 3).filter(set => isValidSet(set)).length;
  if (gameState.deck.length === 0 && setsLeft === 0) {
    gameState.gameOver = true;
    stopTimer();
  }
};

const startNewGame = () => {
  const newGameState = createTable();
  gameState = {
    ...gameState,
    ...newGameState,
    gameStatus: 'on',
    gameOver: false,
    lastValidSet: []
  };
  userValidSetsCounter = 0;
  startTimer();
  renderGame();
};

const addThreeCards = () => {
  if (gameState.deck.length > 0) {
    const newCards = getThreeCards(gameState.deck);
    gameState.table = [...gameState.table, ...newCards];
    renderGame();
  }
};

const highlightHintCard = () => {
  const validSets = combination(gameState.table.filter(c => c.status !== 'empty'), 3).filter(set => isValidSet(set));
  if (validSets.length > 0) {
    const hintCard = validSets[0][0];
    hintCard.set = true;
    const cardElement = document.querySelector(`.card[onclick="handleCardClick(${hintCard.id})"]`);
    if (cardElement) {
      cardElement.style.borderColor = 'yellow';
    }
  }

  const selectedCards = gameState.table.filter(c => c.set);
  if (selectedCards.length === 3) {
    checkSelectedSet();
  }

  renderGame();
};
// Render game state to DOM
const renderGame = () => {
  const container = document.getElementById('gameContainer');
  const setsAvailable = combination(gameState.table.filter(c => c.status !== 'empty'), 3)
    .filter(set => isValidSet(set)).length;

  const currentTimer = document.getElementById('timer')?.textContent || '0:00';

  const info = gameState.gameStatus === 'on' ? `
    <div class="info-timer-container">
      <div class="info">
        in deck <span class="stats-info">${gameState.deck.length}</span>
        sets found <span class="stats-info">${userValidSetsCounter}</span>
        sets available <span class="stats-info"
          style="background-color: ${setsAvailable === 0 ? 'lightcoral' : '#f0f0f0'};">
          ${setsAvailable}
        </span>
      </div>
      <span id="timer">${currentTimer}</span>
    </div>
    <div class="game-over">${gameState.gameOver ? "Well done! Game complete! 🎉" : ''}</div>
  ` : '';

  const rightButtons = gameState.gameStatus === 'on' ? `
    <div class="right-buttons">
      <button class="hint" onclick="highlightHintCard()">Hint</button>
      <button class="add-cards" onclick="addThreeCards()" ${gameState.deck.length === 0 ? 'disabled' : ''}>Add 3 cards</button>
    </div>
  ` : '';

  const cards = gameState.table.map(card => renderCard(card)).join('');

  container.innerHTML = `
    <div class="button-container">
      <button class="new-game" onclick="startNewGame()">New Game</button>
      ${rightButtons}
    </div>
    ${info}<br>
    <div class="cards-container">
      ${cards}
    </div>
  `;
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  renderGame();
});

