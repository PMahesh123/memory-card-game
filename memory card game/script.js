document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const config = {
        rows: 4,
        cols: 4,
        icons: ['fa-apple', 'fa-bell', 'fa-bolt', 'fa-car', 'fa-cat', 'fa-cloud', 'fa-dog', 'fa-fish'],
        gameBoard: document.getElementById('game-board'),
        movesDisplay: document.getElementById('moves'),
        timerDisplay: document.getElementById('timer'),
        newGameBtn: document.getElementById('new-game'),
        congratsModal: document.getElementById('congrats-modal'),
        finalMoves: document.getElementById('final-moves'),
        finalTime: document.getElementById('final-time'),
        playAgainBtn: document.getElementById('play-again')
    };

    // Game state
    let state = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        timer: 0,
        timerInterval: null,
        totalPairs: (config.rows * config.cols) / 2
    };

    // Initialize the game
    function initGame() {
        resetGameState();
        createCards();
        startTimer();
    }

    // Reset game state
    function resetGameState() {
        state.cards = [];
        state.flippedCards = [];
        state.matchedPairs = 0;
        state.moves = 0;
        state.timer = 0;
        
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
        
        config.movesDisplay.textContent = '0';
        config.timerDisplay.textContent = '00:00';
        config.gameBoard.innerHTML = '';
    }

    // Create cards and shuffle them
    function createCards() {
        // Create pairs of cards
        let cardIcons = [];
        for (let i = 0; i < state.totalPairs; i++) {
            cardIcons.push(config.icons[i]);
            cardIcons.push(config.icons[i]);
        }
        
        // Shuffle the cards
        cardIcons = shuffleArray(cardIcons);
        
        // Create card elements
        for (let i = 0; i < cardIcons.length; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = i;
            card.dataset.icon = cardIcons[i];
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            const icon = document.createElement('i');
            icon.className = `fas ${cardIcons[i]}`;
            cardFront.appendChild(icon);
            
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            
            card.addEventListener('click', flipCard);
            config.gameBoard.appendChild(card);
            
            state.cards.push({
                element: card,
                icon: cardIcons[i],
                isFlipped: false,
                isMatched: false
            });
        }
        
        // Set grid layout
        config.gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    }

    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Flip card when clicked
    function flipCard() {
        const cardIndex = parseInt(this.dataset.index);
        const card = state.cards[cardIndex];
        
        // Don't allow flipping if:
        // - Card is already flipped
        // - Two cards are already flipped
        // - Card is already matched
        if (card.isFlipped || state.flippedCards.length === 2 || card.isMatched) {
            return;
        }
        
        // Flip the card
        card.isFlipped = true;
        this.classList.add('flipped');
        state.flippedCards.push(card);
        
        // Check for match if two cards are flipped
        if (state.flippedCards.length === 2) {
            state.moves++;
            config.movesDisplay.textContent = state.moves;
            
            if (state.flippedCards[0].icon === state.flippedCards[1].icon) {
                // Match found
                state.flippedCards[0].isMatched = true;
                state.flippedCards[1].isMatched = true;
                state.flippedCards[0].element.classList.add('matched');
                state.flippedCards[1].element.classList.add('matched');
                state.matchedPairs++;
                state.flippedCards = [];
                
                // Check if game is complete
                if (state.matchedPairs === state.totalPairs) {
                    endGame();
                }
            } else {
                // No match - flip back after delay
                setTimeout(() => {
                    state.flippedCards[0].isFlipped = false;
                    state.flippedCards[1].isFlipped = false;
                    state.flippedCards[0].element.classList.remove('flipped');
                    state.flippedCards[1].element.classList.remove('flipped');
                    state.flippedCards = [];
                }, 1000);
            }
        }
    }

    // Timer functions
    function startTimer() {
        state.timerInterval = setInterval(() => {
            state.timer++;
            updateTimerDisplay();
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(state.timer / 60).toString().padStart(2, '0');
        const seconds = (state.timer % 60).toString().padStart(2, '0');
        config.timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    // End game
    function endGame() {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        
        // Show congratulations modal
        config.finalMoves.textContent = state.moves;
        config.finalTime.textContent = config.timerDisplay.textContent;
        config.congratsModal.style.display = 'flex';
    }

    // Event listeners
    config.newGameBtn.addEventListener('click', initGame);
    config.playAgainBtn.addEventListener('click', () => {
        config.congratsModal.style.display = 'none';
        initGame();
    });

    // Start the game
    initGame();
});