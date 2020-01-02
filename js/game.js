// Global game class wrapper
class Game {
	constructor() {
		this.gamestate = GAMESTATE.menu;


		// Countdown timer
		this.timer = 30;
		this.tickTimer = 0;

		// Display ready, fight! images
		this.fightMsgTimer = 0;


		this.level = [
			[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
			[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 , 0 ],
			[ 0 , 0 ,"W","W","W","W","W","W", 0 , 0 , 0 , 0 ,"W","W","W","W","W","W", 0 , 0 ],
			[ 0 , 0 ,"W", 0 , 0 , 0 , 0 , 0 ,"C", 0 , 0 ,"C", 0 , 0 , 0 , 0 , 0 ,"W", 0 , 0 ],
			[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
			[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
			[ 0 , 0 ,"W", 0 , 0 , 0 , 0 , 0 ,"C", 0 , 0 ,"C", 0 , 0 , 0 , 0 , 0 ,"W", 0 , 0 ],
			[ 0 , 0 ,"W","W","W","W","W","W", 0 , 0 , 0 , 0 ,"W","W","W","W","W","W", 0 , 0 ],
			[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
			[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]
		];

		this.optionKey = "play";
		this.holdSpace = Keys.space;
	}

	toControlScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";	

		document.getElementById("backToMenuButton").style.visibility = "visible";
		this.gamestate = GAMESTATE.controls;	

		shoot_snd.play();
	}

	toArenaScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";

		document.getElementById("timer").style.visibility = "visible";

		// Reset these variables
		playerArr = [];               // Array of players
		tempArr = new ObjectArray();  // Array of temporary objects eg. bullets
		wallArr = [];                 // Array for walls
		snowArr = new ObjectArray();  // Array for snow piles

		// Create objects from level array
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				if (this.level[i][j] == "W") {
					addWall(j, i);
				} else if (this.level[i][j] == 1) {
					playerArr.push(new Player(j*gridLen, i*gridLen, 1, DIR.right));
				} else if (this.level[i][j] == 2) {
					playerArr.push(new Player(j*gridLen, i*gridLen, 2, DIR.left));
				} else if (this.level[i][j] == "C") {
					tempArr.add(new Crate(j*gridLen, i*gridLen));
				} else {
					snowArr.add(new Snow(j*gridLen, i*gridLen));
				}
			}
		}

		this.gamestate = GAMESTATE.arena;

		this.fightMsgTimer = 100;
		readFight_snd.play();

		shoot_snd.play();
	}

	toMenuScreen() {
		document.getElementById("playButton").style.visibility = "visible";
		document.getElementById("controlButton").style.visibility = "visible";

		document.getElementById("backToMenuButton").style.visibility = "hidden";
		document.getElementById("timer").style.visibility = "hidden";

		this.gamestate = GAMESTATE.menu;

		shoot_snd.play();
	}

	update() {
		if (this.gamestate == GAMESTATE.menu) {
			ctx.drawImage(titleBack_img, 0, 0);

			if (this.optionKey == "play") {
				ctx.drawImage(arrow_img, 165, 62)
			} else {
				ctx.drawImage(arrow_img, 165, 110);
			}

			// Key movements on the menu screen
			if (Keys.space && !this.holdSpace) {
				if (this.optionKey == "play") {
					this.toArenaScreen();
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

		} else if (this.gamestate == GAMESTATE.controls) {
			ctx.drawImage(controlBack_img, 0, 0);
			ctx.drawImage(arrow_img, 0, 78);

			// Press button to go back to menu
			if (Keys.space && !this.holdSpace) {
				this.toMenuScreen();
			}

		} else if (this.gamestate == GAMESTATE.arena || this.gamestate == GAMESTATE.gameover) {
			ctx.drawImage(bg, 0, 0);

			// Update objects
			snowArr.update();
			for (var i = 0; i < playerArr.length; i++) {
				playerArr[i].update();
			}
			tempArr.update();

			// Update all wall objects
			for (var i = 0; i < wallArr.length; i++) {
				wallArr[i].update();
			}

			// Tick down the timer
			this.tickTimer++;
			if (this.tickTimer == 60) {
				this.tickTimer = 0;
				if (this.timer > 0) {
					this.timer--;
				}
				document.getElementById('timer').innerHTML = this.timer;
			}

			// Display ready, fight message
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

			// Set gamestate to gameover if 1 player left
			var numAlive = playerArr.length
			var playerAlive;
			for (var i = 0; i < playerArr.length; i++) {
				if (!playerArr[i].dead) {
					playerAlive = i;
				} else {
					numAlive--;
				}
			}
			if ((numAlive == 1 || numAlive == 0) && this.gamestate == GAMESTATE.arena) {
				this.gamestate = GAMESTATE.gameover;

				win_snd.play()

				for (var i = 0; i < 200; i++) {
					tempArr.add(new Confetti(180, 180, 5, 9));
				}
			} 

			// Display winner 
			if (this.gamestate == GAMESTATE.gameover) {
				ctx.drawImage(winBack_img, 140, 80);

				ctx.save();
				ctx.font = "bold 15px Arial";
				if (numAlive == 1) {
					ctx.fillText("Player " + playerAlive + " wins!", 150,110);
				} else {
					ctx.fillText("Stalemate!", 150, 110);
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
}