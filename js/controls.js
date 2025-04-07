import { player1, player2 } from './player.js';

const keys = {
    a: false,
    d: false,
    w: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false
};

export function setupControls() {
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

export function handlePlayerMovement() {
    // Controlli per il giocatore 1
    if (keys.a) player1.x -= player1.speed;
    if (keys.d) player1.x += player1.speed;
    if (keys.w) player1.jump();

    // Controlli per il giocatore 2
    if (keys.ArrowLeft) player2.x -= player2.speed;
    if (keys.ArrowRight) player2.x += player2.speed;
    if (keys.ArrowUp) player2.jump();
}