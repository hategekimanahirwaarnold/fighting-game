let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
let timer = document.querySelector('.timer');
let tie = document.querySelector('.tie');
canvas.width = 1024;
canvas.height = 576;

let gravity = 0.8;

let background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './img/background.png'
});

let shop = new Sprite({
    position: {
        x: 600,
        y: 160
    },
    imgSrc: './img/shop.png',
    scale: 2.5,
    frames: 6
});

let player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 3
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc: './img/samuraiMack/Idle.png',
    frames: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imgSrc: './img/samuraiMack/Idle.png',
            frames: 8
        },
        run: {
            imgSrc: './img/samuraiMack/Run.png',
            frames: 8
        },
        jump: {
            imgSrc: './img/samuraiMack/Jump.png',
            frames: 2
        },
        fall: {
            imgSrc: './img/samuraiMack/Fall.png',
            frames: 2
        },
        attack1: {
            imgSrc: './img/samuraiMack/Attack1.png',
            frames: 6
        },
        attack2: {
            imgSrc: './img/samuraiMack/Attack2.png',
            frames: 6
        },
        takeHit: {
            imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            frames: 4
        },
        death: {
            imgSrc: './img/samuraiMack/Death.png',
            frames: 6
        }
    },
    attackbox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
});

let enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 3
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imgSrc: './img/kenji/Idle.png',
    frames: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imgSrc: './img/kenji/Idle.png',
            frames: 4
        },
        run: {
            imgSrc: './img/kenji/Run.png',
            frames: 8
        },
        jump: {
            imgSrc: './img/kenji/Jump.png',
            frames: 2
        },
        fall: {
            imgSrc: './img/kenji/Fall.png',
            frames: 2
        },
        attack1: {
            imgSrc: './img/kenji/Attack1.png',
            frames: 4
        },
        attack2: {
            imgSrc: './img/kenji/Attack2.png',
            frames: 6
        },
        takeHit: {
            imgSrc: './img/kenji/Take hit.png',
            frames: 3
        },
        death: {
            imgSrc: './img/kenji/Death.png',
            frames: 7
        }
    },
    attackbox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
}
);

let keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}
let dx = 5;
let dy = 15;
let dh = 5;

let time = 60;
let timerId;

reduceTime();
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = `rgb(0, 0, 0, 1)`
    c.fillRect(0, 0, canvas.width, canvas.height);
    // draw bacground
    background.update();
    // draw shape
    shop.update();
    c.fillStyle = 'rgb(255, 255, 255, .0)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    // draw player
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // handle player's movement


    if (keys.a.pressed && player.lastkey == 'a') {
        player.velocity.x = -dx;
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey == 'd') {
        player.velocity.x = dx;
        player.switchSprite('run')
    } else
        player.switchSprite('idle');

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    // handle enemy's movement

    if (keys.ArrowLeft.pressed && enemy.lastkey == 'ArrowLeft') {
        enemy.velocity.x = -dx;
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey == 'ArrowRight') {
        enemy.velocity.x = dx;
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }
    //when player hit enemy
    if (detectCollision({
        rect1: player,
        rect2: enemy
    })  && player.currentFrame === 4) {
        enemy.takeHit();
        gsap.to('.enemyLoss', {
            width: enemy.health + '%'
        })
    }
    // if player misses
    if (player.isAttacking && player.currentFrame === 4) {
        player.isAttacking = false;
    }

    //when enemy hit player
    if (detectCollision({
        rect1: enemy,
        rect2: player
    }) && enemy.currentFrame == 2) {
        player.takeHit();
        gsap.to('.playerLoss', {
            width: player.health + '%'
        });
    }

    // if player misses
    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false;
    }

    // end game if one defeats other before time
    if (enemy.health <= 0 || player.health <= 0) {
        gameOver({ enemy, player, timerId });
    }
}
animate();

addEventListener('keydown', ({ key }) => {
    if (player.dead) return;
    switch (key) {
        case 'd':
            keys.d.pressed = true;
            player.lastkey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastkey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            player.lastkey = 's';
            break;
        case 'w':
            player.velocity.y = -dy;
            break;
        case ' ':
            player.attack();
            break;

    }
});

addEventListener('keydown', ({key}) => {
    if (enemy.dead) return;
    switch (key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastkey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft';
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
        case 'ArrowUp':
            enemy.velocity.y = -dy;
            break;
    }
})
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowDown':
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
});