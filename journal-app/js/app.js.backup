// Journal App - Main JavaScript File

// State Management
const appState = {
    currentEntry: null,
    entries: [],
    currentMood: null,
    moodHistory: [],
    currentReflectionDate: new Date(),
    gameState: {
        isPlaying: false,
        score: 0,
        timeLeft: 60,
        timer: null,
        selectedCells: [],
        foundWords: [],
        board: []
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadData();
    setupEventListeners();
    setupTabs();
    setupJournal();
    setupMoodTracker();
    setupReflection();
    setupGame();
    showWelcomeModal();
    updateUI();
}

// Data Persistence
function loadData() {
    const savedEntries = localStorage.getItem('journalEntries');
    const savedMoods = localStorage.getItem('moodHistory');
    const savedReflections = localStorage.getItem('reflections');
    
    if (savedEntries) {
        appState.entries = JSON.parse(savedEntries);
    }
    
    if (savedMoods) {
        appState.moodHistory = JSON.parse(savedMoods);
    }
    
    if (savedReflections) {
        appState.reflections = JSON.parse(savedReflections);
    } else {
        appState.reflections = {};
    }
}

function saveData() {
    localStorage.setItem('journalEntries', JSON.stringify(appState.entries));
    localStorage.setItem('moodHistory', JSON.stringify(appState.moodHistory));
    localStorage.setItem('reflections', JSON.stringify(appState.reflections));
}

// Tab Navigation
function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Welcome Modal
function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
        modal.classList.add('active');
    }
    
    document.getElementById('closeWelcomeBtn').addEventListener('click', () => {
        modal.classList.remove('active');
        localStorage.setItem('hasSeenWelcome', 'true');
    });
}

// Journal Functionality
function setupJournal() {
    document.getElementById('newEntryBtn').addEventListener('click', createNewEntry);
    document.getElementById('saveEntryBtn').addEventListener('click', saveCurrentEntry);
    document.getElementById('deleteEntryBtn').addEventListener('click', deleteCurrentEntry);
    
    // Auto-save on input
    const titleInput = document.getElementById('entryTitle');
    const contentInput = document.getElementById('entryContent');
    
    let saveTimeout;
    [titleInput, contentInput].forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (appState.currentEntry) {
                    saveCurrentEntry();
                }
            }, 2000);
        });
    });
    
    // Load first entry if available
    if (appState.entries.length > 0) {
        loadEntry(appState.entries[0].id);
    }
}

function createNewEntry() {
    const newEntry = {
        id: Date.now().toString(),
        title: '',
        content: '',
        date: new Date().toISOString(),
        tag: 'general',
        preview: ''
    };
    
    appState.entries.unshift(newEntry);
    appState.currentEntry = newEntry;
    saveData();
    updateUI();
    loadEntry(newEntry.id);
}

function loadEntry(entryId) {
    const entry = appState.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    appState.currentEntry = entry;
    document.getElementById('entryTitle').value = entry.title;
    document.getElementById('entryContent').value = entry.content;
    document.getElementById('entryTag').value = entry.tag;
    document.getElementById('entryDate').textContent = formatDate(entry.date);
    
    updateEntriesList();
}

function saveCurrentEntry() {
    if (!appState.currentEntry) return;
    
    const title = document.getElementById('entryTitle').value;
    const content = document.getElementById('entryContent').value;
    const tag = document.getElementById('entryTag').value;
    
    appState.currentEntry.title = title || 'Untitled Entry';
    appState.currentEntry.content = content;
    appState.currentEntry.tag = tag;
    appState.currentEntry.preview = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    appState.currentEntry.date = appState.currentEntry.date || new Date().toISOString();
    
    saveData();
    updateEntriesList();
    
    // Show save confirmation
    const saveBtn = document.getElementById('saveEntryBtn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span>✓</span>';
    setTimeout(() => {
        saveBtn.innerHTML = originalHTML;
    }, 1000);
}

function deleteCurrentEntry() {
    if (!appState.currentEntry) return;
    
    if (confirm('Are you sure you want to delete this entry?')) {
        appState.entries = appState.entries.filter(e => e.id !== appState.currentEntry.id);
        appState.currentEntry = null;
        saveData();
        updateUI();
        
        // Load next entry or create new one
        if (appState.entries.length > 0) {
            loadEntry(appState.entries[0].id);
        } else {
            document.getElementById('entryTitle').value = '';
            document.getElementById('entryContent').value = '';
            document.getElementById('entryDate').textContent = formatDate(new Date());
        }
    }
}

function updateEntriesList() {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';
    
    appState.entries.forEach(entry => {
        const entryItem = document.createElement('div');
        entryItem.className = 'entry-item';
        if (appState.currentEntry && entry.id === appState.currentEntry.id) {
            entryItem.classList.add('active');
        }
        
        entryItem.innerHTML = `
            <div class="entry-item-title">${entry.title || 'Untitled Entry'}</div>
            <div class="entry-item-date">${formatDate(entry.date)}</div>
            <div class="entry-item-preview">${entry.preview || 'No content yet...'}</div>
        `;
        
        entryItem.addEventListener('click', () => loadEntry(entry.id));
        entriesList.appendChild(entryItem);
    });
}

// Mood Tracker
function setupMoodTracker() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.dataset.mood;
            selectMood(mood);
        });
    });
    
    updateMoodChart();
}

function selectMood(mood) {
    appState.currentMood = mood;
    
    // Update UI
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.mood === mood) {
            btn.classList.add('selected');
        }
    });
    
    // Save mood for today
    const today = new Date().toDateString();
    const existingMood = appState.moodHistory.find(m => m.date === today);
    
    if (existingMood) {
        existingMood.mood = mood;
    } else {
        appState.moodHistory.push({
            date: today,
            mood: mood
        });
    }
    
    // Keep only last 30 days
    appState.moodHistory = appState.moodHistory.slice(-30);
    
    saveData();
    updateMoodChart();
}

function updateMoodChart() {
    const moodChart = document.getElementById('moodChart');
    moodChart.innerHTML = '';
    
    const recentMoods = appState.moodHistory.slice(-14); // Last 14 days
    const moodValues = {
        'excited': 6,
        'happy': 5,
        'calm': 4,
        'neutral': 3,
        'sad': 2,
        'anxious': 1
    };
    
    if (recentMoods.length === 0) {
        moodChart.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No mood data yet. Select a mood to start tracking!</p>';
        return;
    }
    
    recentMoods.forEach(moodData => {
        const bar = document.createElement('div');
        bar.className = 'mood-bar';
        const height = (moodValues[moodData.mood] / 6) * 100;
        bar.style.height = `${height}%`;
        bar.dataset.mood = moodData.mood;
        bar.title = `${formatDate(moodData.date)}: ${moodData.mood}`;
        moodChart.appendChild(bar);
    });
}

// Reflection
function setupReflection() {
    document.getElementById('saveReflectionBtn').addEventListener('click', saveReflection);
    document.getElementById('prevDateBtn').addEventListener('click', () => changeReflectionDate(-1));
    document.getElementById('nextDateBtn').addEventListener('click', () => changeReflectionDate(1));
    
    updateReflectionDate();
    loadReflection();
}

function changeReflectionDate(days) {
    appState.currentReflectionDate = new Date(appState.currentReflectionDate);
    appState.currentReflectionDate.setDate(appState.currentReflectionDate.getDate() + days);
    updateReflectionDate();
    loadReflection();
}

function updateReflectionDate() {
    const dateStr = appState.currentReflectionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentReflectionDate').textContent = dateStr;
}

function loadReflection() {
    const dateKey = appState.currentReflectionDate.toDateString();
    const reflection = appState.reflections[dateKey] || {};
    
    document.getElementById('gratitudeInput').value = reflection.gratitude || '';
    document.getElementById('learnedInput').value = reflection.learned || '';
    document.getElementById('improveInput').value = reflection.improve || '';
    document.getElementById('highlightInput').value = reflection.highlight || '';
}

function saveReflection() {
    const dateKey = appState.currentReflectionDate.toDateString();
    
    appState.reflections[dateKey] = {
        gratitude: document.getElementById('gratitudeInput').value,
        learned: document.getElementById('learnedInput').value,
        improve: document.getElementById('improveInput').value,
        highlight: document.getElementById('highlightInput').value,
        date: appState.currentReflectionDate.toISOString()
    };
    
    saveData();
    
    // Show confirmation
    const btn = document.getElementById('saveReflectionBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Saved!';
    btn.style.background = 'linear-gradient(135deg, var(--success-color), #059669)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

// Game
function setupGame() {
    document.getElementById('startGameBtn').addEventListener('click', startGame);
}

const gameWords = [
    'LOVE', 'HOPE', 'DREAM', 'PEACE', 'JOY', 'CALM', 'HAPPY', 'SMILE',
    'KIND', 'WARM', 'BRIGHT', 'LIGHT', 'SOFT', 'GENTLE', 'SWEET', 'NICE'
];

function startGame() {
    appState.gameState.isPlaying = true;
    appState.gameState.score = 0;
    appState.gameState.timeLeft = 60;
    appState.gameState.foundWords = [];
    appState.gameState.selectedCells = [];
    
    generateGameBoard();
    updateGameUI();
    startGameTimer();
    
    document.getElementById('startGameBtn').disabled = true;
    document.getElementById('startGameBtn').textContent = 'Playing...';
}

function generateGameBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    board.style.gridTemplateColumns = 'repeat(4, 1fr)';
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const boardData = [];
    
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        const letter = letters[Math.floor(Math.random() * letters.length)];
        cell.textContent = letter;
        cell.dataset.index = i;
        cell.addEventListener('click', () => selectGameCell(i));
        board.appendChild(cell);
        boardData.push(letter);
    }
    
    appState.gameState.board = boardData;
}

function selectGameCell(index) {
    if (!appState.gameState.isPlaying) return;
    
    const selected = appState.gameState.selectedCells;
    
    if (selected.includes(index)) {
        // Deselect
        appState.gameState.selectedCells = selected.filter(i => i !== index);
    } else {
        // Select
        appState.gameState.selectedCells.push(index);
    }
    
    updateGameCellSelection();
    checkWord();
}

function updateGameCellSelection() {
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach((cell, index) => {
        cell.classList.remove('selected');
        if (appState.gameState.selectedCells.includes(index)) {
            cell.classList.add('selected');
        }
    });
}

function checkWord() {
    const selected = appState.gameState.selectedCells;
    if (selected.length < 3) return;
    
    const word = selected.map(i => appState.gameState.board[i]).join('');
    
    // Check if word exists in our word list
    if (gameWords.includes(word) && !appState.gameState.foundWords.includes(word)) {
        appState.gameState.foundWords.push(word);
        appState.gameState.score += word.length * 10;
        appState.gameState.selectedCells = [];
        
        // Mark cells as found
        const cells = document.querySelectorAll('.game-cell');
        selected.forEach(index => {
            cells[index].classList.add('found');
        });
        
        updateGameUI();
    }
}

function updateGameUI() {
    document.getElementById('gameScore').textContent = appState.gameState.score;
    document.getElementById('gameTime').textContent = appState.gameState.timeLeft;
    
    const wordsList = document.getElementById('wordsList');
    wordsList.innerHTML = '';
    
    appState.gameState.foundWords.forEach(word => {
        const badge = document.createElement('span');
        badge.className = 'word-badge';
        badge.textContent = word;
        wordsList.appendChild(badge);
    });
}

function startGameTimer() {
    appState.gameState.timer = setInterval(() => {
        appState.gameState.timeLeft--;
        updateGameUI();
        
        if (appState.gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    appState.gameState.isPlaying = false;
    clearInterval(appState.gameState.timer);
    
    document.getElementById('startGameBtn').disabled = false;
    document.getElementById('startGameBtn').textContent = 'Start Game';
    
    alert(`Game Over! Your score: ${appState.gameState.score}\nWords found: ${appState.gameState.foundWords.length}`);
    
    // Reset board
    const board = document.getElementById('gameBoard');
    board.innerHTML = '<div class="game-instructions"><p>Click "Start Game" to begin!</p><p>Find words by connecting letters horizontally, vertically, or diagonally.</p></div>';
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function updateUI() {
    updateEntriesList();
    updateMoodChart();
}


