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


		// Select gamemode and map
		this.level;
		this.mode = "DM";
		this.winner = 0;
	}

	// Head to selection screen
	toSelectionScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";

		this.optionKey = "mode";

		this.gamestate = GAMESTATE.selection;

	}

	// Head to control screen
	toControlScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";	

		document.getElementById("backToMenuButton").style.visibility = "visible";
		this.gamestate = GAMESTATE.controls;	

		shoot_snd.play();
	}

	// Head to arena screen
	toArenaScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";

		document.getElementById("timer").style.visibility = "visible";

		// Reset these variables
		playerArr = [];               // Array of players
		tempArr = new ObjectArray();  // Array of temporary objects eg. bullets
		wallArr = new ObjectArray();  // Array for walls
		snowArr = new ObjectArray();  // Array for snow piles
		this.winner = 0;


		// Load all the level & player data
		this.generateLevel();

		this.gamestate = GAMESTATE.arena;
		this.fightMsgTimer = 100;
		readFight_snd.play();
		shoot_snd.play();
	}


	// Head to menu screen
	toMenuScreen() {
		document.getElementById("playButton").style.visibility = "visible";
		document.getElementById("controlButton").style.visibility = "visible";

		document.getElementById("backToMenuButton").style.visibility = "hidden";
		document.getElementById("timer").style.visibility = "hidden";

		this.gamestate = GAMESTATE.menu;

		shoot_snd.play();
	}

	update() {

		// Menu screen
		if (this.gamestate == GAMESTATE.menu) {
			ctx.drawImage(titleBack_img, 0, 0);

			if (this.optionKey == "play") {
				ctx.drawImage(arrow_img, 165, 62)
			} else {
				ctx.drawImage(arrow_img, 165, 110);
			}
			// Key movements on the menu screen
			if (Keys.space && !this.holdSpace) {
				console.log("ya man");
				if (this.optionKey == "play") {
					this.toSelectionScreen();
				} else {
					this.toControlScreen();
				}
			}
			if (Keys.down && this.optionKey != "control") {
				this.optionKey = "control";
				shoot_snd.play();
			}
			if (Keys.up && this.optionKey != "play") {
				this.optionKey = "play";
				shoot_snd.play();
			}

		// Selection screen
		}  else if (this.gamestate == GAMESTATE.selection) {
			ctx.drawImage(selectionScreen_img, 0, 0);

			
			// Draw the mode selection
			ctx.save();
			ctx.fillStyle = "#717e82"
			if (this.optionKey == "mode") {
				if (this.mode == "DM") {
					ctx.fillRect(170, 120, 80, 40);
				} else {
					ctx.fillRect(250, 120, 80, 40);
				}				
			} else {
				ctx.beginPath();
				if (this.mode == "DM") {
					ctx.rect(170, 120, 80, 40);
				} else {
					ctx.rect(250, 120, 80, 40);
				}					
				ctx.stroke();
			}


			if (this.optionKey == "play") {
				ctx.fillRect(190, 160, 70, 40);
			}
			ctx.fillStyle = "black";
			ctx.font = "20px Arial";
			ctx.fillText("DM", 190, 150);
			ctx.fillText("CTF", 270, 150);
			ctx.fillText("Play", 210, 190);
			ctx.restore();

			// Switching from DM to CTF
			if (this.optionKey == "mode") {
				if (Keys.left && this.mode != "DM") {
					this.mode = "DM";
					shoot_snd.play();
				}
				if (Keys.right && this.mode != "CTF") {
					this.mode = "CTF";
					shoot_snd.play();
				}
			}

			// Switch from modes to play
			if (Keys.down && this.optionKey != "play") {
				this.optionKey = "play";
				shoot_snd.play();
			}
			if (Keys.up && this.optionKey != "mode") {
				this.optionKey = "mode";
				shoot_snd.play();
			}

			
			// Press enter to play
			if (Keys.space && !this.holdSpace) {
				if (this.optionKey == "play") {
					this.toArenaScreen();
				}
			}

		// Control screen
		} else if (this.gamestate == GAMESTATE.controls) {
			ctx.drawImage(controlBack_img, 0, 0);
			ctx.drawImage(arrow_img, 0, 78);

			// Press button to go back to menu
			if (Keys.space && !this.holdSpace) {
				this.toMenuScreen();
			}


		// Arena screen + gameover 
		} else if (this.gamestate == GAMESTATE.arena || this.gamestate == GAMESTATE.gameover) {
			ctx.drawImage(bg, 0, 0);
 
			snowArr.update();
			wallArr.update();

			for (var i = 0; i < playerArr.length; i++) {
				playerArr[i].update();
			}
			tempArr.update();
			

			// Tick down and display the timer
			this.displayTimer();

			// Tick down and display the "Ready, fight!" message
			this.displayFightMsg();


			// Draw score for CTF
			if (this.mode == "CTF") {
				ctx.save();
				ctx.font = "20px Arial";
				ctx.fillText("P1: "+playerArr[0].score+"   P2: "+playerArr[1].score, 150, 20);
				ctx.restore();
			}

			// Check if anybody has won yet - if yes, set to gameover
			if (this.winner == 0) {
				this.winner = this.checkWinner();
				if (this.winner != 0) {
					win_snd.play();
					for (var i = 0; i < 200; i++) {
						tempArr.add(new Confetti(180, 180, 5, 9));
					}
					this.gamestate = GAMESTATE.gameover;
				}
			}

			// Display winner 
			if (this.gamestate == GAMESTATE.gameover) {
				ctx.drawImage(winBack_img, 140, 80);

				ctx.save();
				ctx.font = "bold 15px Arial";
				if (this.winner == "Stalemate") {
					ctx.fillText("Stalemate!", 150, 110);
				} else {
					ctx.fillText("Player " + this.winner + " wins!", 150,110);
				}
				ctx.restore();

				document.getElementById("backToMenuButton").style.visibility = "visible";

				// Draw arrow on menu screen
				ctx.drawImage(arrow_img, 0, 78);

				// Press button to  go back to menu
				if (Keys.space && !this.holdSpace) {
					this.toMenuScreen();
				}
			}
		}

		// Remember if you held space or not
		this.holdSpace = Keys.space;
	}


	// Load the levels and players and all objects into their arrays
	generateLevel() {
		if (this.mode == "DM") {
			this.level = levels[0];
		} else {
			this.level = levels[1];
		}

		// Create players first to have reference
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (this.level[i][j] == 1) {
					playerArr.push(new Player(j*gridLen, i*gridLen, 1, DIR.right));
				} else if (this.level[i][j] == 2) {
					playerArr.push(new Player(j*gridLen, i*gridLen, 2, DIR.left));
				}
			}
		}	

		// Create objects from level array
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (this.level[i][j] == "W") {
					wallArr.add(new Wall(j*gridLen, i*gridLen));
				} else if (this.level[i][j] == "C") {
					tempArr.add(new Crate(j*gridLen, i*gridLen));
				} else if (this.level[i][j] == "F") {
					tempArr.add(new Flag(j*gridLen, i*gridLen, getPlayer(1)));
				} else if (this.level[i][j] == "G") {
					tempArr.add(new Goal(j*gridLen, i*gridLen, getPlayer(1)));
				} else if (this.level[i][j] == "R") {
					tempArr.add(new Flag(j*gridLen, i*gridLen, getPlayer(2)));
				} else if (this.level[i][j] == "T") {
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

	// Return the winner otherwise return 0
	checkWinner() {
		if (this.mode == "DM") {
			var numAlive = playerArr.length
			var playerAlive;

			// Count how many players alive
			var numAlive = 0;
			for (var i = 0; i < playerArr.length; i++) {
				if (!playerArr[i].dead) {
					numAlive++;
				}
			}

			// Get the last person standing
			if (numAlive == 1) {
				for (var i = 0; i < playerArr.length; i++) {
					if (!playerArr[i].dead) {
						return playerArr[i].playerID;
					}
				}
			} else if (numAlive == 0) {
				return "Stalemate";
			} else {
				return 0;
			}
		
		} else {
			for (var i = 0; i < playerArr.length; i++) {
				if (playerArr[i].score >= 3) {
					return playerArr[i].playerID;
					break;
				}
			}
			return 0;
		}
	}
}