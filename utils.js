
function detectCollision({rect1, rect2}) {
    return (rect1.attackbox.position.x + rect1.attackbox.width >= rect2.position.x &&
    rect1.attackbox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackbox.position.y + rect1.attackbox.height >= rect2.position.y &&
    rect1.attackbox.position.y <= rect2.position.y + rect2.height &&
    rect1.isAttacking)
}

function gameOver({player, enemy, timerId}) {
    clearTimeout(timerId);
    tie.style.display = 'flex';
    if (player.health == enemy.health) {
        tie.innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        tie.innerHTML = 'Player 1 Won!'
    } else if (player.health < enemy.health) {
        tie.innerHTML = 'Player 2 Won!'
    }
}

function reduceTime() {
    if (time > 0) {
        timerId = setTimeout(reduceTime, 1000);
        time --;
        timer.innerHTML = time;
    } else {
        gameOver({enemy, player, timerId})
    }
}
