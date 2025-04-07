export const player1 = {
    x: 300, // Posizione iniziale sull'asse X
    y: 500, // Posizione iniziale sull'asse Y
    width: 90, // Larghezza del rettangolo
    height: 200, // Altezza del rettangolo
    color: 'blue',
    speed: 7,
    velocityY: 0,
    gravity: 0.8,
    jumpStrength: 15,
    isJumping: false,

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    update(canvas, otherPlayer) {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Mantieni il giocatore sul pavimento
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Mantieni il giocatore all'interno del canvas sull'asse X
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

        // Gestisci la collisione con l'altro giocatore
        if (
            this.x < otherPlayer.x + otherPlayer.width &&
            this.x + this.width > otherPlayer.x &&
            this.y < otherPlayer.y + otherPlayer.height &&
            this.y + this.height > otherPlayer.y
        ) {
            // Risolvi la collisione spostando i giocatori
            if (this.x < otherPlayer.x) {
                this.x -= this.speed;
                otherPlayer.x += otherPlayer.speed;
            } else {
                this.x += this.speed;
                otherPlayer.x -= otherPlayer.speed;
            }
        }
    },

    jump() {
        if (!this.isJumping) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
        }
    }
};

export const player2 = {
    x: 1000, // Posizione iniziale sull'asse X
    y: 500, // Posizione iniziale sull'asse Y
    width: 90,
    height: 200,
    color: 'red', // Colore diverso per distinguere
    speed: 7,
    velocityY: 0,
    gravity: 0.8,
    jumpStrength: 15,
    isJumping: false,

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    update(canvas, otherPlayer) {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Mantieni il giocatore sul pavimento
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Mantieni il giocatore all'interno del canvas sull'asse X
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

        // Gestisci la collisione con l'altro giocatore
        if (
            this.x < otherPlayer.x + otherPlayer.width &&
            this.x + this.width > otherPlayer.x &&
            this.y < otherPlayer.y + otherPlayer.height &&
            this.y + this.height > otherPlayer.y
        ) {
            // Risolvi la collisione spostando i giocatori
            if (this.x < otherPlayer.x) {
                this.x -= this.speed;
                otherPlayer.x += otherPlayer.speed;
            } else {
                this.x += this.speed;
                otherPlayer.x -= otherPlayer.speed;
            }
        }
    },

    jump() {
        if (!this.isJumping) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
        }
    }
};