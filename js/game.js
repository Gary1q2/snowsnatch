// Global game class wrapper
class Game {
	constructor() {
		this.gamestate = GAMESTATE.menu;

		// Display ready, fight! images
		this.fightMsgTimer = 0;

		// Select and map
		this.level = 0;
		this.winner = -1;

		this.bot = true;
		this.gameover = false;

		this.justOffedControls = false;

		// Players pressing ready
		this.p1Pressed = false;
		this.p2Pressed = false;

		// Offsets for the scrolling background
		this.scrollXOff = 0;
		this.scrollYOff = 0;

		// Bouncing animation for P1 and P2 join
		this.p1JoinBounce = new Entity(50, 15, 20, 20, p1JoinBounce_img, 2, 3, [0,1,2,3,4,5], 0, 0);
		this.p2JoinBounce = new Entity(50, 82, 20, 20, p2JoinBounce_img, 2, 3, [0,1,2,3,4,5], 0, 0);
	}

	// Head to selection screen
	toSelectionScreen() {
		var temp = document.getElementsByClassName("menuScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "hidden";
		}

		var temp = document.getElementsByClassName("selectScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "visible";
		}
		document.getElementById("goButton").style.visibility = "hidden";
		document.getElementById("levelLeft").style.visibility = "hidden";

		this.p1Pressed = false;
		this.p2Pressed = false;

		// Set level name div to get the level name
		document.getElementById("levelName").innerHTML = levelNames[this.level];

		this.level = 0;

		this.gamestate = GAMESTATE.selection;
		playSound(snowbreak_snd);
	}

	// Head to unlock screen
	toUnlockScreen() {
		var temp = document.getElementsByClassName("menuScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "hidden";
		}

		var temp = document.getElementsByClassName("unlockScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "visible";
		}
		document.getElementById("backToMenuButton").style.visibility = "visible";

		this.gamestate = GAMESTATE.unlock;
		playSound(snowbreak_snd);
	}

	// Head to control screen
	toControlScreen() {
		var temp = document.getElementsByClassName("menuScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "hidden";
		}

		document.getElementById("backToMenuButton").style.visibility = "visible";

		this.gamestate = GAMESTATE.controls;	

		playSound(snowbreak_snd);
	}

	// Head to CTF screen
	toCTFScreen() {
		var temp = document.getElementsByClassName("selectScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "hidden";
		}
		document.getElementById("rematchButton").style.visibility = "hidden";
		document.getElementById("winnerBoard").style.visibility = "hidden";

		document.getElementById("tinyMenuButton").style.visibility = "visible";
		document.getElementById("ammo1").style.visibility = "visible";

		// Reset these variables
		playerArr = [];               // Array of players
		tempArr = new ObjectArrayLayered(6);  // Array of temporary objects eg. bullets
		wallArr = new ObjectArray();  // Array for walls
		snowArr = new ObjectArray();  // Array for snow piles
		this.winner = -1;
		this.gameover = false;


		// Load all the level & player data
		this.generateLevel();

		
		this.fightMsgTimer = 100;
		playSound(readFight_snd);
		playSound(snowbreak_snd);

		//playSound(arenaBGM_snd);


		document.getElementById("scoreCTF").style.visibility = "visible";

		this.gamestate = GAMESTATE.ctf;
	}

	// Head to menu screen
	toMenuScreen() {
		var temp = document.getElementsByClassName("menuScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "visible";
		}

		var temp = document.getElementsByClassName("selectScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "hidden";
		}


		document.getElementById("ammo1").style.visibility = "hidden";
		document.getElementById("ammo2").style.visibility = "hidden";
		document.getElementById("backToMenuButton").style.visibility = "hidden";
		document.getElementById("scoreCTF").style.visibility = "hidden";
		document.getElementById("winnerBoard").style.visibility = "hidden";

		document.getElementById("rematchButton").style.visibility = "hidden";

		document.getElementById("tinyMenuButton").style.visibility = "hidden";

		this.gamestate = GAMESTATE.menu;

		playSound(snowbreak_snd);
	}

	// Update the menu loop
	updateMenu() {
		this.drawScrollingBack();
		ctx.drawImage(titleBack_img, 0, 0);
	}

	// Update the selection screen loop
	updateSelect() {
		this.drawScrollingBack();
		ctx.drawImage(selectionScreen_img, 0, 0);
		this.drawLevelDisplay(this.level);


		// Show press to join for P1
		if (!this.p1Pressed && !this.p2Pressed) {
			ctx.drawImage(p1Join_img, 0, 0);
			this.p1JoinBounce.update();

			if (Keys.space) {
				this.p1Pressed = true;
				document.getElementById("goButton").style.visibility = "visible";
				playSound(snowbreak_snd);
			}

		// Show press to join for P2
		} else if (this.p1Pressed && !this.p2Pressed) {
			ctx.drawImage(p2Join_img, 0, 0);
			this.p2JoinBounce.update();

            if (Keys.f) {
            	this.p2Pressed = true;
            	this.bot = false;
           		playSound(snowbreak_snd);
            }

		} else if (this.p1Pressed && this.p2Pressed) {
			ctx.drawImage(p1p2Join_img, 0, 0);
		}




		//if p1 and p2 not pressed ---> check for L to be pressed
	}

	// Update the control screen loop
	updateControl() {
		this.drawScrollingBack();
		ctx.drawImage(controlBack_img, 0, 0);
	}

	// Update the unlock screen loop
	updateUnlock() {
		ctx.drawImage(unlockScreen_img, 0, 0);
	}

	// Main arena update
	updateArena() {
		// Update and draw EVERYTHING
		ctx.drawImage(bg, 0, 0);
		snowArr.update();

		tempArr.updateLayer(0);
		tempArr.updateLayer(1);

		wallArr.update();

		tempArr.updateLayer(2);

		for (var i = 0; i < playerArr.length; i++) {
			playerArr[i].update();
		}		

		tempArr.updateLayer(3);
		tempArr.updateLayer(4);
		tempArr.updateLayer(5);
		
		tempArr.renderHUD();

		// Tick down and display the "Ready, fight!" message
		this.displayFightMsg();

		// Check if anybody has won yet - if yes, set to gameover
		if (this.winner == -1) {
			this.winner = this.checkWinner();
			if (this.winner != -1) {
				playSound(win_snd);
				for (var i = 0; i < 200; i++) {
					tempArr.add(new Confetti(180, 180, 5, 9));
				}
				this.gameover = true;
			}
		}
	}


	// Update the capture the flag game loop
	updateCTF() {
		this.updateArena();

		// Update score element
		document.getElementById("scoreCTF").innerHTML = "P1: "+playerArr[0].score+"   P2: "+playerArr[1].score;

		if (this.gameover) {
			var winnerBoard = document.getElementById("winnerBoard");
			winnerBoard.style.visibility = "visible";
			winnerBoard.childNodes[3].innerHTML = "Player " + this.winner + " wins!";
					
			document.getElementById("backToMenuButton").style.visibility = "visible";
			document.getElementById("rematchButton").style.visibility = "visible";
		}		
	}




	// Main game loop
	update() {

		// Menu screen
		if (this.gamestate == GAMESTATE.menu) {
			this.updateMenu();

		// Selection screen
		}  else if (this.gamestate == GAMESTATE.selection) {
			this.updateSelect();

		// Control screen
		} else if (this.gamestate == GAMESTATE.controls) {
			this.updateControl();

		// Unlock screen
		} else if (this.gamestate == GAMESTATE.unlock) {
			this.updateUnlock();


		// Capture the flag screen
		} else if (this.gamestate == GAMESTATE.ctf) {
			this.updateCTF();
		}


		// Set all controls OFF if the screen isn't focused
		this.offScreenControl();
	}


	// Set all controls OFF if the screen isn't focused
	offScreenControl() {
		if (!document.hasFocus()) {
			if (!this.justOffedControls) {
				for (var i in Keys) {
					Keys[i] = false;
				}
			}
			this.justOffedControls = true;
		} else {
			if (this.justOffedControls) {
				this.justOffedControls = false;
			}
		}
	}

	// Load the levels and players and all objects into their arrays
	generateLevel() {

		// Copy level data into global level array
		currLevel = new Array(numHeight);
		for (var i = 0; i < numHeight; i++) {
			currLevel[i] = new Array(numWidth);
		}
		var temp = levels[this.level];
		for (var i = 0; i < currLevel.length; i++) {
			for (var j = 0; j < currLevel[i].length; j++) {
				currLevel[i][j] = temp[i][j];
			}
		}


		// Create players first to have reference
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (currLevel[i][j] == 1) {
					playerArr.push(new Human(j*gridLen, i*gridLen, 1, DIR.right, false));
				} else if (currLevel[i][j] == 2) {
					if (this.bot) {
						playerArr.push(new Bot(j*gridLen, i*gridLen, 2, DIR.left));
					} else {
						playerArr.push(new Human(j*gridLen, i*gridLen, 2, DIR.left));
					}
				}
			}
		}	

		// Create objects from level array
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (currLevel[i][j] == "W") {
					wallArr.add(new Wall(j*gridLen, i*gridLen));
				} else if (currLevel[i][j] == "C") {
					tempArr.add(new Crate(j*gridLen, i*gridLen));
				} else if (currLevel[i][j] == "G") {
					tempArr.add(new Flag(j*gridLen, i*gridLen, getPlayer(2)));
					tempArr.add(new Goal(j*gridLen, i*gridLen, getPlayer(1)));
				} else if (currLevel[i][j] == "T") {
					tempArr.add(new Goal(j*gridLen, i*gridLen, getPlayer(2)));
					tempArr.add(new Flag(j*gridLen, i*gridLen, getPlayer(1)));
				} else {
					snowArr.add(new Snow(j*gridLen, i*gridLen));
				}
			}
		}
	}

	// Draw the scrolling background
	drawScrollingBack() {
		ctx.drawImage(scrollingBack_img, Math.floor(this.scrollXOff), Math.floor(this.scrollYOff));
		ctx.drawImage(scrollingBack_img, Math.floor(this.scrollXOff), Math.floor(this.scrollYOff)+200);
		ctx.drawImage(scrollingBack_img, Math.floor(this.scrollXOff)+400, Math.floor(this.scrollYOff));
		ctx.drawImage(scrollingBack_img, Math.floor(this.scrollXOff)+400, Math.floor(this.scrollYOff)+200);

		this.scrollXOff -= 0.5;
		this.scrollYOff -= 0.25;
		if (this.scrollYOff <= -200) {
			this.scrollXOff = 0;
			this.scrollYOff = 0;
		}
	}

	// Draw the display for the level in selection screen
	drawLevelDisplay(level) {
		var array = levels[level];

		var xPos = 140;
		var yPos = 20;
		var size = 12;
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array[i].length; j++) {
				var value = array[i][j];
				if (value == "W") {
					ctx.drawImage(wall, 0, 0, 20, 20, xPos+j*size, yPos+i*size, size, size);
				} else if (value == "C") {
					ctx.drawImage(snow_img, 6, 6, 20, 20, xPos+j*size, yPos+i*size, size, size);
					ctx.drawImage(crate_img, 0, 0, 20, 20, xPos+j*size, yPos+i*size, size, size);
				} else if (value == "G") {
					ctx.drawImage(goal_img, 0, 0, 20, 20, xPos+j*size, yPos+i*size, size, size);
					//ctx.drawImage(flagBlue_img, 0, 0, 20, 20, xPos+j*size, yPos+i*size-size, size, size);
				} else if (value == "T") {
					ctx.drawImage(goal_img, 0, 0, 20, 20, xPos+j*size, yPos+i*size, size, size);
					//ctx.drawImage(flagGreen_img, 0, 0, 20, 20, xPos+j*size, yPos+i*size-size, size, size);
				} else if (value == "1") {
					ctx.drawImage(snow_img, 6, 6, 20, 20, xPos+j*size, yPos+i*size, size, size);
					ctx.drawImage(peng, 0, 0, 20, 20, xPos+j*size, yPos+i*size, size, size);
				} else if (value == "2") {
					ctx.drawImage(snow_img, 6, 6, 20, 20, xPos+j*size, yPos+i*size, size, size);
					ctx.drawImage(peng2, 0, 0, 20, 20, xPos+j*size, yPos+i*size, size, size);
				} else if (value == "0") {
					ctx.drawImage(snow_img, 6, 6, 20, 20, xPos+j*size, yPos+i*size, size, size);
				}
			}
		}

	}

	// Display ready, fight message
	displayFightMsg() {
		if (this.fightMsgTimer != 0) {
			if (this.fightMsgTimer > 40) {
				ctx.drawImage(msgReady_img, 140, 80);
			} else {
				ctx.drawImage(msgFight_img, 140, 80);
			}
		}
		if (this.fightMsgTimer > 0) {
			this.fightMsgTimer--;
		}
	}


	// Return the winner otherwise return -1
	checkWinner() {
		for (var i = 0; i < playerArr.length; i++) {
			if (playerArr[i].score >= 3) {
				return playerArr[i].playerID;
				break;
			}
		}
		return -1;
	}
}