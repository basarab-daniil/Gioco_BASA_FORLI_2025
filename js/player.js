import { sprites } from './sprites.js';

// Funzione per impostare lo sprite e le immagini per ogni player
export function setPlayerSprite(player, character) {
    if (character === 'aedwyn' || character === 'alyndra' || character === 'nexarion') {
        player.character = character;
        player.spriteData = sprites[character];
        player.currentAnim = 'idle';
        player.frameIndex = 0;
        player.frameTimer = 0;
        player.frameInterval = 50;
        player.spriteImages = {
            idle: new Image(),
            run: new Image(),
            jump: new Image(),
            fall: new Image()
        };
        player.spriteImages.idle.src = sprites[character].idle.image;
        player.spriteImages.run.src = sprites[character].run.image;
        player.spriteImages.jump.src = sprites[character].jump.image;
        player.spriteImages.fall.src = sprites[character].fall.image;
        player.isFlipped = player === player2; // player2 va specchiato
    } else {
        // fallback: colore
        player.character = character;
        player.color = character === 'alyndra' ? 'pink' : character === 'nexarion' ? 'purple' : 'gray';
        player.isFlipped = false;
    }
}

// --- PLAYER 1 ---
export const player1 = {
    x: 300,
    y: 500,
    width: 180,
    height: 200,
    speed: 10,
    velocityY: 0,
    gravity: 1.2,
    jumpStrength: 22.5,
    isJumping: false,
    isPunching: false,
    punchCooldown: false,
    moveDir: 0, // -1 sinistra, 1 destra, 0 fermo
    character: null,
    spriteData: null,
    currentAnim: 'idle',
    frameIndex: 0,
    frameTimer: 0,
    frameInterval: 100,
    spriteImages: {},
    color: 'blue',
    isFlipped: false,
    vita: 100,

    draw(ctx) {
        // --- ANIMAZIONE SPRITE AEDWYN, ALYNDRA, NEXARION ---
        if (
            (this.character === 'aedwyn' || this.character === 'alyndra' || this.character === 'nexarion')
            && this.spriteData
        ) {
            const anim = this.spriteData[this.currentAnim];
            const img = this.spriteImages[this.currentAnim];
            const frame = anim.frames[this.frameIndex] || anim.frames[0];
            if (img && frame) {
                if (this.isFlipped) {
                    ctx.save();
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.scale(-1, 1);
                    ctx.drawImage(
                        img,
                        frame.x, frame.y, frame.w, frame.h,
                        -this.width / 2, -this.height / 2, this.width, this.height
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(
                        img,
                        frame.x, frame.y, frame.w, frame.h,
                        this.x, this.y, this.width, this.height
                    );
                }
            }
        } else {
            // --- FALLBACK rettangolo colorato ---
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // --- Pugno ---
        if (this.isPunching) {
            ctx.fillStyle = 'yellow';
            if (this.isFlipped) {
                ctx.fillRect(this.x - 60, this.y + this.height / 2 - 25, 60, 50);
            } else {
                ctx.fillRect(this.x + this.width, this.y + this.height / 2 - 25, 60, 50);
            }
        }
    },

    update(canvas, otherPlayer, moving) {
        // Movimento orizzontale
        if (typeof this.moveDir === 'number') {
            this.x += this.moveDir * this.speed;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Limiti canvas
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
        if (this.y < 0) this.y = 0;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        // Collisione con altro player
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

        // --- ANIMAZIONE SPRITE AEDWYN, ALYNDRA, NEXARION ---
        if (
            (this.character === 'aedwyn' || this.character === 'alyndra' || this.character === 'nexarion')
            && this.spriteData
        ) {
            let newAnim = 'idle';
            if (this.isJumping || this.velocityY !== 0) {
                if (this.velocityY < -1) {
                    newAnim = 'jump';
                } else if (this.velocityY > 1) {
                    newAnim = 'fall';
                } else {
                    newAnim = this.currentAnim;
                }
            } else if (this.moveDir !== 0) {
                newAnim = 'run';
            }

            if (this.currentAnim !== newAnim) {
                this.currentAnim = newAnim;
                this.frameIndex = 0;
                this.frameTimer = 0;
            }

            this.frameTimer += 16.67; // ~60fps
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                this.frameIndex++;
                const frames = this.spriteData[this.currentAnim].frames.length;
                if (this.frameIndex >= frames) this.frameIndex = 0;
            }
        }
    },

    jump() {
        if (!this.isJumping) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
        }
    },

    punch() {
        if (!this.punchCooldown) {
            this.isPunching = true;
            this.punchCooldown = true;
            setTimeout(() => { this.isPunching = false; }, 200);
            setTimeout(() => { this.punchCooldown = false; }, 500);
        }
    }
};

// --- PLAYER 2 ---
export const player2 = {
    x: 1000,
    y: 500,
    width: 180,
    height: 200,
    speed: 10,
    velocityY: 0,
    gravity: 1.2,
    jumpStrength: 22.5,
    isJumping: false,
    isPunching: false,
    punchCooldown: false,
    moveDir: 0,
    character: null,
    spriteData: null,
    currentAnim: 'idle',
    frameIndex: 0,
    frameTimer: 0,
    frameInterval: 100,
    spriteImages: {},
    color: 'red',
    isFlipped: false,
    vita: 100,

    draw(ctx) {
        // --- ANIMAZIONE SPRITE AEDWYN, ALYNDRA, NEXARION ---
        if (
            (this.character === 'aedwyn' || this.character === 'alyndra' || this.character === 'nexarion')
            && this.spriteData
        ) {
            const anim = this.spriteData[this.currentAnim];
            const img = this.spriteImages[this.currentAnim];
            const frame = anim.frames[this.frameIndex] || anim.frames[0];
            if (img && frame) {
                if (this.isFlipped) {
                    ctx.save();
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.scale(-1, 1);
                    ctx.drawImage(
                        img,
                        frame.x, frame.y, frame.w, frame.h,
                        -this.width / 2, -this.height / 2, this.width, this.height
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(
                        img,
                        frame.x, frame.y, frame.w, frame.h,
                        this.x, this.y, this.width, this.height
                    );
                }
            }
        } else {
            // --- FALLBACK rettangolo colorato ---
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // --- Pugno ---
        if (this.isPunching) {
            ctx.fillStyle = 'yellow';
            if (this.isFlipped) {
                ctx.fillRect(this.x - 60, this.y + this.height / 2 - 25, 60, 50);
            } else {
                ctx.fillRect(this.x + this.width, this.y + this.height / 2 - 25, 60, 50);
            }
        }
    },

    update(canvas, otherPlayer) {
        if (typeof this.moveDir === 'number') {
            this.x += this.moveDir * this.speed;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Limiti canvas
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
        if (this.y < 0) this.y = 0;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        // Collisione con altro player
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

        // --- ANIMAZIONE SPRITE AEDWYN, ALYNDRA, NEXARION ---
        if (
            (this.character === 'aedwyn' || this.character === 'alyndra' || this.character === 'nexarion')
            && this.spriteData
        ) {
            let newAnim = 'idle';
            if (this.isJumping || this.velocityY !== 0) {
                if (this.velocityY < -1) {
                    newAnim = 'jump';
                } else if (this.velocityY > 1) {
                    newAnim = 'fall';
                } else {
                    newAnim = this.currentAnim;
                }
            } else if (this.moveDir !== 0) {
                newAnim = 'run';
            }

            if (this.currentAnim !== newAnim) {
                this.currentAnim = newAnim;
                this.frameIndex = 0;
                this.frameTimer = 0;
            }

            this.frameTimer += 16.67; // ~60fps
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                this.frameIndex++;
                const frames = this.spriteData[this.currentAnim].frames.length;
                if (this.frameIndex >= frames) this.frameIndex = 0;
            }
        }
    },

    jump() {
        if (!this.isJumping) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
        }
    },

    punch() {
        if (!this.punchCooldown) {
            this.isPunching = true;
            this.punchCooldown = true;

            setTimeout(() => {
                this.isPunching = false;
            }, 200);

            setTimeout(() => {
                this.punchCooldown = false;
            }, 500);
        }
    }
};