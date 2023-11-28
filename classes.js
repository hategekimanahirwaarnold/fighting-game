class Sprite {
    constructor( { 
        position, 
        imgSrc, 
        scale = 1, 
        frames = 1, 
        offset = {x: 0, y: 0}
    }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.frames = frames;
        this.currentFrame = 0;
        this.elapsed = 0;
        this.hold = 5;
        this.offset = offset;
    }

    draw() {

        c.drawImage(
            this.image, 
            (this.image.width / this.frames ) * this.currentFrame,
            0,
            this.image.width / this.frames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.frames) * this.scale , 
            this.image.height * this.scale,
        )
   }
   animateFrames() {
        this.elapsed++;
        if (this.elapsed % this.hold == 0) {
            if (this.currentFrame < this.frames - 1) {
                this.currentFrame += 1;
            } else {
                this.currentFrame = 0;
            }
        }
   }
    update() {
        this.draw();
        this.animateFrames();
    }

}

class Fighter extends Sprite {
    constructor( 
        {
            position, 
            velocity, 
            color = 'red',
            imgSrc,
            scale = 1, 
            frames = 1,
            offset = { x: 0, y: 0 },
            sprites,
            attackbox = {
                offset: {},
                width: undefined,
                height: undefined
            }
        }
    ) {
        super({
            position,
            imgSrc,
            scale,
            frames,
            offset
        })
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastkey = '';
        this.color = color;
        this.isAttacking = false;
        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackbox.offset,
            width: attackbox.width,
            height: attackbox.height
        };
        this.health = 100;
        this.currentFrame = 0;
        this.elapsed = 0;
        this.dead = false;
        this.hold = 5;
        this.sprites = sprites;
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        };
    }

    update() {
        this.draw();
        
        if (!this.dead)
            this.animateFrames();
        // handle attackboxes
        // draw attack box
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
        this.attackbox.position.y = this.position.y + this.attackbox.offset.y;
        // c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
            this.velocity.y = 0;
            this.position.y = 331;
        } else {
            this.velocity.y += gravity;
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.attack1.image &&
            this.currentFrame < this.sprites.attack1.frames - 1) return;

            //hit reactions
        if (this.image === this.sprites.takeHit.image &&
            this.currentFrame < this.sprites.takeHit.frames - 1) return;
        
        if (this.image === this.sprites.death.image) {
            if (this.currentFrame == this.sprites.death.frames - 1)
                this.dead = true;
            console.log("has died: ", this.dead)
            return;
        }
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.idle.frames;
                    this.image = this.sprites.idle.image
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.run.frames;
                    this.image = this.sprites.run.image
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.jump.frames;
                    this.image = this.sprites.jump.image;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.fall.frames;
                    this.image = this.sprites.fall.image;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.attack1.frames;
                    this.image = this.sprites.attack1.image;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.takeHit.frames;
                    this.image = this.sprites.takeHit.image;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.currentFrame = 0
                    this.frames = this.sprites.death.frames;
                    this.image = this.sprites.death.image;
                }
                break;
                
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 10;

        if (this.health <= 0) {
            this.switchSprite('death');
            console.log('died')
        } else  this.switchSprite('takeHit');
    }
}