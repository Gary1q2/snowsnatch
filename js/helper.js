// Preview next level
function nextLevel() {
	if (game.level < levels.length-1) {
		game.level++;
		document.getElementById("levelName").innerHTML = levelNames[game.level];
		playSound(snowbreak_snd);

		// Hide button if reach end
		if (game.level == levels.length-1) {
			document.getElementById("levelRight").style.visibility = "hidden";
		}

		document.getElementById("levelLeft").style.visibility = "visible";
	}
	console.log(game.level);
}

// Preview previous level
function prevLevel() {
	if (game.level > 0) {
		game.level--;
		document.getElementById("levelName").innerHTML = levelNames[game.level];
		playSound(snowbreak_snd);

		// Hide button if reach end
		if (game.level == 0) {
			document.getElementById("levelLeft").style.visibility = "hidden";
		}

		document.getElementById("levelRight").style.visibility = "visible";
	}
	console.log(game.level);
}

function changeImage(curr, img) {
	curr.src = img.src;
}

function stretchImage(img) {
	img.style.width = img.width-10; 
	console.log(img.style.left);
}

function unstretchImage(img) {
	img.style.width = img.width+10;
}

// Clones audio node and plays the sound
function playSound(audioNode) {
	var clone = audioNode.cloneNode(true);
	clone.play();
}


// Checks if two rectangles have a collision (true or false)
function testCollisionRectRect(rect1, rect2) {
	if (rect1.width < 0) {
		rect1.width = -rect1.width;
		rect1.x -= rect1.width;
	}
	if (rect1.height < 0) {
		rect1.height = -rect1.height;
		rect1.y -= rect1.height;
	}
	return rect1.x < rect2.x + rect2.width 
		&& rect2.x < rect1.x + rect1.width
		&& rect1.y < rect2.y + rect2.height
		&& rect2.y < rect1.y + rect1.height;
}

// Draw grids
function drawGrids() {
	ctx.globalAlpha = 0.4;

	// Draw horizontal lines
	for (var i = 0; i < canvas.height/gridLen; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i*gridLen+0.5);
		ctx.lineTo(canvas.width, i*gridLen+0.5);

		ctx.moveTo(0, i*gridLen+gridLen-0.5);
		ctx.lineTo(canvas.width, i*gridLen+gridLen-0.5);

		ctx.stroke();
	}

	// Draw vertical lines
	for (var i = 0; i < canvas.width/gridLen; i++) {
		ctx.beginPath();
		ctx.moveTo(i*gridLen+0.5, 0);
		ctx.lineTo(i*gridLen+0.5, canvas.height);

		ctx.moveTo(i*gridLen+gridLen-0.5, 0);
		ctx.lineTo(i*gridLen+gridLen-0.5, canvas.height);

		ctx.stroke();
	}

	ctx.globalAlpha = 1;
}

// Return the player object given their ID
// Otherwise return FALSE
function getPlayer(playerID) {
	for (var i of playerArr) {
		if (playerID == i.playerID) {
			return i;
		}
	}
	return false;
}

// Return the goal associated with player
// Otherwise return FALSE
//function getGoal(playerID) {
//	for (var i of tempArr.array[tempArr.determineLayer(Goal)]) {
//		if (i instanceof Goal && playerID != i.owner.playerID) {
//			return i;
//		}
//	}
//	return false;
//}