const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
drawHomeScreen();
let yPositionInPixelsBackground = 1,  score = 0, high_score = 0, gameOver = 0, gameMode = 0, levelThreshold = 25, obstacleGenerationInterval = 800, obstacleMotionInterval = 55;
let shipFrontX = 300, shipFrontY = 655, shipLeftX = shipFrontX - 10, shipLeftY = shipFrontY + 35, shipRightX = shipFrontX + 10, shipRightY = shipFrontY + 35;
let obstacles = [[],[]];
let projectiles = [[],[]];
setInterval(moveBackgroundDown, 150);
let scoreID;
let obstaclesID;
let moveObstaclesID;
let moveProjectilesID;
let obstacleExplosionID = 1;
let game_obstacle = document.getElementById("game_obstacle");
let menuLocationX_1 = document.getElementById("game").offsetLeft + 150;
let menuLocationX_2 = document.getElementById("game").offsetLeft + 251;
let menuLocationX_3 = document.getElementById("game").offsetLeft + 352;
let menuLocationY = document.getElementById("game").offsetTop + 420;

function drawHomeScreen() {
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'silver';
	ctx.font = "bold 60px sans-serif";
	ctx.fillText('- SPACE FIGHTER -', 25, 350);
	ctx.globalAlpha = 1;
	ctx.fillRect(150, 400, 300, 15);
	ctx.fillStyle = 'black';
	ctx.font = "15px sans-serif";
	ctx.fillText('CHOOSE GAME MODE', 220, 413);
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = 'silver';
	ctx.fillRect(150, 420, 98, 45);
	ctx.fillRect(251, 420, 98, 45);
	ctx.fillRect(352, 420, 98, 45);
	ctx.globalAlpha = 1;
	ctx.fillStyle = 'black';
	ctx.font = "bold 50px sans-serif";
	ctx.fillText('1', 190, 460);
	ctx.fillText('2', 291, 460);
	ctx.fillText('3', 392, 460);
	document.addEventListener("mousemove", highlightMainMenu);
	
	function highlightMainMenu(mouse_event) {
		ctx.clearRect(150, 420, 300, 300);
		if (mouse_event.clientX >= menuLocationX_1 && mouse_event.clientY >= menuLocationY && mouse_event.clientX <= menuLocationX_1 + 97 && mouse_event.clientY <= menuLocationY + 45) {
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'silver';
			ctx.fillRect(150, 420, 98, 45);
			ctx.font = "bold 15px sans-serif";
			ctx.fillText('"ENDURE"', 160, 500);
			ctx.font = "14px sans-serif";
			ctx.fillText("Your score is the game's elapsed time", 180, 530);
			ctx.globalAlpha = 0.4;
			ctx.fillRect(251, 420, 98, 45);
			ctx.fillRect(352, 420, 98, 45);
		} else if (mouse_event.clientX >= menuLocationX_2 && mouse_event.clientY >= menuLocationY && mouse_event.clientX <= menuLocationX_2 + 97 && mouse_event.clientY <= menuLocationY + 45) {
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'silver';
			ctx.fillRect(251, 420, 98, 45);
			ctx.font = "bold 15px sans-serif";
			ctx.fillText('"DODGE"', 265, 500);
			ctx.font = "14px sans-serif";
			ctx.fillText("Your score is the number of dodged obstacles", 160, 530);
			ctx.globalAlpha = 0.4;
			ctx.fillRect(150, 420, 98, 45);
			ctx.fillRect(352, 420, 98, 45);
			menuSelection = 2;
		} else if (mouse_event.clientX >= menuLocationX_3 && mouse_event.clientY >= menuLocationY && mouse_event.clientX <= menuLocationX_3 + 97 && mouse_event.clientY <= menuLocationY + 45) {
			ctx.globalAlpha = 1;
			ctx.fillStyle = 'silver';
			ctx.fillRect(352, 420, 98, 45);
			ctx.font = "bold 15px sans-serif";
			ctx.fillText('"DESTROY"', 360, 500);
			ctx.font = "14px sans-serif";
			ctx.fillText("Your score is the number of destroyed obstacles", 150, 530);
			ctx.globalAlpha = 0.4;
			ctx.fillRect(150, 420, 98, 45);
			ctx.fillRect(251, 420, 98, 45);
			menuSelection = 3;
		} else {
			ctx.globalAlpha = 0.4;
			ctx.fillStyle = 'silver';
			ctx.fillRect(150, 420, 98, 45);
			ctx.fillRect(251, 420, 98, 45);
			ctx.fillRect(352, 420, 98, 45);
		}
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'black';
		ctx.font = "bold 50px sans-serif";
		ctx.fillText('1', 190, 460);
		ctx.fillText('2', 291, 460);
		ctx.fillText('3', 392, 460);
	}
	document.addEventListener("click", launchGame);
			
	function launchGame(click_event) {
		//console.log("click detected");
		//console.log(click_event.clientX);
		//console.log(click_event.clientY);
		if ((click_event.clientX >= menuLocationX_1 && click_event.clientX <= (menuLocationX_1 + 97)) && (click_event.clientY >= menuLocationY && click_event.clientY <= (menuLocationY + 45))) {
			gameMode = 1;
		} else if ((click_event.clientX >= menuLocationX_2 && click_event.clientX <= (menuLocationX_2 + 97)) && (click_event.clientY >= menuLocationY && click_event.clientY <= (menuLocationY + 45))) {
			gameMode = 2;
		} else if ((click_event.clientX >= menuLocationX_3 && click_event.clientX <= (menuLocationX_3 + 97)) && (click_event.clientY >= menuLocationY && click_event.clientY <= (menuLocationY + 45))) {
			gameMode = 3;
			document.addEventListener("keydown", fireProjectile);
			moveProjectilesID = setInterval(moveProjectiles, 10);
		}
		if (gameMode != 0) {
			document.removeEventListener("mousemove", highlightMainMenu);
			document.removeEventListener("click", launchGame);
			runGame();
		}
	}
}

function fireProjectile(fire_event) {
	if (fire_event.key === ' ') {
		if (projectiles[0].length < 10) {
			projectiles[0].push(shipFrontX);
			projectiles[1].push(shipFrontY);
		}
	}
}

function targetIsHit() {
	let targetHit = 0;
	for (let i = 0; i < obstacles[0].length; ++i) {
		for (let j = 0; j < projectiles[0].length; ++j) {
			let x1 = obstacles[0][i];
			let y1 = obstacles[1][i];
			if (Math.round(Math.sqrt(Math.pow(Math.abs(obstacles[0][i] - projectiles[0][j]), 2) + Math.pow(Math.abs(obstacles[1][i] - projectiles[1][j]), 2))) <= 10) {
				targetHit = 1;
				let currentExplosionID = obstacleExplosionID.toString();
				++obstacleExplosionID;
				let imageToAdd = document.createElement("img");
				document.getElementById("main_container").prepend(imageToAdd);
				document.getElementById("main_container").firstElementChild.setAttribute("id", currentExplosionID);
				document.getElementById("main_container").firstElementChild.setAttribute("src", "obstacle_explosion.gif" + '?id=' + Math.floor(Math.random() * 100));
				document.getElementById("main_container").firstElementChild.setAttribute("width", 70);
				document.getElementById("main_container").firstElementChild.setAttribute("height", 70);
				document.getElementById("main_container").firstElementChild.setAttribute("style", "display:block;");
				//document.getElementById("main_container").prepend(document.createElement('<img id="' + currentExplosionID + '" src="obstacle_explosion.gif" width="50" height="50" style="display:block;"/>'));
				document.getElementById(currentExplosionID).style.position = "absolute";
				document.getElementById(currentExplosionID).style.top = document.getElementById("game").offsetTop + y1 - 30 + "px";
				document.getElementById(currentExplosionID).style.left = document.getElementById("game").offsetLeft + x1 - 30 + "px";
				setTimeout(() => {
					document.getElementById(currentExplosionID).remove();
				}, 700);
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

function moveProjectiles() {
	for (let i = 0; i < projectiles[1].length; ++i) {
		projectiles[1][i] -= 2;
	}
	deleteProjectiles();
	if(targetIsHit()){
		incrementScore();
	}
	redrawGame();
}

function drawProjectiles() {
	for (let i = 0; i < projectiles[0].length; ++i) {
		let x = projectiles[0][i], y = projectiles[1][i];
		ctx.fillStyle = 'orange';
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	}
}

function deleteProjectiles() {
	for (let i = 0; i < projectiles[1].length; ++i) {
		if (projectiles[1][i] < 10) {
			projectiles[0].splice(i, 1);
			projectiles[1].splice(i, 1);
		}
	}
}

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
		//console.log("level threshold: " + levelThreshold);
		//console.log("generation interval(ms): " + obstacleGenerationInterval);
		//console.log("motion interval(ms): " +obstacleMotionInterval);
		//console.log("-------------------------------------------------------");
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
	//document.getElementById("start_button").style.display = "none";
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
	if(hasCollision() && !gameOver){
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
	drawProjectiles();
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
	if (gameMode == 1) {
		clearInterval(scoreID);
	}
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
		obstacles = [[],[]];
		projectiles = [[],[]];
		ctx.clearRect(0, 0, 600, 700);
		clearInterval(scoreID);
		clearInterval(obstaclesID);
		clearInterval(moveObstaclesID);
		clearInterval(moveProjectilesID);
		gameOver = 0;
		score = 0;
		document.getElementById('score').innerHTML = score.toString().padStart(4, '0');
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
		if (gameMode == 3) {
			document.removeEventListener("keydown", fireProjectile);
		}
		gameMode = 0;
		drawHomeScreen();
}
