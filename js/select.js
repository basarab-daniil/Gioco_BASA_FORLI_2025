let selectedCharacter = null;

document.addEventListener("DOMContentLoaded", function() {
    const mode = localStorage.getItem('gameMode');
    if (mode === '1v1') {
        document.getElementById('mode-title').innerText = "Seleziona il tuo personaggio per il PvP";
    } else {
        document.getElementById('mode-title').innerText = "Seleziona il tuo personaggio per la modalità Pratica";
    }
});

function selectCharacter(name) {
    selectedCharacter = name;
    document.querySelectorAll('.character').forEach(c => c.classList.remove('selected'));
    document.querySelector(`[onclick="selectCharacter('${name}')"]`).classList.add('selected');
}

function confirmSelection() {
    if (selectedCharacter) {
        localStorage.setItem('playerCharacter', selectedCharacter);
        window.location.href = 'game.html'; // Porta all'arena
    } else {
        alert("Seleziona un personaggio prima di continuare!");
    }
}
