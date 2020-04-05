// Load all images and sound files
function loadFiles(src_img, src_snd, callback) {

	var loadedImages = 0;
	var loadedSounds = 0;
	var numImages = Object.keys(src_img).length;
	var numSounds = Object.keys(src_snd).length;
	console.log("num of images = " + numImages);
	console.log("num of sounds = " + numSounds);

	// Load the images
	for (var src in src_img) {
		console.log(src);
		img[src] = new Image();
		img[src].onload = function() {
			loadedImages++;
			if (loadedImages >= numImages && loadedSounds >= numSounds) {
				callback();
			}
			console.log("images = " + loadedImages+"    sounds = " + loadedSounds);
		};
		img[src].src = src_img[src];
	}	
	
	console.log("sound time\n\n\n\n\n");

	// Load the sounds
	for (var src in src_snd) {
		console.log(src);
		snd[src] = document.createElement("audio");
		snd[src].oncanplaythrough = function() {
			loadedSounds++;
			if (loadedSounds >= numSounds && loadedImages >= numImages) {
				callback();
			}
			console.log("images = " + loadedImages+"    sounds = " + loadedSounds);
		};
		snd[src].src = src_snd[src];
	}

}

// Start everything after all files have been loaded
function afterLoaded() {
	game = new Game();
	filesLoaded = true;

	bgm = snd['music'].cloneNode(true);
	bgm.volume = 0.3;

	console.log("Finished loading files!!");

	// Load the skin dictionary
	skinDict['alive'] = [img['cpu'], img['peng'], img['peng2'], img['peng3'], img['peng4']];
	skinDict['die'] = [img['cpuDie'], img['pengDie'], img['peng2Die'], img['peng3Die'], img['peng4Die']];

	// Make menu buttons visible
	document.getElementById("playButton").style.visibility = "visible";
	document.getElementById("controlButton").style.visibility = "visible";

	// Get rid of loading text
	document.getElementById("loadingText").style.visibility = "hidden";

	requestAnimationFrame(gameLoop);
}


// Preview next level
function nextLevel() {
	if (game.level < levels.length-1) {
		game.level++;
		document.getElementById("levelName").innerHTML = levelNames[game.level];
		playSound(snd['snowbreak']);

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
		playSound(snd['snowbreak']);

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
	soundArray.push(audioNode.cloneNode(true));

	var clone = soundArray[soundArray.length-1];
	clone.volume = volume;
	clone.play();
}

// Turn sounds on or off
function toggleSound(curr) {
	if (volume == 1) {
		volume = 0;
		curr.src = img['soundButtonOffFlash'].src;

		// Stop all current playing sounds
		for (var i = 0; i < soundArray.length; i++) {
			soundArray[i].pause();
		}

	} else {
		volume = 1;
		curr.src = img['soundButtonFlash'].src;
	}

	playSound(snd['snowbreak']);
}

// Turns music on or off
function toggleMusic(curr) {
	if (music) {
		music = false;
		curr.src = img['musicOffFlash'].src;

		bgm.pause();
	} else {
		music = true;
		bgm.currentTime = 0;
		curr.src = img['musicFlash'].src;
		bgm.play();
	}

	playSound(snd['snowbreak']);
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