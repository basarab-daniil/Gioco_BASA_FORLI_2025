import { player1, player2 } from './player.js'; // <--- aggiungi questa riga

const healthBarConfig = {
    width: 450,
    height: 25,
    margin: 50, // distanza dai bordi
    yPosition: 30, // distanza dal top
    backgroundColor: '#d3d3d3', // grigio chiaro
    foregroundColor: '#ff0000'  // rosso
};

const maxHealth = 100;

// Funzione per disegnare una singola barra della vita
function drawHealthBar(ctx, x, y, currentHealth, maxHealth) {
    const { width, height, backgroundColor, foregroundColor } = healthBarConfig;
    
    // Disegna il rettangolo di sfondo (grigio)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);
    
    // Calcola la larghezza della barra rossa in base alla vita rimanente
    const healthPercentage = currentHealth / maxHealth;
    const healthWidth = width * healthPercentage;
    
    // Disegna il rettangolo della vita (rosso)
    ctx.fillStyle = foregroundColor;
    ctx.fillRect(x, y, healthWidth, height);
    
    // Aggiungi un bordo nero
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

// Funzione per disegnare entrambe le barre della vita
export function drawHealthBars(ctx, canvasWidth) {
    const { width, margin, yPosition } = healthBarConfig;
    const player1X = margin;
    const player2X = canvasWidth - width - margin;

    // Usa la vita attuale dei player!
    drawHealthBar(ctx, player1X, yPosition, player1.vita, maxHealth);
    drawHealthBar(ctx, player2X, yPosition, player2.vita, maxHealth);
}
