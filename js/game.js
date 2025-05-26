window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Dimensioni e posizioni delle barre
    const barWidth = 400;
    const barHeight = 24;
    const barMargin = 40;

    // Barre Giocatore 1 (sinistra)
    const bar1X = barMargin;
    const bar1Y = 30;

    // Barre Giocatore 2 (destra)
    const bar2X = canvas.width - barWidth - barMargin;
    const bar2Y = 30;

    // Funzione per disegnare una barra (grigia sotto, rossa sopra)
    function drawHealthBar(x, y, width, height) {
        // Barra grigia (sotto)
        ctx.fillStyle = '#888';
        ctx.fillRect(x, y + height, width, 2);
        // Barra rossa (sopra)
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, width, height);
    }

    // Pulizia e disegno
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHealthBar(bar1X, bar1Y, barWidth, barHeight);
    drawHealthBar(bar2X, bar2Y, barWidth, barHeight);
});