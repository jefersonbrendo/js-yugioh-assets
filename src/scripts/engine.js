// Game state management
const state = {
    score: {
        playerWins: 0,
        computerWins: 0
    },
    cardData: [
        {
            id: 0,
            name: "Blue Eyes White Dragon",
            type: "Paper",
            img: "./src/assets/icons/dragon.png",
            winOf: [1], // wins against Rock (Dark Magician)
            loseOf: [2] // loses against Scissors (Exodia)
        },
        {
            id: 1,
            name: "Dark Magician", 
            type: "Rock",
            img: "./src/assets/icons/exodia.png",
            winOf: [2], // wins against Scissors (Exodia)
            loseOf: [0] // loses against Paper (Blue Eyes)
        },
        {
            id: 2,
            name: "Exodia",
            type: "Scissors", 
            img: "./src/assets/icons/magician.png",
            winOf: [0], // wins against Paper (Blue Eyes)
            loseOf: [1] // loses against Rock (Dark Magician)
        }
    ],
    playerCard: null,
    computerCard: null,
    actions: {
        button: null
    }
};

// DOM elements
const playerCards = document.querySelectorAll('.card');
const playerCardDisplay = document.getElementById('player-card');
const computerCardDisplay = document.getElementById('computer-card');
const resultText = document.getElementById('result-text');
const scoreDisplay = document.getElementById('score-points');
const nextDuelButton = document.getElementById('next-duel');
const bgm = document.getElementById('bgm');

// Audio elements
const winAudio = new Audio('./src/assets/audios/win.wav');
const loseAudio = new Audio('./src/assets/audios/lose.wav');

// Initialize game
function init() {
    // Start background music
    bgm.volume = 0.3;
    bgm.play().catch(() => {
        // Auto-play might be blocked, user needs to interact first
        document.addEventListener('click', () => {
            bgm.play();
        }, { once: true });
    });

    // Add event listeners to cards
    playerCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardId = parseInt(card.getAttribute('data-id'));
            selectPlayerCard(cardId);
        });
    });

    // Add event listener to next duel button
    nextDuelButton.addEventListener('click', resetDuel);

    // Update score display
    updateScoreDisplay();
}

// Select player card
function selectPlayerCard(cardId) {
    // Remove previous selections
    playerCards.forEach(card => card.classList.remove('selected'));
    
    // Select current card
    const selectedCard = document.getElementById(`card-${cardId}`);
    selectedCard.classList.add('selected');
    
    // Set player card
    state.playerCard = state.cardData[cardId];
    
    // Generate computer card
    generateComputerCard();
    
    // Start duel
    playDuel();
}

// Generate random computer card
function generateComputerCard() {
    const randomId = Math.floor(Math.random() * state.cardData.length);
    state.computerCard = state.cardData[randomId];
}

// Play the duel
function playDuel() {
    // Disable card selection
    playerCards.forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.6';
    });

    // Show cards with flip animation
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

// Show player card
function showPlayerCard() {
    const cardImg = playerCardDisplay.querySelector('img');
    cardImg.classList.add('card-flip');
    
    setTimeout(() => {
        cardImg.src = state.playerCard.img;
        cardImg.alt = state.playerCard.name;
    }, 300);
}

// Show computer card  
function showComputerCard() {
    const cardImg = computerCardDisplay.querySelector('img');
    cardImg.classList.add('card-flip');
    
    setTimeout(() => {
        cardImg.src = state.computerCard.img;
        cardImg.alt = state.computerCard.name;
    }, 300);
}

// Check duel result
function checkDuelResult() {
    let result = '';
    let resultClass = '';
    
    // Add battle animation
    playerCardDisplay.classList.add('battle-animation');
    computerCardDisplay.classList.add('battle-animation');
    
    setTimeout(() => {
        if (state.playerCard.id === state.computerCard.id) {
            // Draw
            result = `It's a draw! Both players chose ${state.playerCard.name}`;
            resultClass = 'draw';
        } else if (state.playerCard.winOf.includes(state.computerCard.id)) {
            // Player wins
            result = `You win! ${state.playerCard.name} defeats ${state.computerCard.name}`;
            resultClass = 'win';
            state.score.playerWins++;
            playWinSound();
        } else {
            // Computer wins
            result = `You lose! ${state.computerCard.name} defeats ${state.playerCard.name}`;
            resultClass = 'lose';
            state.score.computerWins++;
            playLoseSound();
        }
        
        // Update result display
        resultText.innerHTML = `<p>${result}</p>`;
        resultText.className = `result-container framed ${resultClass}`;
        
        // Update score
        updateScoreDisplay();
        
        // Show next duel button
        nextDuelButton.style.display = 'inline-block';
        
        // Remove battle animation
        playerCardDisplay.classList.remove('battle-animation');
        computerCardDisplay.classList.remove('battle-animation');
    }, 1000);
}

// Play win sound
function playWinSound() {
    winAudio.currentTime = 0;
    winAudio.play().catch(() => {});
}

// Play lose sound
function playLoseSound() {
    loseAudio.currentTime = 0;
    loseAudio.play().catch(() => {});
}

// Update score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Win: ${state.score.playerWins} | Lose: ${state.score.computerWins}`;
}

// Reset duel for next round
function resetDuel() {
    // Reset card displays
    const playerCardImg = playerCardDisplay.querySelector('img');
    const computerCardImg = computerCardDisplay.querySelector('img');
    
    playerCardImg.src = './src/assets/icons/card-back.png';
    playerCardImg.alt = 'Player Card';
    playerCardImg.classList.remove('card-flip');
    
    computerCardImg.src = './src/assets/icons/card-back.png';
    computerCardImg.alt = 'Computer Card';
    computerCardImg.classList.remove('card-flip');
    
    // Reset result display
    resultText.innerHTML = '<p>Choose your card to duel!</p>';
    resultText.className = 'result-container framed';
    
    // Hide next duel button
    nextDuelButton.style.display = 'none';
    
    // Re-enable card selection
    playerCards.forEach(card => {
        card.style.pointerEvents = 'auto';
        card.style.opacity = '0.8';
        card.classList.remove('selected');
    });
    
    // Reset state
    state.playerCard = null;
    state.computerCard = null;
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', init);