const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
window.addEventListener('resize', () => {
  // Adjust canvas and top bar dimensions on window resize
  const newCanvasWidth = 300;
  const newCanvasHeight = 500;

  canvas.width = newCanvasWidth;
  canvas.height = newCanvasHeight;

  gridSize = Math.floor(canvas.width / 20);
});
window.dispatchEvent(new Event('resize'));
const appleSound = new Audio("audio/eating.mp3"); // Replace "apple.mp3" with your sound file path
const appleImage = new Image();
appleImage.src = 'ap.png';
let snake = [{
  x: 0,
  y: 0
}];
let apple = {
  x: 10,
  y: 10
};
let direction = 'right';
let score = 0;
let gridSize = 20;
let gameInterval;
let touchStartX;
let touchStartY;
const username = "guest";

function initGame() {
  score = 0;
  snake = [{
    x: 0,
    y: 0
  }];
  direction = 'right';
  generateNewApple();

  document.getElementById('landing-screen').style.display = 'none';
  document.getElementById('game-board').style.display = 'block';

  gameInterval = setInterval(() => {
    requestAnimationFrame(() => {
      moveSnake();
      checkCollision();
      drawPlayground();
      drawSnake();
      drawApple();
      drawText();
    });
  }, 100);
}

function drawPlayground() {
  ctx.fillStyle = 'lightgray'; // background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw border using stroke style and line width
  ctx.strokeStyle = '#000'; // border color
  ctx.lineWidth = 5; // border thickness
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Draw shadow (optional)
  // ... implement based on specific shadow design
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    drawSegment(snake[i], i);
  }
}

function drawSegment(segment, index) {
  // Create a linear gradient within each segment, transitioning from green to yellow
  let gradient = ctx.createLinearGradient(0, 0, gridSize, gridSize);
  gradient.addColorStop(1, `rgb(0, ${255 - 5 * index}, 0)`); // Green at start
  gradient.addColorStop(0, `rgb(255, ${200 + 5 * index}, 0)`); // Yellow at end

  // Set fill style and draw the segment with the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
}

function drawApple() {
  ctx.drawImage(appleImage, apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = {
    ...snake[0]
  };
  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  snake.unshift(head);
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    drawText();
    generateNewApple();    
    const newScore = score; 
    localStorage.setItem('score', newScore);
    appleSound.play();
  } else {
    snake.pop();
  }
}

function generateNewApple() {
  do {
    apple.x = Math.floor(Math.random() * (canvas.width / gridSize));
    apple.y = Math.floor(Math.random() * (canvas.height / gridSize));
  } while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));
}

function gameOver() {
  document.getElementById('game-board').style.display = 'none';
  document.getElementById('game-over-popup').style.display = 'block';
  document.getElementById('game-over-score').textContent = `Score: ${score}`;
  clearInterval(gameInterval);
  gameInterval = null;
  const newHighScore = Math.max(HScore, score);
  if (newHighScore !== HScore) {
    localStorage.setItem('Hscore', newHighScore);
  }
}

function changeDirection(newDirection) {
  if (direction !== newDirection &&
    ['up', 'down', 'left', 'right'].includes(newDirection) &&
    (newDirection !== 'up' || direction !== 'down') &&
    (newDirection !== 'down' || direction !== 'up') &&
    (newDirection !== 'left' || direction !== 'right') &&
    (newDirection !== 'right' || direction !== 'left')) {
    direction = newDirection;
  }
}
function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    teleportSnake(head);
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}
function teleportSnake(head) {
  // Calculate opposite side coordinates based on collision side
  head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
  head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);
}

function drawText() {
  const storedUsername = localStorage.getItem('username');
const storedScore = parseInt(localStorage.getItem('score'));
const HScore = parseInt(localStorage.getItem('Hscore'));
  const profileImage = document.getElementById('profile-image');
  const usernameSpan = document.getElementById('username');
  const scoreSpan = document.getElementById('score');
  const scoreSpan1 = document.getElementById('score1');
  const highScoreSpan = document.getElementById('hscore');

  // Update profile image (if applicable)
  profileImage.src = 'images.jpeg'; // Replace with actual path

  // Update username, scores, and high score
  usernameSpan.textContent = storedUsername;
  scoreSpan.textContent = `Score: ${score}`;
  scoreSpan1.textContent = `Current Score: ${score}`;
  highScoreSpan.textContent = `High Score: ${Math.max(HScore, score)}`; // Update high score // Update opponent score (replace with actual logic)
}

document.addEventListener('keydown', (event) => {
  changeDirection(event.key);
});



canvas.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

canvas.addEventListener('touchmove', (event) => {
  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Check for swipes exceeding 100px
  if (Math.abs(deltaX) >= 5 || Math.abs(deltaY) >= 5) {
    event.preventDefault(); // Prevent further movement

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        changeDirection('right');
      } else {
        changeDirection('left');
      }
    } else {
      if (deltaY > 0) {
        changeDirection('down');
      } else {
        changeDirection('up');
      }
    }
  }

  touchStartX = touchEndX; // Update touchStartX for continuous tracking
  touchStartY = touchEndY; // Update touchStartY for continuous tracking
});

document.getElementById('play-button').addEventListener('click',
  () => {
    initGame();
  });
document.getElementById('restart-button').addEventListener('click',
  () => {
    document.getElementById('game-board').style.display = 'block';
    document.getElementById('game-over-popup').style.display = 'none';
    document.getElementById('landing-screen').style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = null;
    initGame();
  });
document.getElementById('exit-button').addEventListener('click',
  () => {
    clearInterval(gameInterval);
    gameInterval = null;
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('game-over-popup').style.display = 'none';
    document.getElementById('landing-screen').style.display = 'block';
  });
  
  drawText();