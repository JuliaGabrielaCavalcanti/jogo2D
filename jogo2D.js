// Configurações iniciais
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajustar o tamanho do canvas para a tela
function resizeCanvas() {
  canvas.width = window.innerWidth;  // Largura total da janela
  canvas.height = window.innerHeight; // Altura total da janela
}

// Inicializa o tamanho do canvas
resizeCanvas();

// Parâmetros da pista
const trackWidth = 600; // Largura fixa da pista
const trackHeight = canvas.height; // A pista vai ter a altura total da tela
const trackX = (canvas.width - trackWidth) / 2; // Centraliza a pista na tela

// Parâmetros do carrinho
const carWidth = 80;
const carHeight = 40;
const carSpeed = 5;
let carX = trackX + (trackWidth / 2) - (carWidth / 2); // Inicia o carrinho no centro da pista
let carY = canvas.height - carHeight - 20; // Carrinho fica um pouco acima do fundo

// Obstáculos
const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 20;
const obstacleSpeed = 2;

// Controle de movimento
let rightPressed = false;
let leftPressed = false;

// Variáveis de pontuação
let score = 0;
let gameOver = false;

// Função de controle do teclado
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Função para desenhar a pista (faixa de corrida)
function drawTrack() {
  ctx.fillStyle = "#2c3e50"; // Cor da pista (cinza escuro)
  ctx.fillRect(trackX, 0, trackWidth, trackHeight); // A pista ocupa o centro da tela

  // Linha central da pista
  ctx.strokeStyle = "#ffffff"; // Cor da linha central (branca)
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 20]); // Linha tracejada
  ctx.beginPath();
  ctx.moveTo(trackX + trackWidth / 2, 0); // Linha começa do topo
  ctx.lineTo(trackX + trackWidth / 2, canvas.height); // Linha vai até o fundo
  ctx.stroke();
  ctx.setLineDash([]); // Reseta o estilo de linha
}

// Função para desenhar o carrinho (agora mais bonitinho)
function drawCar() {
  // Corpo do carro (forma arredondada)
  ctx.beginPath();
  ctx.moveTo(carX + 10, carY); // Começo do desenho
  ctx.lineTo(carX + carWidth - 10, carY); // Linha superior
  ctx.quadraticCurveTo(carX + carWidth, carY, carX + carWidth, carY + 10); // Curvando a borda direita
  ctx.lineTo(carX + carWidth, carY + carHeight - 10); // Linha inferior direita
  ctx.quadraticCurveTo(carX + carWidth, carY + carHeight, carX + carWidth - 10, carY + carHeight); // Curvando a borda inferior direita
  ctx.lineTo(carX + 10, carY + carHeight); // Linha inferior esquerda
  ctx.quadraticCurveTo(carX, carY + carHeight, carX, carY + carHeight - 10); // Curvando a borda inferior esquerda
  ctx.lineTo(carX, carY + 10); // Linha superior esquerda
  ctx.quadraticCurveTo(carX, carY, carX + 10, carY); // Curvando a borda superior
  ctx.closePath();
  ctx.fillStyle = "#3498db"; // Cor do carrinho (azul bonito)
  ctx.fill();

  // Janela do carro
  ctx.beginPath();
  ctx.rect(carX + 15, carY + 10, carWidth - 30, carHeight / 2 - 10); // Janela central
  ctx.fillStyle = "#ffffff"; // Cor da janela
  ctx.fill();
  ctx.closePath();

  // Rodas (utilizando círculos)
  ctx.beginPath();
  ctx.arc(carX + 20, carY + carHeight, 10, 0, Math.PI * 2); // Roda esquerda
  ctx.arc(carX + carWidth - 20, carY + carHeight, 10, 0, Math.PI * 2); // Roda direita
  ctx.fillStyle = "#34495e"; // Cor das rodas (preto escurinho)
  ctx.fill();
  ctx.closePath();
}

// Função para desenhar os obstáculos
function drawObstacles() {
  ctx.fillStyle = "#FF0000"; // Cor dos obstáculos (vermelho)
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
  }
}

// Função para desenhar o placar
function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#000000";  // Alterado para preto
  ctx.fillText("Pontos: " + score, 10, 30);
}

// Função para movimentar o carrinho
function moveCar() {
  if (rightPressed && carX < trackX + trackWidth - carWidth) {
    carX += carSpeed; // Mover para a direita
  }
  if (leftPressed && carX > trackX) {
    carX -= carSpeed; // Mover para a esquerda
  }
}

// Função para movimentar os obstáculos
function moveObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacleSpeed; // Movimenta os obstáculos para baixo
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1); // Remove obstáculos que saíram da tela
      score++; // Aumenta a pontuação
      createObstacle(); // Cria um novo obstáculo
    }
  }
}

// Função para verificar colisões
function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    if (
      carX < obstacle.x + obstacleWidth &&
      carX + carWidth > obstacle.x &&
      carY < obstacle.y + obstacleHeight &&
      carY + carHeight > obstacle.y
    ) {
      gameOver = true; // Se houve colisão, o jogo acaba
    }
  }
}

// Função para criar obstáculos
function createObstacle() {
  const x = Math.random() * (trackWidth - obstacleWidth) + trackX; // Obstáculos aparecem aleatoriamente dentro da pista
  obstacles.push({ x: x, y: -obstacleHeight }); // Começam acima da tela
}

// Função para reiniciar o jogo
function restartGame() {
  score = 0;
  obstacles.length = 0;
  carX = trackX + (trackWidth / 2) - (carWidth / 2);
  carY = canvas.height - carHeight - 20;
  gameOver = false;
  createObstacle();
  draw();
}

// Função principal para desenhar e atualizar o jogo
function draw() {
  if (gameOver) {
    // Exibe a tela de Game Over
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "36px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("GAME OVER!", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = "24px Arial";
    ctx.fillText("Pontuação final: " + score, canvas.width / 2 - 90, canvas.height / 2);

    // Botão para reiniciar o jogo
    const restartButton = document.createElement("button");
    restartButton.innerHTML = "Reiniciar";
    restartButton.style.position = "absolute";
    restartButton.style.left = "50%";
    restartButton.style.top = "60%";
    restartButton.style.transform = "translateX(-50%)";
    restartButton.style.fontSize = "20px";
    document.body.appendChild(restartButton);

    restartButton.onclick = function () {
      document.body.removeChild(restartButton);
      restartGame();
    };

    return;
  }

  // Limpa a tela
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha a pista
  drawTrack();
  moveCar();
  moveObstacles();
  drawCar();
  drawObstacles();
  drawScore();
  checkCollisions();

  requestAnimationFrame(draw); // Atualiza o jogo continuamente
}

// Inicia o jogo criando obstáculos periodicamente
setInterval(createObstacle, 1500);

// Ajustar o tamanho do canvas sempre que a janela for redimensionada
window.addEventListener('resize', resizeCanvas);

// Começa o jogo
draw();
