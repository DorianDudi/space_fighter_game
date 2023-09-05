const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = 600, canvasHeight = 700;
let yPositionInPixelsBackground = 1,  score = 0, gameOver = 0, gameMode = 0, levelThreshold = 25, obstacleGenerationInterval = 800, obstacleMotionInterval = 55;
let shipLengthInPixels = 35, shipWidthInPixels = 20;
let shipFrontX = 300, shipFrontY = 655, shipLeftX = shipFrontX - shipWidthInPixels / 2, shipLeftY = shipFrontY + shipLengthInPixels, shipRightX = shipFrontX + shipWidthInPixels / 2, shipRightY = shipFrontY + shipLengthInPixels;
let obstacles = [[],[]];
let projectiles = [[],[]];
let obstacleRadius = 10;
let maxProjectiles = 10;
let scoreID;
let obstaclesID;
let moveObstaclesID;
let moveProjectilesID;
let obstacleExplosionID = 1;
let game_obstacle = document.getElementById("game_obstacle");
let windowCanvasOffsetLeft = document.getElementById("game").offsetLeft;
let windowCanvasOffsetTop = document.getElementById("game").offsetTop;
let innerCanvasOffsetLeft = [150,251,352];
let menuLocationX = [];
incrementArray(menuLocationX, innerCanvasOffsetLeft, windowCanvasOffsetLeft);
let innerCanvasOffsetTop = 420;
let menuLocationY = windowCanvasOffsetTop + innerCanvasOffsetTop;
let menuBoxLength = 97, menuBoxWidth = 45;
setInterval(moveBackgroundDown, 150);
drawHomeScreen();

function incrementArray(outputArray, inputArray, incrementValue) {
	for (let i = 0; i < inputArray.length; ++i) {
		outputArray[i] = incrementValue + inputArray[i];
	}
}

function highlightMainMenu(mouse_event) {
	ctx.clearRect(150, 420, 300, 300); // clears only the game mode menu area
	let gameMode;
	if (mouse_event.clientX >= menuLocationX[0] && mouse_event.clientY >= menuLocationY && mouse_event.clientX <= menuLocationX[0] + menuBoxLength && mouse_event.clientY <= menuLocationY + menuBoxWidth) {
		gameMode = 1;
	} else if (mouse_event.clientX >= menuLocationX[1] && mouse_event.clientY >= menuLocationY && mouse_event.clientX <= menuLocationX[1] + menuBoxLength && mouse_event.clientY <= menuLocationY + menuBoxWidth) {
		gameMode = 2;
	} else if (mouse_event.clientX >= menuLocationX[2] && mouse_event.clientY >= menuLocationY && mouse_event.clientX <= menuLocationX[2] + menuBoxLength && mouse_event.clientY <= menuLocationY + menuBoxWidth) {
		gameMode = 3;
	} else {
		gameMode = 0;
	}
	drawMenu(gameMode);
	drawMenuDigits();
}

function launchGame(click_event) {
	if ((click_event.clientX >= menuLocationX[0] && click_event.clientX <= (menuLocationX[0] + menuBoxLength)) && (click_event.clientY >= menuLocationY && click_event.clientY <= (menuLocationY + menuBoxWidth))) {
		gameMode = 1;
	} else if ((click_event.clientX >= menuLocationX[1] && click_event.clientX <= (menuLocationX[1] + menuBoxLength)) && (click_event.clientY >= menuLocationY && click_event.clientY <= (menuLocationY + menuBoxWidth))) {
		gameMode = 2;
	} else if ((click_event.clientX >= menuLocationX[2] && click_event.clientX <= (menuLocationX[2] + menuBoxLength)) && (click_event.clientY >= menuLocationY && click_event.clientY <= (menuLocationY + menuBoxWidth))) {
		gameMode = 3;
		document.addEventListener("keydown", fireProjectile);
		moveProjectilesID = setInterval(moveProjectiles, obstacleRadius);
	}
	if (gameMode != 0) {
		document.removeEventListener("mousemove", highlightMainMenu);
		document.removeEventListener("click", launchGame);
		runGame();
	}
}

function fireProjectile(fire_event) {
	if (fire_event.key === ' ') {
		if (projectiles[0].length < maxProjectiles) {
			projectiles[0].push(shipFrontX);
			projectiles[1].push(shipFrontY);
		}
	}
}

function moveProjectiles() {
	for (let i = 0; i < projectiles[1].length; ++i) {
		projectiles[1][i] -= 2;
	}
	deleteProjectiles();
	if(obstacleDestroyed()){
		incrementScore();
	}
	redrawGame();
}

function deleteProjectiles() {
	for (let i = 0; i < projectiles[1].length; ++i) {
		if (projectiles[1][i] < 0) {
			projectiles[0].splice(i, 1);
			projectiles[1].splice(i, 1);
		}
	}
}

function obstacleDestroyed() {
	let targetHit = 0;
	for (let i = 0; i < obstacles[0].length; ++i) {
		for (let j = 0; j < projectiles[0].length; ++j) {
			let x1 = obstacles[0][i];
			let y1 = obstacles[1][i];
			// linear distance between obstacle center and projectile center should be less than the obstacle's radius for a hit to happen:
			if (Math.round(Math.sqrt(Math.pow(Math.abs(obstacles[0][i] - projectiles[0][j]), 2) + Math.pow(Math.abs(obstacles[1][i] - projectiles[1][j]), 2))) <= obstacleRadius) {
				targetHit = 1;
				let currentExplosionID = obstacleExplosionID.toString();
				++obstacleExplosionID;
				let imageToAdd = document.createElement("img");
				displayObstacleExplosion(imageToAdd, currentExplosionID, x1, y1);
				obstacles[0].splice(i, 1);
				obstacles[1].splice(i, 1);
				projectiles[0].splice(j, 1);
				projectiles[1].splice(j, 1);
				break;
			}
		}
	}
	return targetHit;
}

function displayObstacleExplosion (imageParam, explosionID, coordinateX, coordinateY) {
	let imageOffsetFromCenter = 30;
	document.getElementById("main_container").prepend(imageParam);
	document.getElementById("main_container").firstElementChild.setAttribute("id", explosionID);
	document.getElementById("main_container").firstElementChild.setAttribute("src", "obstacle_explosion.gif" + '?id=' + Math.floor(Math.random() * 100));
	document.getElementById("main_container").firstElementChild.setAttribute("width", 70);
	document.getElementById("main_container").firstElementChild.setAttribute("height", 70);
	document.getElementById("main_container").firstElementChild.setAttribute("style", "display:block;");
	document.getElementById(explosionID).style.position = "absolute";
	document.getElementById(explosionID).style.top = document.getElementById("game").offsetTop + coordinateY - imageOffsetFromCenter + "px";
	document.getElementById(explosionID).style.left = document.getElementById("game").offsetLeft + coordinateX - imageOffsetFromCenter + "px";
	setTimeout(() => {
		document.getElementById(explosionID).remove();
	}, 700);
}


function shipCollision() {
	let collisionPresent = 0, bottomHalfLimit = 22;
	for (let i = 0; i < obstacles[0].length; ++i) {
		if ((((obstacles[0][i] - obstacleRadius < shipRightX && obstacles[0][i] - obstacleRadius > shipLeftX) || (obstacles[0][i] + obstacleRadius > shipLeftX && obstacles[0][i] + obstacleRadius < shipRightX)) && (obstacles[1][i] >= shipFrontY + bottomHalfLimit && obstacles[1][i] < shipFrontY + shipLengthInPixels)) || (obstacles[1][i] + (obstacleRadius - 1) > shipFrontY && obstacles[0][i] - obstacleRadius <= shipFrontX && obstacles[0][i] + obstacleRadius >= shipFrontX)) {
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
	}
}

function runGame() {
	if (gameMode == 1) {
		scoreID = setInterval(incrementScore, 1000);
	}
	obstaclesID = setInterval(generateObstacles, obstacleGenerationInterval);
	moveObstaclesID = setInterval(moveObstacles, obstacleMotionInterval);
	drawShip();
	document.addEventListener('keydown', moveShip);
	drawObstacles();
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

function generateObstacles() {
	let newX = getRandomIntInclusive(10, canvasWidth), newY = getRandomIntInclusive(-15, -8);
	obstacles[0].push(newX);
	obstacles[1].push(newY);
	redrawGame();
}

function deleteObstacles() { // obstacles outside canvas bottom margin get deleted
	let obstacleLowerLimit = 715;
	for (let i = 0; i < obstacles[1].length; ++i) {
		if (obstacles[1][i] > obstacleLowerLimit) {
			obstacles[0].splice(i, 1);
			obstacles[1].splice(i, 1);
			if (gameMode == 2 && !gameOver) {
				incrementScore();
			}
		}
	}
}

function moveObstacles() {
	for (let i = 0; i < obstacles[1].length; ++i) {
		obstacles[1][i] += 2;
	}
	deleteObstacles();
	redrawGame();
	if(shipCollision() && !gameOver){
		displayEndGameScreen();
		gameOver = 1;
		//resetGame();
	}
}

function incrementScore() {
	++score;
	document.getElementById('score').innerHTML = score.toString().padStart(4, '0');
	checkLevelIncrease();
}

function moveShip(event) {
	if (event.key === 'ArrowLeft') {
		lateralMove(0, 5);
	} else if (event.key === 'ArrowRight') {
		lateralMove(1, 5);
	}
}

let rightCanvasLimit = 585, leftCanvasLimit = 15;
function lateralMove(direction, moveIncrement) {
	if (direction == 1) { //move right
		if (shipFrontX <= rightCanvasLimit) {
			shipFrontX += moveIncrement;
		}
	} else { // move left
		if (shipFrontX >= leftCanvasLimit) {
			shipFrontX -= moveIncrement;
		}
	}
	shipLeftX = shipFrontX - shipWidthInPixels / 2;
	shipRightX = shipFrontX + shipWidthInPixels / 2;
	redrawGame();
}

function displayEndGameScreen() {
	document.getElementById("ship_explosion_full").style.position = "absolute";
	document.getElementById("ship_explosion_full").style.top = document.getElementById("game").offsetTop + shipFrontY - 50 + "px";
	document.getElementById("ship_explosion_full").style.left = document.getElementById("game").offsetLeft + shipFrontX - 50 + "px";
	document.getElementById("ship_explosion_full").style.display = "block";
	setTimeout(() => {
		document.getElementById("ship_explosion_full").style.display = "none";
	}, 900);
	document.getElementById("restart_button").style.display = "inline-block";
	document.getElementById("score").innerHTML = "0000";
	if (gameMode == 1) {
		clearInterval(scoreID);
	}
}

function resetGame() {
	obstacles = [[],[]];
	projectiles = [[],[]];
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	clearInterval(scoreID);
	clearInterval(obstaclesID);
	clearInterval(moveObstaclesID);
	clearInterval(moveProjectilesID);
	gameOver = 0;
	score = 0;
	document.getElementById('score').innerHTML = score.toString().padStart(4, '0');
	shipFrontX = 300;
	shipFrontY = 655;
	shipLeftX = shipFrontX - shipWidthInPixels / 2;
	shipLeftY = shipFrontY + shipLengthInPixels;
	shipRightX = shipFrontX + shipWidthInPixels / 2;
	shipRightY = shipFrontY + shipLengthInPixels;
	levelThreshold = 50;
	obstacleGenerationInterval = 800;
	obstacleMotionInterval = 55;
	document.getElementById("restart_button").style.display = "none";
	if (gameMode == 3) {
		document.removeEventListener("keydown", fireProjectile);
	}
	gameMode = 0;
	drawHomeScreen();
}
