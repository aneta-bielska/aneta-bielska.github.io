let timerInterval;
let secondsElapsed = 0;

export function startTimer(updateCallback) {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay(secondsElapsed);
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}

export function resetTimer(updateCallback) {
  clearInterval(timerInterval);
  secondsElapsed = 0;
  updateTimerDisplay(secondsElapsed);

  const timerElement = document.getElementById('timer');
  timerElement.textContent = '0:00';
}

export function stopTimer() {
  clearInterval(timerInterval);
}

const updateTimerDisplay = (secondsElapsed) => {
  document.getElementById('timer').textContent = formatTime(secondsElapsed);
};

export class Timer {
  constructor(updateDisplayCallback) {
    this.updateDisplayCallback = updateDisplayCallback;
  }

  start() {
    startTimer(this.updateDisplayCallback);
  }

  reset() {
    resetTimer(this.updateDisplayCallback);
  }

  stop() {
    stopTimer();
  }
}
