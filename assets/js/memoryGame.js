import { httpStatusCodes } from './httpStatusCodes.js';
import { startTimer, resetTimer, stopTimer } from './timer.js';

class MemoryGame {
  constructor(container) {
    this.container = container;
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.pairsFound = 0;
    this.isLocked = false;

    this.init();
  }

  init() {
    // Get unique pairs and create their matching pairs
    const codePairs = this.getRandomPairs(21);
    const messagePairs = codePairs.map(item => ({
      ...item,
      isCode: false
    }));

    // Combine and shuffle all cards
    this.cards = this.shuffleCards([...codePairs, ...messagePairs]);
    this.renderBoard();
    this.updateStats();
    resetTimer();
    startTimer();
  }

  getRandomPairs(count) {
    const shuffled = [...httpStatusCodes].sort(() => 0.5 - Math.random());
    const selectedCodes = shuffled.slice(0, count);

    return selectedCodes.map(item => ({
      code: item.code,
      message: item.message,
      type: item.type,
      isCode: true
    }));
  }

  shuffleCards(cards) {
    return cards.sort(() => 0.5 - Math.random());
  }

  renderBoard() {
    this.container.innerHTML = '';
    this.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
          <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back ${card.type}">${card.isCode ? card.code : card.message}</div>
          </div>
        `;
      cardElement.addEventListener('click', () => this.flipCard(index));
      this.container.appendChild(cardElement);
    });

    this.adjustFontSize();
  }

  adjustFontSize() {
    document.querySelectorAll('.card-back').forEach(card => {
      const text = card.textContent.trim();
      let fontSize;

      if (text.length <= 3) {
          fontSize = 'clamp(12px, 3.5vw, 24px)';
      } else if (text.length <= 12) {
          fontSize = 'clamp(8px, 2vw, 16px)';
      } else {
          fontSize = 'clamp(6px, 1.2vw, 12px)';
      }

      card.style.fontSize = fontSize;
    });
  }

  flipCard(index) {
    if (this.isLocked) return;
    if (this.flippedCards.length === 2) return;
    if (this.flippedCards.includes(index)) return;

    const cardElement = this.container.children[index];

    if (cardElement.classList.contains('matched')) return;

    cardElement.classList.add('flipped');
    this.flippedCards.push(index);

    if (this.flippedCards.length === 2) {
      this.isLocked = true;
      this.moves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    const firstCard = this.cards[first];
    const secondCard = this.cards[second];
    const isMatch = firstCard.code === secondCard.code && firstCard.isCode !== secondCard.isCode;

    this.isLocked = true;
    setTimeout(() => {
      if (isMatch) {
        this.pairsFound++;
        this.updateStats();

        this.container.children[first].classList.add('matched');
        this.container.children[second].classList.add('matched');

        if (this.pairsFound === this.cards.length / 2) {
          stopTimer();
          document.getElementById('game-complete-message').style.display = 'block';
        }
      } else {
        const cards = this.container.children;
        cards[first].classList.remove('flipped');
        cards[second].classList.remove('flipped');
      }
      this.flippedCards = [];
      this.isLocked = false;
    }, 1000);
  }

  updateStats() {
    document.getElementById('moves').textContent = this.moves;
    document.getElementById('pairs').textContent = this.pairsFound;
  }

  restart() {
    this.flippedCards = [];
    this.moves = 0;
    this.pairsFound = 0;
    this.isLocked = false;
    this.init();
  }
}

// Initialize the game
const game = new MemoryGame(document.getElementById('gameBoard'));
document.getElementById('restart').addEventListener('click', () => {
  game.restart();
  resetTimer();
  startTimer();
});
