let cardsArray = ['🎄', '🎁', '⭐', '🔔', '❄️', '🍭', '🎉', '🕯️', '🎄', '🎁', '⭐', '🔔', '❄️', '🍭', '🎉', '🕯️'];
let gameCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
const scoreBoard = document.getElementById('score');
const userInfo = document.getElementById('user-info');

document.addEventListener('DOMContentLoaded', () => {
    shuffleCards();
    createBoard();
});

function shuffleCards() {
    gameCards = cardsArray.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const memoryGame = document.getElementById('memory-game');
    memoryGame.innerHTML = '';
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-card', card);
        cardElement.addEventListener('click', flipCard);
        memoryGame.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.getAttribute('data-card');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;
    const isMatch = firstCard.getAttribute('data-card') === secondCard.getAttribute('data-card');

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    score += 10; // Incrementa a pontuação
    scoreBoard.textContent = score;
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function restartGame() {
    score = 0;
    scoreBoard.textContent = score;
    shuffleCards();
    createBoard();
}

function saveScore() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Por favor, insira um nome de usuário.');
        return;
    }

    const scoreData = { username, score };
    fetch('/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pontuação salva:', data);
        alert('Pontuação salva com sucesso!');
    })
    .catch(error => console.error('Erro ao salvar a pontuação:', error));
}

// Ao carregar a página de jogo, exibir o nome do usuário
if (userInfo) {
    const username = localStorage.getItem('username');
    userInfo.textContent = `Jogador: ${username}`;
}

function login() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        window.location.href = 'game.html'; // redireciona para a página do jogo
    } else {
        alert('Por favor, insira um nome de usuário.');
    }
}
