import { isValidSet, getThreeCards, setsAvailable } from './utils.js';
import { initialCards  } from './deckManager.js';
import { renderCard } from './renderShapes.js';
import { startTimer, resetTimer, stopTimer } from '../timer.js';

let gameState;

const replaceCardsFromDeck = () => {
  return gameState.table.map(card => {
    if (!card.set) return card;

    if (gameState.deck.length > 0) {
      const random = Math.floor(Math.random() * gameState.deck.length);
      const newCard = gameState.deck[random];
      gameState.deck.splice(random, 1);
      return newCard;
    }

    return generateEmptyCard();
  });
};

const generateEmptyCard = () => {
  return {
    id: parseInt((Math.random() * 1000), 100) + 100,
    status: 'empty'
  };
};

const handleValidSet = (validSet) => {
  gameState.lastValidSet = validSet;

  if (gameState.table.length > 12) {
    gameState.table = gameState.table.filter(card => !validSet.find(v => v.id === card.id));
  } else {
    gameState.table = replaceCardsFromDeck();
  }

  gameState.setsAvailable = setsAvailable(gameState.table);
  if (gameState.deck.length === 0 && gameState.setsAvailable.length === 0) {
    gameState.gameOver = true;
    stopTimer();
  }
};

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
    gameState.validSetsCounter++;
    handleValidSet(selectedCards);
  } else {
    selectedCards.forEach(card => card.set = false);
  }
};

const startNewGame = () => {
  const [table, deck] = initialCards();
  gameState = {
    deck: deck,
    table: table,
    gameOver: false,
    lastValidSet: [],
    gameStatus: 'on',
    validSetsCounter: 0,
    setsAvailable: setsAvailable(table)
  };
  renderGame();
  resetTimer();
  startTimer();
};

const addThreeCards = () => {
  if (gameState.deck.length > 0) {
    const newCards = getThreeCards(gameState.deck);
    gameState.table = [...gameState.table, ...newCards];
    gameState.setsAvailable = setsAvailable(gameState.table);
    renderGame();
  }
};

const highlightHintCard = () => {
  if (gameState.setsAvailable.length > 0) {
    gameState.table.forEach(card => card.set = false);
    const hintCard = gameState.setsAvailable[0][0];
    hintCard.set = true;
    renderGame();
  }
};

const generateGameInfoHTML = (currentTimer) => {
  return gameState.gameStatus === 'on' ? `
    <div class="info-timer-container">
      <div class="info">
        in deck <span class="stats-info">${gameState.deck.length}</span>
        sets found <span class="stats-info">${gameState.validSetsCounter}</span>
        sets available <span class="stats-info"
          style="background-color: ${gameState.setsAvailable.length === 0 ? '#ffc3c3' : '#f0f0f0'};">
          ${gameState.setsAvailable.length}
        </span>
      </div>
      <span id="timer">${currentTimer}</span>
    </div>
    <div class="game-over">${gameState.gameOver ? "Well done! Game complete! 🎉" : ''}</div>
  ` : '';
};

const generateGameControlButtonsHTML = () => {
  return gameState.gameStatus === 'on' ? `
    <div class="right-buttons">
      <button class="hint">Hint</button>
      <button class="add-cards" ${gameState.deck.length === 0 ? 'disabled' : ''}>Add 3 cards</button>
    </div>
  ` : '';
};

const addEventListeners = () => {
  document.querySelector('.new-game').addEventListener('click', startNewGame);
  document.querySelector('.hint')?.addEventListener('click', highlightHintCard);
  document.querySelector('.add-cards')?.addEventListener('click', addThreeCards);

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const cardId = parseInt(card.dataset.cardId);
      if (cardId) handleCardClick(cardId);
    });
  });
};

const renderGame = () => {
  const container = document.getElementById('gameContainer');
  const currentTimer = document.getElementById('timer')?.textContent || '0:00';
  const info = generateGameInfoHTML(currentTimer);
  const rightButtons = generateGameControlButtonsHTML();
  const cards = gameState.table.map(card => renderCard(card)).join('');

  container.innerHTML = `
    <div class="button-container">
      <button class="new-game">New Game</button>
      ${rightButtons}
    </div>
    ${info}
    <div class="cards-container">
      ${cards}
    </div>
  `;

  addEventListeners();
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  startNewGame();
});


window.startNewGame = startNewGame;
window.handleCardClick = handleCardClick;
window.addThreeCards = addThreeCards;
window.highlightHintCard = highlightHintCard;

