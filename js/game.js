// Global game class wrapper
class Game {
	constructor() {
		this.gamestate = GAMESTATE.menu;


		// Countdown timer
		this.timer = 30;
		this.tickTimer = 0;
	}

	toControlScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";	

		document.getElementById("backToMenuButton").style.visibility = "visible";
		this.gamestate = GAMESTATE.controls;	
	}

	toArenaScreen() {
		document.getElementById("playButton").style.visibility = "hidden";
		document.getElementById("controlButton").style.visibility = "hidden";

		document.getElementById("timer").style.visibility = "visible";
		document.getElementById("banner").style.visibility = "visible";
		document.getElementById("backToMenuButton").style.visibility = "visible";

		// Reset these variables
		playerArr = [];               // Array of players
		tempArr = new ObjectArray();  // Array of temporary objects eg. bullets
		wallArr = [];                 // Array for walls
		snowArr = new ObjectArray();  // Array for snow piles

		// Create players
		playerArr.push(new Player(0, 100, 1, DIR.right));
		playerArr.push(new Player(360, 100, 2, DIR.left));

		// Create snow piles
		for (var i = 0; i < numHeight; i++) {
			for (var j = 0; j < numWidth; j++) {
				snowArr.add(new Snow(j*gridLen, i*gridLen));
			}
		}

		// Create walls
		addWall(wallArr, 3, 3);
		addWall(wallArr, 4, 3);
		addWall(wallArr, 5, 3);
		addWall(wallArr, 5, 4);
		addWall(wallArr, 5, 5);
		addWall(wallArr, 5, 6);

		addWall(wallArr, 8, 6);
		addWall(wallArr, 8, 5);
		addWall(wallArr, 8, 4);
		addWall(wallArr, 8, 3);
		addWall(wallArr, 9, 3);
		addWall(wallArr, 10, 3);

		// Add crate
		tempArr.add(new Crate(8*gridLen, 8*gridLen));

		this.gamestate = GAMESTATE.arena;
	}

	toMenuScreen() {
		document.getElementById("playButton").style.visibility = "visible";
		document.getElementById("controlButton").style.visibility = "visible";

		document.getElementById("backToMenuButton").style.visibility = "hidden";
		document.getElementById("timer").style.visibility = "hidden";
		document.getElementById("banner").style.visibility = "hidden";

		this.gamestate = GAMESTATE.menu;
	}

	update() {
		if (this.gamestate == GAMESTATE.menu) {
			ctx.drawImage(titleBack_img, 0, 0);
		} else if (this.gamestate == GAMESTATE.controls) {
			ctx.drawImage(controlBack_img, 0, 0);
		} else if (this.gamestate == GAMESTATE.arena) {
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
		}
	}
}