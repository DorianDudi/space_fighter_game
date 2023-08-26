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
	document.addEventListener("click", launchGame);
}

function drawMainTitle() {
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
}

function drawMenuGameMode_1() {
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
}

function drawMenuGameMode_2() {
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
}

function drawMenuGameMode_3() {
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
}

function drawMenuInactive() {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = 'silver';
    ctx.fillRect(150, 420, 98, 45);
    ctx.fillRect(251, 420, 98, 45);
    ctx.fillRect(352, 420, 98, 45);
}

function drawMenuDigits() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'black';
    ctx.font = "bold 50px sans-serif";
    ctx.fillText('1', 190, 460);
    ctx.fillText('2', 291, 460);
    ctx.fillText('3', 392, 460);
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

function redrawGame() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	if (!gameOver) {
		drawShip();		
	} else {
		drawEndGameMessage();
	}
	drawObstacles();
	drawProjectiles();
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