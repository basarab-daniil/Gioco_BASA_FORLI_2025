const characterColors = {
    ryu: 'blue',
    ken: 'red',
    chunli: 'green'
};

export function setPlayerSprite(player, character) {
    // Puoi sostituire questa logica per gestire sprite diversi
    player.color = characterColors[character] || 'gray';
}

export const player1 = {
    x: 300,
    y: 500,
    width: 90,
    height: 200,
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
            otherPlayer &&
            this.x < otherPlayer.x + otherPlayer.width &&
            this.x + this.width > otherPlayer.x &&
            this.y < otherPlayer.y + otherPlayer.height &&
            this.y + this.height > otherPlayer.y
        ) {
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
    x: 1000,
    y: 500,
    width: 90,
    height: 200,
    color: 'red',
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

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }

        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

        if (
            otherPlayer &&
            this.x < otherPlayer.x + otherPlayer.width &&
            this.x + this.width > otherPlayer.x &&
            this.y < otherPlayer.y + otherPlayer.height &&
            this.y + this.height > otherPlayer.y
        ) {
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