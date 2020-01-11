// Global game class wrapper
class Game {
	constructor() {
		this.gamestate = GAMESTATE.menu;


		// Countdown timer
		this.timer = 30;
		this.tickTimer = 0;

		// Display ready, fight! images
		this.fightMsgTimer = 0;


		// Variables for selecting buttons on menu
		this.optionKey = "play";
		this.holdSpace = Keys.space;   // Store if last step was pressed or not


		// Select and map
		this.level = 0;
		this.winner = -1;

		this.gameover = false;
	}

	// Head to selection screen
	toSelectionScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";

		document.getElementById("backToMenuButton").style.visibility = "visible";
		document.getElementById("goButton").style.visibility = "visible";

		this.optionKey = "mode";

		this.gamestate = GAMESTATE.selection;
		playSound(snowbreak_snd);
	}

	// Head to control screen
	toControlScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";	

		document.getElementById("backToMenuButton").style.visibility = "visible";
		this.gamestate = GAMESTATE.controls;	

		playSound(snowbreak_snd);
	}

	// Head to CTF screen
	toCTFScreen() {
		document.getElementById("goButton").style.visibility = "hidden";
		document.getElementById("backToMenuButton").style.visibility = "hidden";

		var temp = document.getElementsByClassName("selectScreen");
		for (var i = 0; i < temp.length; i++) {
			temp[i].style.visibility = "hidden";
		}

		document.getElementById("ammo1").style.visibility = "visible";
		document.getElementById("timer").style.visibility = "visible";

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

		playSound(arenaBGM_snd);


		document.getElementById("scoreCTF").style.visibility = "visible";

		this.gamestate = GAMESTATE.ctf;
	}

	// Head to menu screen
	toMenuScreen() {
		document.getElementById("playButton").style.visibility = "visible";
		document.getElementById("controlButton").style.visibility = "visible";

		document.getElementById("ammo1").style.visibility = "hidden";
		document.getElementById("ammo2").style.visibility = "hidden";
		document.getElementById("backToMenuButton").style.visibility = "hidden";
		document.getElementById("timer").style.visibility = "hidden";
		document.getElementById("scoreCTF").style.visibility = "hidden";
		document.getElementById("winnerBoard").style.visibility = "hidden";
		document.getElementById("goButton").style.visibility = "hidden";

		this.gamestate = GAMESTATE.menu;

		playSound(snowbreak_snd);
	}

	// Update the menu loop
	updateMenu() {
		ctx.drawImage(titleBack_img, 0, 0);
	}

	// Update the selection screen loop
	updateSelect() {
		ctx.drawImage(selectionScreen_img, 0, 0);		
	}

	// Update the control screen loop
	updateControl() {
		ctx.drawImage(controlBack_img, 0, 0);
	}

	// Main arena update
	updateArena() {
		// Update and draw EVERYTHING
		ctx.drawImage(bg, 0, 0);
		snowArr.update();

		tempArr.updateLayer(0);
		tempArr.updateLayer(1);
		tempArr.updateLayer(2);

		for (var i = 0; i < playerArr.length; i++) {
			playerArr[i].update();
		}

		wallArr.update();

		tempArr.updateLayer(3);
		tempArr.updateLayer(4);
		tempArr.updateLayer(5);
		
		tempArr.renderHUD();

		// Tick down and display the timer
		this.displayTimer();

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

		// Capture the flag screen
		} else if (this.gamestate == GAMESTATE.ctf) {
			this.updateCTF();
		}

		// Remember if you held space or not
		this.holdSpace = Keys.space;
	}



	// Load the levels and players and all objects into their arrays
	generateLevel() {
		var level = levels[this.level];
		
		// Create players first to have reference
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (level[i][j] == 1) {
					playerArr.push(new Player(j*gridLen, i*gridLen, 1, DIR.right));
				} else if (level[i][j] == 2) {
					playerArr.push(new Player(j*gridLen, i*gridLen, 2, DIR.left));
				}
			}
		}	

		// Create objects from level array
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (level[i][j] == "W") {
					wallArr.add(new Wall(j*gridLen, i*gridLen));
				} else if (level[i][j] == "C") {
					tempArr.add(new Crate(j*gridLen, i*gridLen));
				} else if (level[i][j] == "F") {
					tempArr.add(new Flag(j*gridLen, i*gridLen, getPlayer(1)));
				} else if (level[i][j] == "G") {
					tempArr.add(new Goal(j*gridLen, i*gridLen, getPlayer(1)));
				} else if (level[i][j] == "R") {
					tempArr.add(new Flag(j*gridLen, i*gridLen, getPlayer(2)));
				} else if (level[i][j] == "T") {
					tempArr.add(new Goal(j*gridLen, i*gridLen, getPlayer(2)));
				} else {
					snowArr.add(new Snow(j*gridLen, i*gridLen));
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

	// Display timer
	displayTimer() {
		this.tickTimer++;
		if (this.tickTimer == 60) {
			this.tickTimer = 0;
			if (this.timer > 0) {
				this.timer--;
			}
			document.getElementById('timer').innerHTML = this.timer;
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