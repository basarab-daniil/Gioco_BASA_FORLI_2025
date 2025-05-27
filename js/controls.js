import { player1, player2 } from './player.js';

//
// Stato dei tasti premuti
//
const keys = {
    a: false,
    d: false,
    w: false,
    s: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

//
// Setup degli event listener per i controlli dei player
//
export function setupControls() {
    window.addEventListener('keydown', (e) => {
        if (player1.dead || player2.dead) return;
        if (e.repeat) return; // Ignora ripetizioni per evitare spam
        keys[e.key] = true;

        // Gestione del pugno per entrambi i giocatori SOLO su pressione singola
        if (e.key === 's' && !player1.isPunching && !player1.punchCooldown) player1.punch();
        if (e.key === 'ArrowDown' && !player2.isPunching && !player2.punchCooldown) player2.punch();
    });

    window.addEventListener('keyup', (e) => {
        if (player1.dead || player2.dead) return;
        keys[e.key] = false;
    });
}

//
// Gestione del movimento dei player in base ai tasti premuti
//
export function handlePlayerMovement() {
    let moving1 = false;
    let moving2 = false;

    if (player1.dead || player2.dead) return { moving1, moving2 };

    // Player 1
    if (keys.a && !keys.d) { player1.moveDir = -1; moving1 = true; }
    else if (keys.d && !keys.a) { player1.moveDir = 1; moving1 = true; }
    else { player1.moveDir = 0; }

    if (keys.w) player1.jump();

    // Player 2
    if (keys.ArrowLeft && !keys.ArrowRight) { player2.moveDir = -1; moving2 = true; }
    else if (keys.ArrowRight && !keys.ArrowLeft) { player2.moveDir = 1; moving2 = true; }
    else { player2.moveDir = 0; }

    if (keys.ArrowUp) player2.jump();

    return { moving1, moving2 };
}