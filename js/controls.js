import { player1, player2 } from './player.js';

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

export function setupControls() {
    window.addEventListener('keydown', (e) => {
        if (e.repeat) return; // Ignora ripetizioni per evitare spam
        keys[e.key] = true;

        // Gestione del pugno per entrambi i giocatori SOLO su pressione singola
        if (e.key === 's' && !player1.isPunching && !player1.punchCooldown) player1.punch();
        if (e.key === 'ArrowDown' && !player2.isPunching && !player2.punchCooldown) player2.punch();
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

export function handlePlayerMovement() {
    let moving1 = false;
    let moving2 = false;

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