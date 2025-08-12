// Gerenciamento do estado do jogo
const state = {
    score: {
        playerWins: 0,
        computerWins: 0
    },
    cardData: [
        {
            id: 0,
            name: "Dragão Branco de Olhos Azuis",
            type: "Papel",
            img: "./src/assets/icons/dragon.png",
            winOf: [1], // vence contra Pedra (Mago Negro)
            loseOf: [2] // perde contra Tesoura (Exodia)
        },
        {
            id: 1,
            name: "Mago Negro", 
            type: "Pedra",
            img: "./src/assets/icons/exodia.png",
            winOf: [2], // vence contra Tesoura (Exodia)
            loseOf: [0] // perde contra Papel (Dragão Branco)
        },
        {
            id: 2,
            name: "Exodia",
            type: "Tesoura", 
            img: "./src/assets/icons/magician.png",
            winOf: [0], // vence contra Papel (Dragão Branco)
            loseOf: [1] // perde contra Pedra (Mago Negro)
        }
    ],
    playerCard: null,
    computerCard: null,
    actions: {
        button: null
    }
};

// Elementos do DOM
const playerCards = document.querySelectorAll('.card');
const playerCardDisplay = document.getElementById('player-card');
const computerCardDisplay = document.getElementById('computer-card');
const resultText = document.getElementById('result-text');
const scoreDisplay = document.getElementById('score-points');
const nextDuelButton = document.getElementById('next-duel');
const bgm = document.getElementById('bgm');

// Elementos de áudio
const winAudio = new Audio('./src/assets/audios/win.wav');
const loseAudio = new Audio('./src/assets/audios/lose.wav');

// Inicializar jogo
function init() {
    // Iniciar música de fundo
    bgm.volume = 0.3;
    bgm.play().catch(() => {
        // Auto-play pode estar bloqueado, usuário precisa interagir primeiro
        document.addEventListener('click', () => {
            bgm.play();
        }, { once: true });
    });

    // Adicionar event listeners às cartas
    playerCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardId = parseInt(card.getAttribute('data-id'));
            selectPlayerCard(cardId);
        });
    });

    // Adicionar event listener ao botão próximo duelo
    nextDuelButton.addEventListener('click', resetDuel);

    // Atualizar exibição da pontuação
    updateScoreDisplay();
}

// Selecionar carta do jogador
function selectPlayerCard(cardId) {
    // Remover seleções anteriores
    playerCards.forEach(card => card.classList.remove('selected'));
    
    // Selecionar carta atual
    const selectedCard = document.getElementById(`card-${cardId}`);
    selectedCard.classList.add('selected');
    
    // Definir carta do jogador
    state.playerCard = state.cardData[cardId];
    
    // Gerar carta do computador
    generateComputerCard();
    
    // Iniciar duelo
    playDuel();
}

// Gerar carta aleatória do computador
function generateComputerCard() {
    const randomId = Math.floor(Math.random() * state.cardData.length);
    state.computerCard = state.cardData[randomId];
}

// Jogar o duelo
function playDuel() {
    // Desabilitar seleção de cartas
    playerCards.forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.6';
    });

    // Mostrar cartas com animação de virar
    setTimeout(() => {
        showPlayerCard();
    }, 500);
    
    setTimeout(() => {
        showComputerCard();
    }, 1000);
    
    setTimeout(() => {
        checkDuelResult();
    }, 1500);
}

// Mostrar carta do jogador
function showPlayerCard() {
    const cardImg = playerCardDisplay.querySelector('img');
    cardImg.classList.add('card-flip');
    
    setTimeout(() => {
        cardImg.src = state.playerCard.img;
        cardImg.alt = state.playerCard.name;
    }, 300);
}

// Mostrar carta do computador
function showComputerCard() {
    const cardImg = computerCardDisplay.querySelector('img');
    cardImg.classList.add('card-flip');
    
    setTimeout(() => {
        cardImg.src = state.computerCard.img;
        cardImg.alt = state.computerCard.name;
    }, 300);
}

// Verificar resultado do duelo
function checkDuelResult() {
    let result = '';
    let resultClass = '';
    
    // Adicionar animação de batalha
    playerCardDisplay.classList.add('battle-animation');
    computerCardDisplay.classList.add('battle-animation');
    
    setTimeout(() => {
        if (state.playerCard.id === state.computerCard.id) {
            // Empate
            result = `É um empate! Ambos os jogadores escolheram ${state.playerCard.name}`;
            resultClass = 'draw';
        } else if (state.playerCard.winOf.includes(state.computerCard.id)) {
            // Jogador vence
            result = `Você venceu! ${state.playerCard.name} derrota ${state.computerCard.name}`;
            resultClass = 'win';
            state.score.playerWins++;
            playWinSound();
        } else {
            // Computador vence
            result = `Você perdeu! ${state.computerCard.name} derrota ${state.playerCard.name}`;
            resultClass = 'lose';
            state.score.computerWins++;
            playLoseSound();
        }
        
        // Atualizar exibição do resultado
        resultText.innerHTML = `<p>${result}</p>`;
        resultText.className = `result-container framed ${resultClass}`;
        
        // Atualizar pontuação
        updateScoreDisplay();
        
        // Mostrar botão próximo duelo
        nextDuelButton.style.display = 'inline-block';
        
        // Remover animação de batalha
        playerCardDisplay.classList.remove('battle-animation');
        computerCardDisplay.classList.remove('battle-animation');
    }, 1000);
}

// Tocar som de vitória
function playWinSound() {
    winAudio.currentTime = 0;
    winAudio.play().catch(() => {});
}

// Tocar som de derrota
function playLoseSound() {
    loseAudio.currentTime = 0;
    loseAudio.play().catch(() => {});
}

// Atualizar exibição da pontuação
function updateScoreDisplay() {
    scoreDisplay.textContent = `Vitórias: ${state.score.playerWins} | Derrotas: ${state.score.computerWins}`;
}

// Resetar duelo para próxima rodada
function resetDuel() {
    // Resetar exibição das cartas
    const playerCardImg = playerCardDisplay.querySelector('img');
    const computerCardImg = computerCardDisplay.querySelector('img');
    
    playerCardImg.src = './src/assets/icons/card-back.png';
    playerCardImg.alt = 'Carta do Jogador';
    playerCardImg.classList.remove('card-flip');
    
    computerCardImg.src = './src/assets/icons/card-back.png';
    computerCardImg.alt = 'Carta do Computador';
    computerCardImg.classList.remove('card-flip');
    
    // Resetar exibição do resultado
    resultText.innerHTML = '<p>Escolha sua carta para duelar!</p>';
    resultText.className = 'result-container framed';
    
    // Esconder botão próximo duelo
    nextDuelButton.style.display = 'none';
    
    // Reabilitar seleção de cartas
    playerCards.forEach(card => {
        card.style.pointerEvents = 'auto';
        card.style.opacity = '0.8';
        card.classList.remove('selected');
    });
    
    // Resetar estado
    state.playerCard = null;
    state.computerCard = null;
}

// Inicializar jogo quando a página carregar
document.addEventListener('DOMContentLoaded', init);