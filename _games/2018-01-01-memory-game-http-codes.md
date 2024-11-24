---
layout: game
title: "Memory game - HTTP status codes"
permalink: /games/memory-game-http-codes
categories: games
---

<link rel="stylesheet" href="/assets/css/memory_game.css">
<div class="game-header">
  <button id="restart" class="restart-btn">Restart Game</button>
  <div id="timer">0:00</div>
  <p class="stats">Moves: <span id="moves">0</span> | Pairs Found: <span id="pairs">0</span></p>
</div>

<div class="game-complete-wrapper">
  <div id="game-complete-message" style="display: none;">Game complete! 🎉</div>
</div>
<div class="game-container" id="gameBoard"></div>
<script type="module" src="/assets/js/memoryGame.js"></script>
