import { sprites } from './sprites.js';

//
// Funzione per impostare lo sprite e le immagini per ogni player
//
export function setPlayerSprite(player, character, flipped = false) {
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
            fall: new Image(),
            attack: new Image(),
            hit: new Image(),
            death: new Image()
        };
        player.spriteImages.idle.src = sprites[character].idle.image;
        player.spriteImages.run.src = sprites[character].run.image;
        player.spriteImages.jump.src = sprites[character].jump.image;
        player.spriteImages.fall.src = sprites[character].fall.image;
        player.spriteImages.attack.src = sprites[character].attack.image;
        player.spriteImages.hit.src = sprites[character].hit.image;
        player.spriteImages.death.src = sprites[character].death.image;
        player.isFlipped = flipped;
    } else {
        player.character = character;
        player.color = character === 'alyndra' ? 'pink' : character === 'nexarion' ? 'purple' : 'gray';
        player.isFlipped = false;
    }
}

//
// Funzione di utilità per verificare se il personaggio ha sprite animati
//
function isSpriteCharacter(character) {
    return character === 'aedwyn' || character === 'alyndra' || character === 'nexarion';
}

//
// --- PLAYER 1 ---
//
export const player1 = {
    // --- Stato fisico e movimento ---
    x: 300,
    y: 500,
    width: 180,
    height: 200,
    speed: 10,
    velocityY: 0,
    gravity: 1.2,
    jumpStrength: 22.5,
    isJumping: false,
    moveDir: 0,

    // --- Stato animazione e sprite ---
    character: null,
    spriteData: null,
    currentAnim: 'idle',
    frameIndex: 0,
    frameTimer: 0,
    frameInterval: 100,
    spriteImages: {},
    isFlipped: false,

    // --- Stato combattimento ---
    isPunching: false,
    punchCooldown: false,
    hasHit: false,
    attackInProgress: false,
    hitInProgress: false,
    dead: false,
    deathInProgress: false,
    vita: 100,
    isHit: false,

    // --- Colore fallback ---
    color: 'blue',

    //
    // Disegna il player sul canvas
    //
    draw(ctx) {
        if (isSpriteCharacter(this.character) && this.spriteData) {
            let anim = this.spriteData[this.currentAnim];
            let img = this.spriteImages[this.currentAnim] || this.spriteImages['idle'];
            let frame = anim.frames[this.frameIndex] || anim.frames[0];

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
            // Fallback: rettangolo colorato
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Fallback: disegna il pugno se non sprite
        if (!isSpriteCharacter(this.character) && this.isPunching) {
            ctx.fillStyle = 'yellow';
            if (this.isFlipped) {
                ctx.fillRect(this.x - 120, this.y + this.height / 2 - 25, 120, 50);
            } else {
                ctx.fillRect(this.x + this.width, this.y + this.height / 2 - 25, 120, 50);
            }
        }
    },

    //
    // Aggiorna stato fisico e animazione del player
    //
    update(canvas, otherPlayer, moving) {
        if (this.dead) return; // Blocca tutto se morto

        // Movimento orizzontale
        if (typeof this.moveDir === 'number') {
            this.x += this.moveDir * this.speed;
        }

        // Gravità e salto
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

        // --- Gestione animazioni ---
        if (isSpriteCharacter(this.character) && this.spriteData) {
            let newAnim = 'idle';

            if (this.deathInProgress) {
                newAnim = 'death';
            } else if (this.hitInProgress) {
                newAnim = 'hit';
            } else if (this.attackInProgress) {
                newAnim = 'attack';
            } else if (this.isJumping || this.velocityY !== 0) {
                if (this.velocityY < -1) newAnim = 'jump';
                else if (this.velocityY > 1) newAnim = 'fall';
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

                // Fine animazione attacco
                if (this.currentAnim === 'attack' && this.frameIndex >= frames) {
                    this.attackInProgress = false;
                    this.isPunching = false;
                    this.currentAnim = 'idle';
                    this.frameIndex = 0;
                }
                // Fine animazione hit
                else if (this.currentAnim === 'hit' && this.frameIndex >= frames) {
                    this.hitInProgress = false;
                    this.currentAnim = 'idle';
                    this.frameIndex = 0;
                }
                // Fine animazione death: resta sull'ultimo frame
                else if (this.currentAnim === 'death' && this.frameIndex >= frames) {
                    this.frameIndex = frames - 1;
                    this.dead = true;
                }
                // Loop per altre animazioni
                else if (this.frameIndex >= frames) {
                    this.frameIndex = 0;
                }
            }
        }

        // Reset hasHit se non si sta colpendo
        if (!this.isPunching) {
            this.hasHit = false;
        }
    },

    //
    // Avvia l'animazione di pugno/attacco
    //
    punch() {
        if (!this.punchCooldown && !this.dead) {
            this.isPunching = true;
            if (isSpriteCharacter(this.character)) {
                this.attackInProgress = true;
                this.currentAnim = 'attack';
                this.frameIndex = 0;
                this.frameTimer = 0;
            }
            this.punchCooldown = true;
            setTimeout(() => {
                if (!isSpriteCharacter(this.character)) this.isPunching = false;
            }, 200);
            setTimeout(() => { this.punchCooldown = false; }, 500);
        }
    },

    //
    // Avvia il salto
    //
    jump() {
        if (!this.isJumping && this.velocityY === 0 && !this.dead) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
        }
    }
};

//
// --- PLAYER 2 ---
// (Stessa struttura di player1, cambia solo posizione iniziale e colore)
//
export const player2 = {
    // --- Stato fisico e movimento ---
    x: 1000,
    y: 500,
    width: 180,
    height: 200,
    speed: 10,
    velocityY: 0,
    gravity: 1.2,
    jumpStrength: 22.5,
    isJumping: false,
    moveDir: 0,

    // --- Stato animazione e sprite ---
    character: null,
    spriteData: null,
    currentAnim: 'idle',
    frameIndex: 0,
    frameTimer: 0,
    frameInterval: 100,
    spriteImages: {},
    isFlipped: false,

    // --- Stato combattimento ---
    isPunching: false,
    punchCooldown: false,
    hasHit: false,
    attackInProgress: false,
    hitInProgress: false,
    dead: false,
    deathInProgress: false,
    vita: 100,
    isHit: false,

    // --- Colore fallback ---
    color: 'red',

    //
    // Disegna il player sul canvas
    //
    draw(ctx) {
        if (isSpriteCharacter(this.character) && this.spriteData) {
            let anim = this.spriteData[this.currentAnim];
            let img = this.spriteImages[this.currentAnim] || this.spriteImages['idle'];
            let frame = anim.frames[this.frameIndex] || anim.frames[0];

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
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (!isSpriteCharacter(this.character) && this.isPunching) {
            ctx.fillStyle = 'yellow';
            if (this.isFlipped) {
                ctx.fillRect(this.x - 120, this.y + this.height / 2 - 25, 120, 50);
            } else {
                ctx.fillRect(this.x + this.width, this.y + this.height / 2 - 25, 120, 50);
            }
        }
    },

    //
    // Aggiorna stato fisico e animazione del player
    //
    update(canvas, otherPlayer) {
        if (this.dead) return;

        // Movimento orizzontale
        if (typeof this.moveDir === 'number') {
            this.x += this.moveDir * this.speed;
        }

        // Gravità e salto
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

        // --- Gestione animazioni ---
        if (isSpriteCharacter(this.character) && this.spriteData) {
            let newAnim = 'idle';

            if (this.deathInProgress) {
                newAnim = 'death';
            } else if (this.hitInProgress) {
                newAnim = 'hit';
            } else if (this.attackInProgress) {
                newAnim = 'attack';
            } else if (this.isJumping || this.velocityY !== 0) {
                if (this.velocityY < -1) newAnim = 'jump';
                else if (this.velocityY > 1) newAnim = 'fall';
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

                // Fine animazione attacco
                if (this.currentAnim === 'attack' && this.frameIndex >= frames) {
                    this.attackInProgress = false;
                    this.isPunching = false;
                    this.currentAnim = 'idle';
                    this.frameIndex = 0;
                }
                // Fine animazione hit
                else if (this.currentAnim === 'hit' && this.frameIndex >= frames) {
                    this.hitInProgress = false;
                    this.currentAnim = 'idle';
                    this.frameIndex = 0;
                }
                // Fine animazione death: resta sull'ultimo frame
                else if (this.currentAnim === 'death' && this.frameIndex >= frames) {
                    this.frameIndex = frames - 1;
                    this.dead = true;
                }
                // Loop per altre animazioni
                else if (this.frameIndex >= frames) {
                    this.frameIndex = 0;
                }
            }
        }

        // Reset hasHit se non si sta colpendo
        if (!this.isPunching) {
            this.hasHit = false;
        }
    },

    //
    // Avvia l'animazione di pugno/attacco
    //
    punch() {
        if (!this.punchCooldown && !this.dead) {
            this.isPunching = true;
            if (isSpriteCharacter(this.character)) {
                this.attackInProgress = true;
                this.currentAnim = 'attack';
                this.frameIndex = 0;
                this.frameTimer = 0;
            }
            this.punchCooldown = true;
            setTimeout(() => {
                if (!isSpriteCharacter(this.character)) this.isPunching = false;
            }, 200);
            setTimeout(() => { this.punchCooldown = false; }, 500);
        }
    },

    //
    // Avvia il salto
    //
    jump() {
        if (!this.isJumping && this.velocityY === 0 && !this.dead) {
            this.velocityY = -this.jumpStrength;
            this.isJumping = true;
        }
    }
};