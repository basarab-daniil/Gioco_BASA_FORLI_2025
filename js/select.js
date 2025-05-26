let selectedCharacters = { 1: null, 2: null };

const characterData = {
    nexarion: { img: "ImmaginiMaliziose/Nexarion/Sprites/Idle3-ezgif.com-crop.png", name: "Nexarion" },
    alyndra: { img: "ImmaginiMaliziose/Alyndra/Sprites/Idle (2) (1).png", name: "Alyndra" },
    aedwyn: { img: "ImmaginiMaliziose/Aedwyn/Sprites/Idle (1).png", name: "Aedwyn" }
};

document.addEventListener("DOMContentLoaded", function() {
    const mode = localStorage.getItem('gameMode');
        document.getElementById('mode-title').innerText = "Seleziona i personaggi per il PvP";
    updatePreviews();
});

function selectCharacter(player, name) {
    selectedCharacters[player] = name;
    // Aggiorna selezione visiva dei bottoni
    document.querySelectorAll(`.character-btn.selected${player}`).forEach(btn => btn.classList.remove(`selected${player}`));
    document.querySelectorAll(`.player-col${player === 1 ? '.left' : '.right'} .character-btn`).forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === characterData[name].name.toLowerCase()) {
            btn.classList.add(`selected${player}`);
        }
    });
    updatePreviews();
}

function updatePreviews() {
    // Player 1
    const preview1 = document.getElementById('preview1');
    preview1.innerHTML = '';
    if (selectedCharacters[1]) {
        const char = characterData[selectedCharacters[1]];
        preview1.innerHTML = `<img src="${char.img}" alt="${char.name}"><div class="char-name">${char.name}</div>`;
    }
    // Player 2
    const preview2 = document.getElementById('preview2');
    preview2.innerHTML = '';
    if (selectedCharacters[2]) {
        const char = characterData[selectedCharacters[2]];
        preview2.innerHTML = `<img src="${char.img}" alt="${char.name}"><div class="char-name">${char.name}</div>`;
    }
}

function confirmSelection() {
    if (!selectedCharacters[1] || !selectedCharacters[2]) {
        alert("Entrambi i giocatori devono selezionare un personaggio!");
        return;
    }
    localStorage.setItem('player1Character', selectedCharacters[1]);
    localStorage.setItem('player2Character', selectedCharacters[2]);
    const mode = localStorage.getItem('gameMode');
    if (mode === '1v1') {
        window.location.href = 'game.html';
    } else {
        window.location.href = 'practice.html';
    }
}