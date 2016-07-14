// ** Could not get the collision to work properly


// Label the canvas
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

// Array containers
var bugs;
var foods;
var deadBugs;
var xFoods;
var yFoods;

var border = 100;	// Line where the bugs spawn from
var spawnRate = Math.floor((Math.random() * 3) + 1) * 1000;
var lastSpawned = 0;	// When the last bug was spawned

// Time variables
var then;
var paused;

// Score variables
var highScore = 0;
var score;

// Opacity of the objects
var fade = true;
var alpha = 1.0;

var gold = "rgba(211, 145, 39, " + alpha + ")";
var silver = "rgba(119, 122, 131, " + alpha + ")";
var black = "rgba(0, 0, 0, " + alpha + ")";
var white = "rgba(255, 255, 255, " + alpha + ")";

// Game running variable
var active = false;

// Level variable
var level;
var replayLevel;

// Mouse listener
canvas.addEventListener("mousedown", clicker, false);

// Pause function button
document.getElementById("button").onclick = function () {
	pauseGame();
}

document.getElementById("button").style.opacity = 0;
document.getElementById("button").disabled = true;
document.getElementById("levelText").style.opacity = 1;
document.getElementById("level1").style.opacity = 1;
document.getElementById("level2").style.opacity = 1;
document.getElementById("one").style.opacity = 1;
document.getElementById("two").style.opacity = 1;
document.getElementById("startButton").style.opacity = 1;
document.getElementById("game").style.opacity = 0;



function prepareGame() {
	// Make sure everything the arrays have reset
	bugs = [];
	deadBugs = [];
	foods = [];
	xFoods = [];
	yFoods = [];

	document.getElementById("button").style.opacity = 1;
	document.getElementById("button").disabled = false;
	document.getElementById("levelText").style.opacity = 0;
	document.getElementById("level1").style.opacity = 0;
	document.getElementById("level1").disabled = true;
	document.getElementById("level2").style.opacity = 0;
	document.getElementById("level2").disabled = true;
	document.getElementById("one").style.opacity = 0;
	document.getElementById("two").style.opacity = 0;
	document.getElementById("startButton").style.opacity = 0;
	document.getElementById("startButton").disabled = true;
	document.getElementById("game").style.opacity = 1;

	// Create the first 5 pieces of food
	for (var i = 0; i < 5; i++) {
		createFood();
	}

	checkFoodDistance();	// See if the food pieces are near overlap

	if (replayLevel == 1 || replayLevel == 2) {
		level = replayLevel;
		replayLevel = 0;
	} else if (document.getElementById("level1").checked == true) {
		level = 1;
	} else if (document.getElementById("level1").checked == false) {
		level = 2;
	}

	score = 0;
	active = true;
	then = Date.now();

	startGame();
}

function prepareGame2() {

	// Make sure everything the arrays have reset
	bugs = [];
	deadBugs = [];
	foods = [];
	xFoods = [];
	yFoods = [];

	document.getElementById("button").style.opacity = 1;
	document.getElementById("button").disabled = false;
	document.getElementById("levelText").style.opacity = 0;
	document.getElementById("level1").style.opacity = 0;
	document.getElementById("level1").disabled = true;
	document.getElementById("level2").style.opacity = 0;
	document.getElementById("level2").disabled = true;
	document.getElementById("one").style.opacity = 0;
	document.getElementById("two").style.opacity = 0;
	document.getElementById("startButton").style.opacity = 0;
	document.getElementById("startButton").disabled = true;
	document.getElementById("game").style.opacity = 1;

	// Create the first 5 pieces of food
	for (var i = 0; i < 5; i++) {
		createFood();
	}

	checkFoodDistance();	// See if the food pieces are near overlap

	level = 2;

	score = 0;
	active = true;
	then = Date.now();

	startGame();

}

// Response to user tapping/clicking
function clicker(event) {
	var xPos = event.x;	// x of the mouse
    var yPos = event.y;	// y of the mouse

    if (active) {
	    for (var i = 0; i < bugs.length; i++) {
	    	var bugObjects = bugs[i];
				if ((xPos <= bugObjects.x + 35 && xPos >= bugObjects.x - 35) && (yPos <= bugObjects.y + 50 && yPos >= bugObjects.y - 50)) {
	    		var removeBug = bugs.indexOf(bugObjects);
					if (removeBug > -1) {
						deadBugs.push(bugObjects);
						bugs.splice(removeBug, 1);
						score += bugObjects.score;
						if (score >= highScore) {
							highScore = score;
							showScore();
						}
					}
	    	}
	    }
	}
}

function startGame() {

	if (active) {
		var time = Date.now();

	    var elapsedTime = Math.floor(60 - (Date.now() - then) / 1000);

	    // see if its time to spawn a new object
	    if (time > (lastSpawned + spawnRate)) {
	        lastSpawned = time;
	        spawnRate = Math.floor((Math.random() * 3) + 1) * 1000;		// Spawn rate of the bug, between 1-3 seconds
	        createBug(level);
	    }

	    context.clearRect(0, 0, canvas.width, canvas.height);


	    drawBug();
	    drawFood();
	    fadeBug();

	    for (var i = 0; i < bugs.length; i++) {
	    	var bugObjects = bugs[i];
	    	var nearestFood = closestFood(bugObjects);
	    	var dx = nearestFood.x - bugObjects.x;
	    	var dy = nearestFood.y - bugObjects.y;
	    	var length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	    	if (length) {
	    		dy /= length;
	    		dx /= length;
	    	}
	    	var timeNow = Date.now();
	    	bugObjects.x += dx * ((timeNow - bugObjects.lastMove) / 1000) * bugObjects.speed;
	    	bugObjects.y += dy * ((timeNow - bugObjects.lastMove) / 1000) * bugObjects.speed;
	    	bugObjects.lastMove = timeNow;

			if ((Math.abs(bugObjects.x - nearestFood.x) < 8) && (Math.abs(bugObjects.y - nearestFood.y) < 26)) {
				var index = foods.indexOf(nearestFood);
				if (index > -1) {
					foods.splice(index, 1);
				}
			}

			if (elapsedTime == -1 && level == 1) {
				active = false;
				level = 2;
				prepareGame2();

			} else if (foods.length == 0 || elapsedTime == -1) {		// If the food array has nothing left, the game is over
				if (highScore <= score) {
					highScore = score;
					showScore();
				}

				active = false;
				bugs = [];
				deadBugs = [];
				foods = [];

				var replay = window.confirm("Game over!\nYour score on level " + level + " was " + score + " and the highscore is " + highScore + ".\nPlay again?");
				if (replay == true) {
					replayLevel = level;
					prepareGame()
				} else {
					exitGame()
				}

				break;
			}
		}

	    context.beginPath();
		context.moveTo(0, border);
		context.lineTo(400, border);
		context.stroke();
	    showTime(elapsedTime);
		showScore();

	}

	// refresh the canvas screen
    requestAnimationFrame(startGame);
}

function createFood() {

	var food = {
		x: Math.floor((Math.random() * 379) + 11),
		y: (700 - Math.floor((Math.random() * 479) + 11)),
	}

	foods.push(food);	// Push the food object into the stack
	xFoods.push(food.x);	// Push the coordinate to see if they might stack
	yFoods.push(food.y);
}

function drawFood() {

	for (var i = 0; i < foods.length; i++) {
    	var foodObjects = foods[i];
    	context.beginPath();
    	context.arc(foodObjects.x, foodObjects.y, 10, Math.PI, Math.PI * 3);
    	context.closePath();
		context.fillStyle = "rgb(201, 132, 101)";
    	context.fill();

		context.beginPath();
		context.arc(foodObjects.x, foodObjects.y, 9, 0, Math.PI * 2);
		context.closePath();
		context.fillStyle = "pink";
		context.fill();

		context.beginPath();
		context.arc(foodObjects.x, foodObjects.y, 2, 0, Math.PI * 2);
		context.closePath();
		context.fillStyle = "white";
		context.fill();

		context.beginPath();
	    context.arc(foodObjects.x - 4, foodObjects.y + 2, 1, 0, Math.PI * 2);
	    context.closePath();
   		context.fillStyle = 'red';
      	context.fill();

        context.beginPath();
        context.arc(foodObjects.x + 5, foodObjects.y + 3, 1, 0, Math.PI * 2);
        context.closePath();
   		context.fillStyle = 'yellow';
        context.fill();

        context.beginPath();
        context.arc(foodObjects.x - 2, foodObjects.y - 4, 1, 0, Math.PI * 2);
        context.closePath();
   		context.fillStyle = 'blue';
        context.fill();

        context.beginPath();
        context.arc(foodObjects.x, foodObjects.y + 5, 1, 0, Math.PI * 2);
        context.closePath();
   		context.fillStyle = 'green';
        context.fill();

        context.beginPath();
        context.arc(foodObjects.x + 3, foodObjects.y - 4, 1, 0, Math.PI * 2);
        context.closePath();
   		context.fillStyle = 'purple';
        context.fill();

      	context.beginPath();
      	context.arc(foodObjects.x + 7, foodObjects.y, 1, 0, Math.PI * 2);
      	context.closePath();
   		context.fillStyle = 'orange';
      	context.fill();

     	context.beginPath();
      	context.arc(foodObjects.x - 6, foodObjects.y - 2, 1, 0, Math.PI * 2);
      	context.closePath();
   		context.fillStyle = 'white';
      	context.fill();

    }
}

function checkFoodDistance() {

	for (var i = 0; i < foods.length; i++) {
		var xCoord = xFoods[i];
		var yCoord = yFoods[i];
		for (var j = 1; j < foods.length; j++) {
			var xCoordNext = xFoods[j];
			var yCoordNext = yFoods[j];
			if (i != j) {
				if (Math.abs(xCoord - xCoordNext) <= 75 && Math.abs(yCoord - yCoordNext) <= 75) {
					foods.splice(i, 1);
					xFoods.splice(i, 1);
					yFoods.splice(i, 1);
					createFood();
					checkFoodDistance();
				}
			}
		}
	}
}

function createBug(levelSelection) {

	var random = Math.random();

	if (levelSelection == 1) {
		if (random < 0.3) {
			var bug = {
				colour: "rgba(0, 0, 0, " + alpha + ")",
				x: Math.floor((Math.random() * 395) + 1),
				y: 105,
				speed: 150,
				alpha: 1.0,
				lastMove: Date.now(),
				score: 5
			}
		} else if (0.3 < random && random < 0.6 ) {
			var bug = {
				colour: "rgba(255, 0, 0, " + alpha + ")",
				x: Math.floor((Math.random() * 395) + 1),
				y: 105,
				speed: 75,
				alpha: 1.0,
				lastMove: Date.now(),
				score: 3
			}
		} else {
			var bug = {
				colour: "rgba(255, 94, 0, " + alpha + ")",
				x: Math.floor((Math.random() * 395) + 1),
				y: 105,
				speed: 60,
				alpha: 1.0,
				lastMove: Date.now(),
				score: 1
			}
		}
	} else if (levelSelection == 2) {
		if (random < 0.3) {
			var bug = {
				colour: "rgba(0, 0, 0, " + alpha + ")",
				x: Math.floor((Math.random() * 395) + 1),
				y: 105,
				speed: 200,
				alpha: 1.0,
				lastMove: Date.now(),
				score: 5
			}
		} else if (0.3 < random && random < 0.6 ) {
			var bug = {
				colour: "rgba(255, 0, 0, " + alpha + ")",
				x: Math.floor((Math.random() * 395) + 1),
				y: 105,
				speed: 100,
				alpha: 1.0,
				lastMove: Date.now(),
				score: 3
			}
		} else {
			var bug = {
				colour: "rgba(255, 94, 0, " + alpha + ")",
				x: Math.floor((Math.random() * 395) + 1),
				y: 105,
				speed: 80,
				alpha: 1.0,
				lastMove: Date.now(),
				score: 1
			}
		}
	}

	bugs.push(bug);
}


function drawBug() {
    for (var i = 0; i < bugs.length; i++) {
    	var bugObjects = bugs[i];
		var closest = closestFood(bugObjects);

		context.save();
		context.translate(bugObjects.x, bugObjects.y);
		context.rotate(Math.atan2(bugObjects.y - closest.y, bugObjects.x - closest.x) + 90 * Math.PI/180);

		context.beginPath();
		context.arc(0, 20, 3, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 16, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 14, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 10, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 8, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 4, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 0, 5, 0, 2 * Math.PI, false);
		context.fillStyle = gold;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -2, 5, 0, 2 * Math.PI, false);
		context.fillStyle = black;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -4, 5, 0, 2 * Math.PI, false);
		context.fillStyle = gold;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -6, 5, 0, 2 * Math.PI, false);
		context.fillStyle = black;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -8, 5, 0, 2 * Math.PI, false);
		context.fillStyle = gold;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -14, 2, 0, 2 * Math.PI, false);
		context.fillStyle = silver;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -16, 1, 0, 2 * Math.PI, false);
		context.fillStyle = silver;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(2, 18, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = white;
		context.fill();

		context.beginPath();
		context.arc(-2, 18, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = white;
		context.fill();

		context.beginPath();
		context.arc(-2, 18, 1, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = black;
		context.fill();

		context.beginPath();
		context.arc(2, 18, 1, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = black;
		context.fill();

		context.beginPath();
		context.arc(3, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.beginPath();
		context.arc(-3, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.beginPath();
		context.arc(5, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.beginPath();
		context.arc(-5, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.restore();
    }
}

function fadeBug() {

	for (var i = 0; i < deadBugs.length; i++) {
		var bugObjects = deadBugs[i];
		if (bugObjects.alpha > 0.02) {
			bugObjects.alpha -= 0.02;
			drawBug2(deadBugs);
		} else {
			var removeBug = deadBugs.indexOf(bugObjects);
			if (removeBug > -1) {
				deadBugs.splice(removeBug, 1);
			}
		}
	}
	
}

function drawBug2(bugList) {
    for (var i = 0; i < bugList.length; i++) {
    	var bugObjects = bugList[i];
		var closest = closestFood(bugObjects);

		context.save();
		context.globalAlpha = bugObjects.alpha;
		context.translate(bugObjects.x, bugObjects.y);
		context.rotate(Math.atan2(bugObjects.y - closest.y, bugObjects.x - closest.x) + 90 * Math.PI/180);

		context.beginPath();
		context.arc(0, 20, 3, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 16, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 14, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 10, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 8, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 4, 4, 0, 2 * Math.PI, false);
		context.fillStyle = bugObjects.colour;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, 0, 5, 0, 2 * Math.PI, false);
		context.fillStyle = gold;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -2, 5, 0, 2 * Math.PI, false);
		context.fillStyle = black;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -4, 5, 0, 2 * Math.PI, false);
		context.fillStyle = gold;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -6, 5, 0, 2 * Math.PI, false);
		context.fillStyle = black;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -8, 5, 0, 2 * Math.PI, false);
		context.fillStyle = gold;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -14, 2, 0, 2 * Math.PI, false);
		context.fillStyle = silver;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(0, -16, 1, 0, 2 * Math.PI, false);
		context.fillStyle = silver;
		context.fill();
		context.closePath();

		context.beginPath();
		context.arc(2, 18, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = white;
		context.fill();

		context.beginPath();
		context.arc(-2, 18, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = white;
		context.fill();

		context.beginPath();
		context.arc(-2, 18, 1, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = black;
		context.fill();

		context.beginPath();
		context.arc(2, 18, 1, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = black;
		context.fill();

		context.beginPath();
		context.arc(3, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.beginPath();
		context.arc(-3, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.beginPath();
		context.arc(5, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.beginPath();
		context.arc(-5, 10, 2, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = silver;
		context.fill();

		context.fillText(bugObjects.score, 0, 0);

		context.restore();
    }
}

function closestFood(bugObjects) {

	var closest = 9999999;		// The first food piece should be the closest

	// Use the pythag theorem to find the closest piece of food to each bug
	// a^2 + b^2 = c^2
	for (var i = 0; i < foods.length; i++) {
		var foodPiece = foods[i];
		var a = foodPiece.x - bugObjects.x;
		var b = foodPiece.y - bugObjects.y;
		var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
		var distance = c;
		if (c < closest) {
			closest = distance;
			var piece = foodPiece;
		}
	}
	return piece;
}

function showScore() {
	context.fillStyle = "rgb(0, 255, 0)";
	context.font = "25px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText("Score: " + score, 10, 10);		// Show the current score

	context.fillStyle = "rgb(255, 0, 0)";
	context.font = "25px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText("Highscore: " + highScore, 10, 40);	// Show high score
}

function showTime(timeleft) {
	context.fillStyle = "rgb(0, 0, 255)";
	context.font = "25px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText("Time left: " + timeleft, 260, 10);	// Shows the time left
}

function pauseGame() {

	if (active) {
		paused = Date.now();
		active = false;
	} else {
		var unpaused = Date.now();
		for (var i = 0; i < bugs.length; i++) {
			bugs[i].lastMove = unpaused;
		}
		then += unpaused - paused;
		active = true;
	}
}

function exitGame() {
	bugs = [];
	foods = [];
	xFoods = [];
	yFoods = [];

	document.getElementById("button").style.opacity = 0;
	document.getElementById("button").disabled = true;
	document.getElementById("levelText").style.opacity = 1;
	document.getElementById("level1").style.opacity = 1;
	document.getElementById("level1").disabled = false;
	document.getElementById("level2").disabled = false;
	document.getElementById("level2").style.opacity = 1;
	document.getElementById("one").style.opacity = 1;
	document.getElementById("two").style.opacity = 1;
	document.getElementById("startButton").style.opacity = 1;
	document.getElementById("startButton").disabled = false;
	document.getElementById("game").style.opacity = 0;

}