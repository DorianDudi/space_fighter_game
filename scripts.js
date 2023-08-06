const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.globalAlpha = 0.4;
ctx.fillStyle = 'silver';
ctx.font = "bold 60px sans-serif";
ctx.fillText('- SPACE FIGHTER -', 25, 350);
ctx.globalAlpha = 1;
let yPositionInPixelsBackground = 1,  score = 0, gameOver = 0, levelThreshold = 25, obstacleGenerationInterval = 800, obstacleMotionInterval = 55;
let shipFrontX = 300, shipFrontY = 655, shipLeftX = shipFrontX - 10, shipLeftY = shipFrontY + 35, shipRightX = shipFrontX + 10, shipRightY = shipFrontY + 35;
let obstacles = [[],[]];
setInterval(moveBackgroundDown, 150);
let scoreID;
let obstaclesID;
let moveObstaclesID;
let game_obstacle = document.getElementById("game_obstacle");

function hasCollision() {
	let collisionPresent = 0;
	for (let i = 0; i < obstacles[0].length; ++i) {
		if ((((obstacles[0][i] - 10 < shipRightX && obstacles[0][i] - 10 > shipLeftX) || (obstacles[0][i] + 10 > shipLeftX && obstacles[0][i] + 10 < shipRightX)) && (obstacles[1][i] >= shipFrontY + 22 && obstacles[1][i] < shipFrontY + 38)) || (obstacles[1][i] + 9 > shipFrontY && obstacles[0][i] - 10 <= shipFrontX && obstacles[0][i] + 10 >= shipFrontX)) {
			collisionPresent = 1;
			break;
		}
	}
	return collisionPresent;
}

function checkLevelIncrease() {
	if (score == levelThreshold) {
		levelThreshold += 25;
		clearInterval(obstaclesID);
		if (obstacleGenerationInterval > 100) {
			obstacleGenerationInterval -= 50;
		}
		obstaclesID = setInterval(generateObstacles, obstacleGenerationInterval);
		if (obstacleMotionInterval > 15) {
			obstacleMotionInterval -= 5;
		} else if (obstacleMotionInterval > 7) {
			obstacleMotionInterval -= 1;
		}
		clearInterval(moveObstaclesID);
		moveObstaclesID = setInterval(moveObstacles, obstacleMotionInterval);
		console.log("level threshold: " + levelThreshold);
		console.log("generation interval(ms): " + obstacleGenerationInterval);
		console.log("motion interval(ms): " +obstacleMotionInterval);
		console.log("-------------------------------------------------------");
	}
}

function runGame() {
	scoreID = setInterval(incrementScore, 1000);
	obstaclesID = setInterval(generateObstacles, obstacleGenerationInterval);
	moveObstaclesID = setInterval(moveObstacles, obstacleMotionInterval);
	drawShip();
	document.addEventListener('keydown', moveShip);
	drawObstacles();
	document.getElementById("start_button").style.display = "none";
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //min-max inclusive
}

function moveBackgroundDown() {
	document.getElementById('game').style.backgroundPositionY = yPositionInPixelsBackground + "px";
	if (yPositionInPixelsBackground == 1024) {
		yPositionInPixelsBackground = 0;
	} else {
		++yPositionInPixelsBackground;
	}
}

function drawShip() {
	ctx.fillStyle = 'white';
	ctx.beginPath();
    ctx.moveTo(shipFrontX - 3, shipFrontY);
	ctx.lineTo(shipFrontX + 3, shipFrontY);
    ctx.lineTo(shipRightX, shipRightY);
    ctx.lineTo(shipLeftX, shipLeftY);
	ctx.closePath;
    ctx.fill();
}

function generateObstacles() {
	let newX = getRandomIntInclusive(10, 600), newY = getRandomIntInclusive(-15, -8);
	obstacles[0].push(newX);
	obstacles[1].push(newY);
	redrawGame();
}

function deleteObstacles() {
	for (let i = 0; i < obstacles[1].length; ++i) {
		if (obstacles[1][i] > 715) {
			obstacles[0].splice(i, 1);
			obstacles[1].splice(i, 1);
		}
	}
}

function moveObstacles() {
	for (let i = 0; i < obstacles[1].length; ++i) {
		obstacles[1][i] += 2;
	}
	deleteObstacles();
	redrawGame();
	if(hasCollision() && !gameOver){
		console.log("GAME OVER");
		drawEndGame();
		gameOver = 1;
		//resetGame();
	}
}

function drawObstacles() {
	for (let i = 0; i < obstacles[0].length; ++i) {
		let x = obstacles[0][i], y = obstacles[1][i];
		ctx.fillStyle = 'orange';
		ctx.beginPath();
		ctx.drawImage(game_obstacle, x - 10, y - 10, 22, 22);
		//ctx.arc(x, y, 10, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	}
}

function incrementScore() {
	++score;
	document.getElementById('score').innerHTML = score.toString().padStart(4, '0');
	checkLevelIncrease();
}

function moveShip(event) {
	if (event.key === 'ArrowLeft') {
		moveLeft();
	} else if (event.key === 'ArrowRight') {
		moveRight();
	}
}

function redrawGame() {
	ctx.clearRect(0, 0, 600, 700);
	if (!gameOver) {
		drawShip();		
	} else {
		drawEndGameMessage();
	}
	drawObstacles();
}
function moveRight() {
	if (shipFrontX <= 585) {
		shipFrontX += 5;
		shipLeftX = shipFrontX - 10;
		shipRightX = shipFrontX + 10;
	}
	redrawGame();
}

function moveLeft() {
	if (shipFrontX >= 15) {
		shipFrontX -= 5;
		shipLeftX = shipFrontX - 10;
		shipRightX = shipFrontX + 10;
	}
	redrawGame();
}

function drawEndGame() {
	document.getElementById("ship_explosion_full").style.position = "absolute";
	document.getElementById("ship_explosion_full").style.top = document.getElementById("game").offsetTop + shipFrontY - 50 + "px";
	document.getElementById("ship_explosion_full").style.left = document.getElementById("game").offsetLeft + shipFrontX - 50 + "px";
	document.getElementById("ship_explosion_full").style.display = "block";
	setTimeout(() => {
		document.getElementById("ship_explosion_full").style.display = "none";
	}, 900);
	document.getElementById("restart_button").style.display = "inline-block";
	document.getElementById("score").innerHTML = "0000";
	clearInterval(scoreID);
}

function drawEndGameMessage() {
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'silver';
	ctx.font = "bold 60px sans-serif";
	ctx.fillText('GAME OVER', 120, 250);
	ctx.globalAlpha = 0.9;
	ctx.font = "20px sans-serif";
	ctx.fillText('YOUR SCORE: ' + score, 220, 300);
	ctx.globalAlpha = 1.0;
	ctx.font = "15px sans-serif";
}

function resetGame() {
		clearInterval(scoreID);
		clearInterval(obstaclesID);
		clearInterval(moveObstaclesID);
		obstacles = [[],[]];
		gameOver = 0;
		if (high_score < score) {
			high_score = score;
		}
		score = 0;
		shipFrontX = 300;
		shipFrontY = 655;
		shipLeftX = shipFrontX - 10;
		shipLeftY = shipFrontY + 35;
		shipRightX = shipFrontX + 10;
		shipRightY = shipFrontY + 35;
		levelThreshold = 50;
		obstacleGenerationInterval = 800;
		obstacleMotionInterval = 55;
		document.getElementById("restart_button").style.display = "none";
		runGame();
}



