class Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;

		this.nRow = nRow;
		this.nCol = nCol;
		this.frameSeq = frameSeq;

		this.centerX = centerX;
		this.centerY = centerY;

		this.angle = DIR.right;

		this.animIndex = 0;
		this.animCurrFrame = 0;
		this.animDelay = 0;
		this.animDelayTime = 4;
		this.finishAnim = false;

		this.colShiftX = 0;
		this.colShiftY = 0;
	}
	update() {
		this.drawAnimated(this.frameSeq); 
	}

 	drawAnimated(array) {
		this.finishAnim = false;
		this.animCurrFrame = array[this.animIndex];

		var xPos = (this.animCurrFrame % this.nCol) * this.img.width/this.nCol;
		var yPos = Math.floor(this.animCurrFrame / this.nCol) * this.img.height/this.nRow;
	
		// Draw animation depending on angle
		if (this.angle == DIR.right) {
			ctx.translate(this.x, this.y);
		} else if (this.angle == DIR.up) {
			ctx.translate(this.x, this.y);
			ctx.rotate(-90*Math.PI/180);
			ctx.translate(-this.img.width/this.nCol, 0);
		} else if (this.angle == DIR.left) {
			ctx.translate(this.x+this.img.width/this.nCol, this.y);
			ctx.scale(-1, 1);
		} else if (this.angle == DIR.down) {
			ctx.translate(this.x, this.y);
			ctx.rotate(90*Math.PI/180);
			ctx.translate(0, -this.img.width/this.nCol);		
		}
		ctx.drawImage(this.img, xPos, yPos, this.img.width/this.nCol, this.img.height/this.nRow, -this.centerX, -this.centerY,
					  this.img.width/this.nCol, this.img.height/this.nRow);
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		if (this.animDelay <= this.animDelayTime) {
			this.animDelay++;
		} else {
			this.animDelay = 0;
			this.animIndex++;
			if (this.animIndex >= array.length) {
				this.animIndex = 0;
				this.finishAnim = true;
			}
		}
	}

	getXAnchor() {
		return this.x-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2;
	}

	getYAnchor() {
		return this.y-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2;
	}

	// Draw collision box for sprite
	drawCol() {
		var x_anchor = this.getXAnchor();
		var y_anchor = this.getYAnchor();

		ctx.beginPath();

		// Left vertical
		ctx.moveTo(x_anchor+0.5, y_anchor);
		ctx.lineTo(x_anchor+0.5, y_anchor+this.height);

		// Right vertical
		ctx.moveTo(x_anchor+this.width-0.5, y_anchor);
		ctx.lineTo(x_anchor+this.width-0.5, y_anchor+this.height);

		// Top horizontal
		ctx.moveTo(x_anchor, y_anchor+0.5);
		ctx.lineTo(x_anchor+this.width, y_anchor+0.5);

		// Bottom horizontal
		ctx.moveTo(x_anchor, y_anchor+this.height-0.5);
		ctx.lineTo(x_anchor+this.width, y_anchor+this.height-0.5);

		ctx.stroke();
	}


	// Check collision with another object
	collideWith(other) {
		var rect1 = {
			x: this.x-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2,
			y: this.y-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2,
			width: this.width,
			height: this.height
		};

		var rect2 = {
			x: other.x-other.centerX+other.colShiftX+other.img.width/other.nCol/2-other.width/2,
			y: other.y-other.centerY+other.colShiftY+other.img.height/other.nRow/2-other.height/2,
			width: other.width,
			height: other.height
		};

		return testCollisionRectRect(rect1, rect2);
	}


	// Check collision with another object @ certain offset
	collideWithAt(other, xOff, yOff) {
		var rect1 = {
			x: this.x-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2 + xOff,
			y: this.y-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2 + yOff,
			width: this.width,
			height: this.height
		};
		var rect2 = {
			x: other.x-other.centerX+other.colShiftX+other.img.width/other.nCol/2-other.width/2,
			y: other.y-other.centerY+other.colShiftY+other.img.height/other.nRow/2-other.height/2,
			width: other.width,
			height: other.height
		};
		return testCollisionRectRect(rect1, rect2);
	}

	// Get the object's rectangle at a certain (x,y)
	getRectAt(xNew, yNew) {
		var rect = {
			x: xNew-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2,
			y: yNew-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2,
			width: this.width,
			height: this.height
		};
		return rect;
	}

	// Check collision with wall objects
	checkWallCol() {
		for (var i = 0; i < wallArr.array.length; i++) {
			if (!wallArr.array[i].dead) {
				if (this.collideWith(wallArr.array[i])) {
					return wallArr.array[i];
				}
			}
		}
		return false;
	}

	// Check collision with wall objects at offset
	checkWallColAt(xOff, yOff) {
		for (var i = 0; i < wallArr.array.length; i++) {
			if (!wallArr.array[i].dead) {
				if (this.collideWithAt(wallArr.array[i], xOff, yOff)) {
					return wallArr.array[i];
				}
			}
		}
		return false;
	}


	// Check collision with the edge
	checkEdgeCol() {
		var leftX = this.x-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2;
		var topY = this.y-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2;
		var rightX = leftX + this.width;
		var bottomY = topY + this.height;

		// Check if any edge is outside the room
		if (leftX < 0 || topY < 0 || rightX > numWidth*gridLen || bottomY > numHeight*gridLen) {
			return true;
		} else {
			return false;
		}
	}

	// Check collision with edge at offset
	checkEdgeColAt(xOff, yOff) {
		var leftX = this.x-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2 + xOff;
		var topY = this.y-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2 + yOff;
		var rightX = leftX + this.width;
		var bottomY = topY + this.height;

		// Check if any edge is outside the room
		if (leftX < 0 || topY < 0 || rightX > numWidth*gridLen || bottomY > numHeight*gridLen) {
			return true;
		} else {
			return false;
		}
	}


	setAngle(angle) {
		this.angle = angle;
	}

	// Change current sprite to another
	changeSprite(img, width, height, nRow, nCol, frameSeq, centerX, centerY) {
		this.img = img;
		this.width = width;
		this.height = height;
		this.nRow = nRow;
		this.nCol = nCol
		this.frameSeq = frameSeq;
		this.centerX = centerX;
		this.centerY = centerY;
	}
}




class Smoke extends Entity {
	constructor(x, y, dir) {
		super(x, y, 20, 20, smoke_img, 3, 3, [0,1,2,3,4,5], 0, 0);
		this.animDelayTime = 8;
		this.dead = false;

		this.vspeed = 0.5;
		this.hspeed = 0.5;
		if (Math.random() > 0.5) {
			this.vspeed = -this.vspeed;
		}
		if (Math.random() > 0.5) {
			this.hspeed = -this.hspeed;
		}

		this.friction = 0.05;
	}
	update() {
		this.updateMovement();
		this.draw();
	}
	updateMovement() {
		if (this.vspeed > 0) {
			this.vspeed -= this.friction;
		} else if (this.vspeed < 0) {
			this.vspeed += this.friction;
		}
		if (this.hspeed > 0) {
			this.hspeed -= this.friction;
		} else if (this.hspeed < 0) {
			this.hspeed += this.friction;
		}
		this.x += this.hspeed;
		this.y += this.vspeed;
	}
	draw() {
		this.drawAnimated(this.frameSeq);
		if (this.finishAnim) {
			this.dead = true;
		}

		if (debug) {
			this.drawCol();
		}
	}
}

class Shell extends Entity {
	constructor(x, y, img, dir) {
		super(x, y, 4, 3, img, 1, 1, [0], 0,0);
		this.dead = false;

		this.dir = dir;
		this.stopTime = 30+Math.random()*10;
		this.deadTime = 200;

		this.vspeed = -1;
		this.hspeed = 1.5+Math.random();

		// Set direction of shell (if left or right otherwise random)
		if (this.dir == DIR.up || this.dir == DIR.down) {
			if (Math.random() > 0.5) {
				this.hspeed = -this.hspeed;
			}
		} else {
			if (this.dir == DIR.left) {
				this.hspeed = this.hspeed;
			} else {
				this.hspeed = -this.hspeed;
			}
		}
		this.fallSpeed = 1;
		this.friction = 0.1
	}

	update() {
		this.updateMovement();
		this.draw();

		if (this.stopTime > 0) {
			this.stopTime--;
		}
		if (this.deadTime > 0) {
			this.deadTime--;
			if (this.deadTime == 0) {
				this.dead = true;
			}
		}

		if (debug) {
			this.drawCol();
		}
	}
	updateMovement() {
		if (this.stopTime > 0) {

			if (this.vspeed < this.fallSpeed) {
				this.vspeed += this.friction;
			}
			if (this.hspeed > 0) {
				this.hspeed -= this.friction;
			} else if (this.hspeed < 0) {
				this.hspeed += this.friction;
			}

			this.x += this.hspeed;
			this.y += this.vspeed;
		}
	}

	draw() {
		this.drawAnimated(this.frameSeq);
	}
}

class Confetti extends Entity {
	constructor(x, y, xSpread, ySpread) {

		// Pick random confetti color
		var imgColor;
		var temp = Math.random()*5;
		if (temp < 1) {
			imgColor = confettiBlue_img;
		} else if (temp < 2) {
			imgColor = confettiGreen_img;
		} else if (temp < 3) {
			imgColor = confettiPurple_img;
		} else if (temp < 4) {
			imgColor = confettiRed_img;
		} else {
			imgColor = confettiYellow_img;
		}

		super(x, y, 2, 2, imgColor, 2, 2, [0,1,2,3], 0, 0);
		this.dead = false;

		this.alignTime = 20;// + Math.random()*20;

		this.vspeed = -(Math.random()*ySpread)
		this.hspeed = Math.random()*xSpread;
		if (Math.random() > 0.5) {
			this.hspeed = -this.hspeed;
		}

		this.fallSpeed = 1;
		this.friction = 0.1
	
	}	
	update() {
		this.updateMovement();
		this.checkDead();

		this.draw();
		if (debug) {
			this.drawCol();
		}

		if (this.alignTime > 0) {
			this.alignTime--;
		}
	}
	updateMovement() {
		if (this.alignTime == 0) {
			this.vspeed = this.fallSpeed
			if (this.hspeed > 0) {
				this.hspeed -= this.friction;
			} else if (this.hspeed < 0) {
				this.hspeed += this.friction;
			}
		}
		this.x += this.hspeed;
		this.y += this.vspeed;
	}

	draw() {
		this.drawAnimated(this.frameSeq);
	}

	// Check if out of bounds or hit some terrain
	checkDead() {
		if (this.checkEdgeCol()) {
			this.dead = true;
		}
	}
}

class Timer extends Entity {
	constructor(x, y, time) {
		super(x, y, 10, 10, timer_img, 4, 4, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 0,0);
		this.dead = false;

		// 16 is 1 frame more, but lets player see the full red circle
		this.animDelayTime = time/16;
	}
	update() {
		this.draw();
	}

	draw() {
		this.drawAnimated(this.frameSeq);
	}
}

class Flag extends Entity {
	constructor(x, y, owner) {

		// player 1 = green, player 2 = blue
		var flagColor;
		if (owner.playerID == 1) {
			flagColor = flagGreen_img;
		} else {
			flagColor = flagBlue_img
		}
		super(x, y, 20, 20, flagColor, 1, 2, [0,1], 0, 20);
		this.dead = false;
		this.owner = owner;
		this.acquired = false;
		this.atGoal = true;

		this.initX = x;
		this.initY = y;

		this.animDelayTime = 10;

		// Shift flag collision down 15 pixels
		this.colShiftY = 15;

		this.respawnTimer = 0;
		this.respawnTime = 20*60;

		this.timer;
	}
	update() {
		// Check if player got it
		if (!this.acquired) {
			this.checkGet();

		// Check if player drops it 
		} else {
			this.checkDead();
			this.updateMovement();
		}
		
		this.draw()

		// Draw collision to show players how to get it
		if (!this.atGoal && !this.acquired) {
			this.timer.update();
			this.tickRespawn();
			this.drawCol();
		}
	}

	// Tick down the respawn timer
	tickRespawn() {
		if (this.respawnTimer > 0) {
			this.respawnTimer--;
			if (this.respawnTimer == 0) {
				this.respawn();
			}
		}
	}

	updateMovement() {
		this.x = this.owner.x;
		this.y = this.owner.y+5;
	}

	// If player dead, drop flag and start timer
	checkDead() {
		if (this.owner.dead) {
			this.acquired = false;
			this.owner.hasFlag = false;
			this.respawnTimer = this.respawnTime;
			this.timer = new Timer(this.x+5, this.y+5, this.respawnTime);
		}
	}

	// Check if player got it
	checkGet() {
		for (var i of playerArr) {
			if (this.owner == i && this.collideWith(i) && !i.dead) {
				console.log("Player " + i.playerID + " acquired flag... player" +this.owner.playerID + "'s flag gg");
				this.acquired = true;
				this.atGoal = false;
				this.owner.hasFlag = true;
				playSound(flagGot_snd);
				break;
			}
		}
	}

	draw() {
		this.drawAnimated(this.frameSeq);
	}

	respawn() {
		this.x = this.initX;
		this.y = this.initY;
		this.acquired = false;
		this.atGoal = true;
	}
}

class Snow extends Entity {
	constructor(x, y) {
		super(x, y, 20, 20, snow_img, 4, 3, [0], 6, 6);
		this.dead = false;
		this.breaking = false;
	}
	update() {
		this.checkStep();
		this.draw();
	}
	draw() {
		if (!this.breaking) {
			this.drawAnimated(this.frameSeq);
		} else {
			this.drawAnimated([0,1,2,3,4,5,6,7,8,9,10,11]);
			if (this.finishAnim) {
				this.dead = true;
			}
		}
	}
	// Check if stepped on
	checkStep() {
		for (var i of playerArr) {
			if (this.collideWith(i)) {
				if (!this.breaking) {
					this.breaking = true;
					playSound(snowbreak_snd);
				}
				break;
			}
		}
	}
}

class Crate extends Entity {
	constructor(x, y) {
		super(x, y, 20, 20, crate_img, 1, 3, [0, 1], 0, 0);
		this.dead = false;

		this.broken = false;
		this.waitTimer = 0;
		this.waitTime = 60;

		this.animDelayTime = 40;
	}
	update() {
		this.checkGot();
		this.draw();
		if (debug) {
			this.drawCol();
		}

		if (this.waitTimer > 0) {
			this.waitTimer--;
			if (this.waitTimer == 0) {
				this.dead = true;
			}
		}
	}

	draw() {
		if (!this.dead) {
			if (this.broken) {
				this.drawAnimated([2]);
			} else {
				this.drawAnimated(this.frameSeq);
			}
		}
	}

	// Check if player got it
	checkGot() {
		for (var i of playerArr) {
			if (this.collideWith(i) && !this.dead && !this.broken) {
				this.broken = true;
				this.waitTimer = this.waitTime;
				playSound(crateOpen_snd);

				// Give random gun
				var rand = Math.random();
				if (rand < 0.2) {
					i.gun = new LaserGun(i);
				} else if (rand < 0.4) {
					i.gun = new Shotgun(i);
	     		} else if (rand < 0.6) {
	     			i.gun = new Uzi(i);
	     		} else if (rand < 0.8) {
	     			i.gun = new RocketLauncher(i);
	     		} else {
	     			i.gun = new Mine(i);
	     		}
	     		

	     		// Spawn crate in random empty spawn
	     		while (true) {
	     			var temp_y = Math.floor(Math.random()*numHeight);
	     			var temp_x = Math.floor(Math.random()*numWidth);
	     			if (levels[game.level][temp_y][temp_x] != "W") {
	     				tempArr.add(new Crate(temp_x*gridLen, temp_y*gridLen));
	     				break;
	     			}
	     		}
				
				break;
			}
		}
	}
}

class Goal extends Entity {
	constructor(x, y, owner) {
		super(x, y, 20, 20, goal_img, 1, 1, [0], 0,0);
		this.owner = owner;
	}
	update() {
		this.checkGoal();
		this.draw();
		if (debug) {
			this.drawCol();
		}
	}

	// Check if flag is returned to goal
	checkGoal() {
		for (var i of tempArr.array) {
			for (var j of i) {
				if (j instanceof Flag) {
					if (this.owner.playerID == j.owner.playerID && j.acquired && this.collideWith(j.owner)) {
						this.giveGoal(j);
					}
				}
			}
		}
	}

	// Give the goal to the player
	giveGoal(flag) {
		for (var j = 0; j < 100; j++) {
			tempArr.add(new Confetti(180, 180, 5, 9));
		}
		this.owner.hasFlag = false;
		this.owner.score++;
		flag.respawn();
		playSound(win_snd);
		console.log("winner");
	}

	draw() {
		this.drawAnimated(this.frameSeq);
	}
}

class Wall extends Entity {
	constructor(x, y) {
		super(x, y, 20, 20, wall, 4, 4, [0], 0,0);

		this.dead = false;
		this.maxHp = 10;
		this.hp = this.maxHp;

		this.invuln = false;
	}

	update() {
		this.draw();
	}

	draw() {
		if (this.hp > 0) {		
			var temp = this.maxHp-this.hp;
			this.drawAnimated([Math.floor(temp)]);
		} else {
			this.drawAnimated([10,11,12,13]);
			if (this.finishAnim) {
				this.dead = true;
				currLevel[this.y/gridLen][this.x/gridLen] = 0;  // Set wall to broken in the global level array
			}
		}
	}

	// Damage the wall
	damageWall(dmg) {
		playSound(iceCrack_snd);
		if (this.hp <= dmg) {
			playSound(wallBreak_snd);
		}
		this.hp -= dmg;
	}
}



// A playable character controlled by a human or bot
class Player extends Entity {
	constructor(x, y, playerID, startFace) {
		var pengColor;
		//if (playerID == 1) {
			pengColor = peng;
		//} else {
		//	pengColor = peng2;
		//}

		super(x, y, 14, 14, pengColor, 1, 3, [0,1], 0,0);

		this.speed = 1;            // Move speed

		this.shootTimer = 0;       // Timer for shooting

		this.playerID = playerID;


		this.gun = new SnowGun(this);

		this.startFace = startFace;    // Initial direction the player faces
		this.angle = this.startFace;   // Current angle of object

		this.dead = false;            
		this.dying = false;           // In dying animation


		this.moving = false; // If player is moving or not

		this.canMoveTimer = 100;   // Delay before game starts

		this.initX = x;   // Remember initial spawn location
		this.initY = y;

		this.respawnTimer = 0;
		this.respawnTime = 100;

		this.score = 0;     // How many flags captured

		this.hasFlag = false;


		this.animDelayTime = 20;   // Set animation speed for initial idling
	}

	// Update function that only updates the basics
	update() {
		this.updateAmmoHUD();
		this.draw();
		if (debug) {
			this.drawCol();
		}

		if (!this.dead) {
			this.gun.update();
		} else {
			if (this.respawnTimer > 0) {
				this.respawnTimer--;
				if (this.respawnTimer == 0) {
					this.respawnTimer = this.respawnTime;
					this.respawn();
				}
			}
		}

		this.canMoveTimer--;
		if (this.shootTimer > 0) {
			this.shootTimer--;
		}
	}

	updateAmmoHUD() {
		if (!(this.gun instanceof SnowGun)) {
			var ammoHUD = document.getElementById("ammo"+this.playerID);
			ammoHUD.style.left = canvasScaling*this.x+35;
			ammoHUD.style.top = canvasScaling*this.y-25;
			ammoHUD.innerHTML = this.gun.ammo;
		}
	}


	draw() {
		// Alive sprite
		if (!this.dead) {

			// Walking animation
			if (this.moving) {
				this.drawAnimated([0, 2]);

			// Idle animation
			} else {
				this.drawAnimated(this.frameSeq);
			}

		// Dead sprite
		} else {

			// Dying animation
			if (this.dying) {
				this.drawAnimated([2,3,4,5,6,7,8]);
				if (this.finishAnim) {
					this.dying = false;
				}

			// Dead sprite
			} else {
				this.drawAnimated([8]);
			}
		}

		// Draw AMMO hud
		if (!(this.gun instanceof SnowGun)) {
			tempArr.pushHUD(ammo_img, this.x, this.y-10);
		}
	}


	shoot() {
		if (this.shootTimer == 0) {
			this.gun.shoot();
			this.shootTimer = this.gun.shootTime;
		}
	}

	// Get the player to die
	die(bulletDir) {
		this.dead = true;
		this.dying = true;

		this.animDelayTime = 4;

		this.respawnTimer = this.respawnTime;
		
		// Die with the right direction animation
		this.setAngle(DIR.right);

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;

		// Player 1 vs player 2
		var temp;
		//if (this.playerID == 1) {
			temp = playerDie_img;
		//} else {
		//	temp = player2Die_img;
		//}
		this.changeSprite(temp, 14, 14, 3, 3, [0], 20, 20);

		playSound(die_snd);
		playSound(die2_snd);



		// Reset the pathing array, current position && flag array if bot dies
		if (this instanceof(Bot)) {
			this.path = [];
			this.flag = [];
			this.currPos = this.startPos;
			this.task = TASK.idle;
			console.log("i died and im a bot -> my path array reset");
		}
	}


	// Respawn the player
	respawn() {
		this.gun = new SnowGun(this);
		this.dead = false;
		this.dying = false;

		// Reset these so player faces correct direction once they respawn if they hold the keys
		this.moving = false;


		this.firstKeyPress = DIR.none;

		// Back to original spot
		this.x = this.initX;
		this.y = this.initY;

		var temp;
		//if (this.playerID == 1) {
			temp = peng;
		//} else {
		//	temp = peng2;
		//}

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
		this.animDelayTime = 20;


		this.setAngle(this.startFace);
		this.changeSprite(temp, 14, 14, 1, 3, [0, 1], 0,0);
	}
}


// Human controlled player
class Human extends Player {
	constructor(x, y, playerID, startFace) {
		super(x, y, playerID, startFace);

		// Stores if the keys are pressed or not
		this.leftKey;   
		this.rightKey;
		this.upKey;
		this.downKey;
		this.shootKey;

		this.strafeDir = DIR.none; // Direction keep facing when strafing
		this.firstKeyPress = DIR.none;  // Key first pressed for strafing
		
	}

	update() {

		// Register keypresses for moving & shooting
		if (!this.dead && this.canMoveTimer <= 0) {
			this.updateKeypress();
			if (this.shootKey) {
				this.shoot();
			}
			this.updateMovement();
		}

		// Update the basic functions
		super.update();
	}

	// Grab keypresses from global keys object
	updateKeypress() {
		if (this.playerID == 1) {
			this.leftKey = Keys.left;
			this.rightKey = Keys.right;
			this.upKey = Keys.up;
			this.downKey = Keys.down;
			this.shootKey = Keys.space;
		} else if (this.playerID == 2) {
			this.leftKey = Keys.a;
			this.rightKey = Keys.d;
			this.upKey = Keys.w;
			this.downKey = Keys.s;
			this.shootKey = Keys.f;			
		}

		// Check if player is moving or not
		if (this.leftKey || this.rightKey || this.upKey || this.downKey) {
			if (!this.moving) {
				this.moving = true;

				// Prepare for new animation - idle to walking
				this.animIndex = 0;
				this.animDelay = 0;
				this.animDelayTime = 6;
			}
		} else {
			if (this.moving) {
				this.moving = false;

				// Prepare for new animation - walking to idle
				this.animIndex = 0;
				this.animDelay = 0;
				this.animDelayTime = 20;
			}

			this.firstKeyPress = DIR.none;
		}

		if (this.moving) {

			// Start strafing
			if (this.firstKeyPress == DIR.none) {
				if (this.leftKey) { this.firstKeyPress = DIR.left; }
				if (this.rightKey) { this.firstKeyPress = DIR.right; }
				if (this.upKey) { this.firstKeyPress = DIR.up; }
				if (this.downKey) { this.firstKeyPress = DIR.down; }
				this.setAngle(this.firstKeyPress);

			// Change strafe direction mid-strafe
			} else {
				var keyArr = this.currKeysPressed();
				if (keyArr.length == 1 && this.firstKeyPress != keyArr[0]) {
					this.firstKeyPress = keyArr[0];
					this.setAngle(this.firstKeyPress);
				}
			}
		}
	}



	// Update movement based on key presses
	updateMovement() {
		if (this.leftKey) {
			if (!this.checkEdgeColAt(-this.speed, 0) && !this.checkWallColAt(-this.speed, 0)) {
				this.x -= this.speed;
			}
		}
		if (this.rightKey) {
			if (!this.checkEdgeColAt(this.speed, 0) && !this.checkWallColAt(this.speed, 0)) {
				this.x += this.speed;
			}
		}
		if (this.upKey) {
			if (!this.checkEdgeColAt(0, -this.speed) && !this.checkWallColAt(0, -this.speed)) {
				this.y -= this.speed;
			}	
		}
			
		if (this.downKey) {
			if (!this.checkEdgeColAt(0, this.speed) && !this.checkWallColAt(0, this.speed)) {
				this.y += this.speed;
			}	
		}
			
	}

	// Return the current keys pressed
	currKeysPressed() {
		var keys = [];
		if (this.rightKey) { keys.push(DIR.right); }
		if (this.leftKey) { keys.push(DIR.left);}
		if (this.upKey) { keys.push(DIR.up); }
		if (this.downKey) { keys.push(DIR.down); }
		return keys;
	}
}


// Computer controlled player
class Bot extends Player {
	constructor(x, y, playerID, startFace) {
		super(x, y, playerID, startFace);
		console.log("I am a bot... i will destroy you...");

		// This isn't updated... so won't update when walls are destroyed
		this.astar = new Astar();

		// Curent task of the bot
		this.task = TASK.getFlag;

		// Array containing grids which bot needs to go to
		this.path = [];

		// Array containing possible grid location of the flag
		this.flag = [];


		this.dodgeTime = 20; // Cooldown before dodging again
		this.dodgeTimer = 0;

		this.waitTimer = 0;  // How long to wait before doing stuff again


		this.dodgeWay;  // which way bullet is coming


		// Current position of bot
		this.currPos = {
			x: x/gridLen,
			y: y/gridLen
		};

		this.prevPos = this.currPos; // Previous position before currPos

		this.alleySave = this.prevPos;   // Stores the last path BEFORE an alley way turn to run from alley attacks lol...


		this.shootDir = DIR.left;  // Direction to shoot after moving to shooting position

		this.dodgeMethod = DODGE.move;

		// Remember the starting coordinates
		this.startPos = this.currPos;

		// Find the coordinates for the bot's goal
		this.goal;
		for (var i = 0; i < currLevel.length; i++) {
			for (var j = 0; j < currLevel[i].length; j++) {
				if (currLevel[i][j] == "T") {
					this.goal = {
						x: j,
						y: i
					};
				}
			}
		}


		this.dodgeWaitTime = 0;

		this.attackFail = 0;      // If bot fails to find a shoot spot 4 times, banned from attacking for a little while
		this.attackBanTime = 60;
		this.attackBanTimer = 0;

		this.targetSnowball;  // Store position of target snowball that we are trying to dodge


		this.checkedBalls = [];  // List of all snowballs already checked

		this.dodging = false;
	}

	update() {

		// Stop moving when gameover
		if (!game.gameover) {

			// Only move if allowed
			if (!this.dead && this.canMoveTimer <= 0) {




				// Decide what task the bot needs to do
				this.dodgeWay = this.checkDodge();
				if (this.dodgeWay) {
					this.task = TASK.dodge;
					this.dodging = false;
					this.attackBantimer = 0; // Once attacked, u can ATTACK
					this.waitTimer = 0;  // Reset wait timer, becus need to dodge again
				

				// Wait for a bit if you have to wait
				} else if (this.task == TASK.wait) {


				// Decide whether to attack or not 
				} else if (this.task != TASK.attack && this.shouldBotAttack() && this.attackBanTimer == 0) {

					this.task = TASK.attack;
					this.path = [];
			


				// Get flag or go home   (has to be idle... otherwise all cases would just get to this)
				} else if (this.task == TASK.idle) {
					if (!this.hasFlag) {
						this.task = TASK.getFlag;
					} else {
						this.task = TASK.goHome; 
					}
					this.flag = []; // Reset the flag array to empty
				}



				// Generate path to get the flag
				if (this.task == TASK.getFlag && this.path.length == 0) {

					// Generate possible locations of the flag
					if (this.flag.length == 0) {
						this.flag = this.findFlagLoc();		


					// No flag found at previous location, pop off		
					} else {
						console.log("Not in previous flag position, POPPED OFF");
						this.flag.shift();
					}

					// Find path to the flag
					if (this.flag.length != 0) {
						this.path = this.astar.search(this.currPos, this.flag[0], this.findEnemyLoc());
					}


				// Generate path to go home
				} else if (this.task == TASK.goHome && this.path.length == 0) {
					this.path = this.astar.search(this.currPos, this.goal, this.findEnemyLoc());



				// Dodging a bullet
				} else if (this.task == TASK.dodge && !this.dodging) {
					if (this.dodgeMethod == DODGE.move) {
						this.path = this.dodgeAway();
						this.dodging = true;
					} else {
						this.task = TASK.wait;

						if (this.dodgeWaitTime > 0) {
							this.waitTimer = this.dodgeWaitTime;
						} else {
							this.waitTime = 1;
						}

						this.dodging = true;
						this.path = [];
						console.log("DIDN't STEP INTO A SNOWBALL....    waitTimer = " + this.waitTimer);
					}


				// Attacking the enemy
				} else if (this.task == TASK.attack && this.path.length == 0 && this.shootTimer == 0) {
					var route = this.attack();
					if (route.length != 0) {
						this.path = route;

					// No path was found at that distance... just cancel shooting;
					} else {
						this.task = TASK.idle;
					}


				// Don't do anything
				} else if (this.task == TASK.idle) {
					console.log("in idle");
				}




				// Move the bot because it has somewhere to go
				if (this.path.length != 0) {

					// Not yet reached the 1st designated grid
					if (this.x != this.path[0].x*gridLen || this.y != this.path[0].y*gridLen) {
						this.moveToPos(this.path[0]);

					// Reached spot, pop off AND MOVE TO NEW SPOT
					} else {

						// Store the alleySave position in case in a corridor and need to run back
						if (this.prevPos.y == this.currPos.y && this.currPos.y != this.path[0].y) {
							this.alleySave = this.prevPos;
						}

						this.prevPos = this.currPos;
						this.currPos = this.path[0];
						this.path.shift();

						// Still have somewhere to go.. so keep going
						if (this.path.length != 0) {
							this.moveToPos(this.path[0]);

						// Reached the intended destination
						} else {

							// Arrived at shooting spot...so shoot
							if (this.task == TASK.attack) {
								this.angle = this.shootDir;
								this.shoot();
								this.task = TASK.idle;
								console.log("i JUST SHOT AND back to idlee");

							// Finished dodging to the designated spot
							} else if (this.task == TASK.dodge) {
								this.task = TASK.wait;
								this.dodging = false;

								// Need to minus time it takes to get to the dodging spot
								if (this.dodgeWaitTime-gridLen/this.speed > 0) {
									this.waitTimer = this.dodgeWaitTime-gridLen/this.speed;
								} else {
									this.waitTime = 1;
								}

								console.log("finished dodging.... dodgeWaitTime = " + this.waitTimer);

							} else {
								console.log("before idle..? = " + this.task);
								this.task = TASK.idle;
								console.log("im there now... idle");
							}
							

						}



					}

					if (this.moving == false) {
						this.moving = true;

						// Preparing change in animation - from idle to walking
						this.animIndex = 0;
						this.animDelay = 0;
						this.animDelayTime = 6;
					}
				} else {

					if (this.moving) {
						this.moving = false;

						// Prepare for new animation - walking to idle
						this.animIndex = 0;
						this.animDelay = 0;
						this.animDelayTime = 20;
					}
				}


				// Shooting automatically
				/*if (this.shootTimer == 0) { 
					var enemy = playerArr[0];
					if ((this.angle == DIR.left && enemy.x < this.x) ||
					    (this.angle == DIR.right && enemy.x > this.x) ||
					    (this.angle == DIR.up && enemy.y < this.y)    ||
					    (this.angle == DIR.down && enemy.y > this.y)) {
					   	this.shoot();
					}
				}*/
			}

			if (this.dodgeTimer > 0) {
				this.dodgeTimer--;
			}
			if (this.attackBanTimer > 0) {
				this.attackBanTimer--;
			}
			if (this.waitTimer > 0) {
				this.waitTimer--;
				if (this.waitTimer == 0) {
					this.task = TASK.idle;
					if (this.dodging == true) {
						this.dodging = false;
					}
				}
			}
		}


		// Common functions dealing with updates to player
		super.update();
	}


	// Calculate path for player to move to and ATTACK
	attack() {
		var enemyLoc = this.findEnemyLoc();
		var dest;

		// 50% chance that bot will close in on gap
		var moveIn = 0;
		if (Math.random() < 0.5) {
			moveIn = 1;
		};





		// X axis is shorter than y axis
		if (Math.abs(enemyLoc.x-this.currPos.x) < Math.abs(enemyLoc.y-this.currPos.y) && this.checkShootSpotX(enemyLoc, moveIn)) {
			dest = {
				x: enemyLoc.x,
				y: this.currPos.y
			};

			if (enemyLoc.y < this.currPos.y) {
				this.shootDir = DIR.up;
				dest.y -= moveIn;
			} else {
				this.shootDir = DIR.down;
				dest.y += moveIn;
			}

		// Y axis is shorter than x axis
		} else if (Math.abs(enemyLoc.x-this.currPos.x) > Math.abs(enemyLoc.y-this.currPos.y) && this.checkShootSpotY(enemyLoc, moveIn)) {
			dest = {
				x: this.currPos.x,
				y: enemyLoc.y
			}

			if (enemyLoc.x < this.currPos.x) {
				this.shootDir = DIR.left;
				dest.x -= moveIn;
			} else {
				this.shootDir = DIR.right;
				dest.x += moveIn;
			}

		// Not possible to do anything... just return
		} else {
			console.log("cant do shit... returning out hehe");
			this.attackFail++;
			if (this.attackFail >= 4) {
				this.attackBanTimer = this.attackBanTime;
				this.attackFail = 0;
				console.log("BANNED FROM ATTACKING for 1 SECOND!!!!");
			}
			return [];
		}

		var path = this.astar.search(this.currPos, dest, this.findEnemyLoc());

		// Couldn't find a path there so.... fk it back to idle
		if (path.length == 0) {
			console.log("FAILED no path to DEST["+dest.x+","+dest.y+"]");
			return [];
		} else {
			console.log("Found path to DEST["+dest.x+","+dest.y+"]     curr dest["+this.currPos.x+","+this.currPos.y+"]");
			this.attackFail = 0;
			return path;
		}
		

	}


	// Check if shooting spot is free when moving on X axis
	checkShootSpotX(enemyLoc, moveIn) {
		if (enemyLoc.y < this.currPos.y && currLevel[this.currPos.y-moveIn][enemyLoc.x] != "W") {
			return true;
		} else if (enemyLoc.y >= this.currPos.y && currLevel[this.currPos.y+moveIn][enemyLoc.x] != "W") {
			return true;
		}
		return false;
	}


	// Check if shooting spot is free when moving on Y axis
	checkShootSpotY(enemyLoc, moveIn) {
		if (enemyLoc.x < this.currPos.x && currLevel[enemyLoc.y][this.currPos.x-moveIn] != "W") {
			return true;
		} else if (enemyLoc.x >= this.currPos.x && currLevel[enemyLoc.y][this.currPos.x+moveIn] != "W") {
			return true;
		}
		return false;
	}


	shouldBotAttack() {

		// Can't attack during mid dodge
		if (!this.dodging) {

			// Chance to attack if enemy approaching the base trying to cap flag
			var defendBaseChance = 0.1;
			var defendRadius = 9;

			// Chance to attack if enemy is within a certain number of axes away
			var fewAxesAwayChance = 0.02;
			var numAxesAway = 3;

			// Chance to attack if bot has a flag
			var hasFlagChance = 0.005;

			// Enemy trying to capture flag.... DEFEND if in range
			if (this.enemyCloseToBase() && !playerArr[0].hasFlag && this.checkEnemyWithinRadius(defendRadius)) {
				if (Math.random() <= defendBaseChance) {
					return true;
				}


			// Enemy is a few axes away
			} else if (this.checkEnemyWithinAxes(numAxesAway)) {

				// Less chance to attack if bot has flag... just go cap
				if (this.hasFlag) {
					if (Math.random() <= hasFlagChance) {
				    	return true;
				    }

				// Otherwise just SHOOOT THEM
				} else if (Math.random() <= fewAxesAwayChance) {
					return true;
				}
			}
		}

		return false;
	}



	// Check if enemy within certain radius of bot
	checkEnemyWithinRadius(radius) {
		var enemyLoc = this.findEnemyLoc();
		if (Math.abs(enemyLoc.x-this.currPos.x) <= radius && Math.abs(enemyLoc.y-this.currPos.y) <= radius) {
			return true;
		}
		return false;
	}

	// Check if enemy is within a certain axes away
	checkEnemyWithinAxes(radius) {
		var enemyLoc = this.findEnemyLoc();
		if (Math.abs(enemyLoc.x-this.currPos.x) <= radius || Math.abs(enemyLoc.y-this.currPos.y) <= radius) {
			return true;
		}
		return false;
	}


	// Checks if the enemy is a certain radius around the bot's goal
	enemyCloseToBase() {
		var enemyLoc = this.findEnemyLoc();

		var radius = 5;
		if (Math.abs(enemyLoc.x-this.goal.x) <= radius && Math.abs(enemyLoc.y-this.goal.y) <= radius) {
			return true;
		}
		return false;
	}




	// Return a path thats a square away - dodges appropriately
	dodgeAway() {
		this.dodgeTimer = this.dodgeTime;

		var dodgePos = this.currPos;

		// Dodge in a random direction UNLESS at the edge of level or wall, then dodges away
		if (this.dodgeWay == DIR.up || this.dodgeWay == DIR.down) {
			if ((dodgePos.x == 0 || currLevel[dodgePos.y][dodgePos.x-1] == "W") &&
				(dodgePos.x == currLevel[0].length-1 || currLevel[dodgePos.y][dodgePos.x+1] == "W")) {
				dodgePos = this.alleySave;
				console.log("RUNNNNING TO ALLEYSAVE WOOOHOO");

			// Edge or wall LEFT of player
			} else if (dodgePos.x == 0 || currLevel[dodgePos.y][dodgePos.x-1] == "W") {

				// ONLY move right if the snowball is in the LEFTEST column
				if (this.targetSnowball.getXAnchor() <= (dodgePos.x*gridLen+gridLen)) {
					dodgePos.x += 1;
				}

			// Edge of wall RIGHT of player
			} else if (dodgePos.x == currLevel[0].length-1 || currLevel[dodgePos.y][dodgePos.x+1] == "W") {

				// ONLY move left if the snowball is in the RIGHTEST column
				if (this.targetSnowball.getXAnchor() + this.targetSnowball.width >= (dodgePos.x*gridLen)) {
					dodgePos.x -= 1;
				}

			// Nothing around, dodge anywhere
			} else {

				// Check if snowball would hit bot if bot was in the current dodgePos
				var killzone = false;
				var gapToEdge = (this.img.width/this.nCol-this.width)/2;
				if ((this.targetSnowball.getXAnchor()+this.targetSnowball.width) >= (dodgePos.x*gridLen+gapToEdge) &&
					(this.targetSnowball.getXAnchor() <= (dodgePos.x*gridLen+gridLen-gapToEdge))) {
					killzone = true;
				}

				// Only move if currPos is killzone
				if (killzone) {

					// Dodge right if more clearance 
					if ((this.targetSnowball.getXAnchor() + this.targetSnowball.width/2) <= (this.getXAnchor()+this.width/2)) {
						dodgePos.x += 1;
						console.log("RIGHT");

					// Dodge left if more clearance
					} else {
						dodgePos.x -= 1;
						console.log("LEFT");
					}

				// Dodge BACK to same spot because it is the safe spot
				} else {
					// Same dodgePos
				}



				console.log("targetsnowball x = " + this.targetSnowball.getXAnchor()+4 +   "   bot x = " + this.getXAnchor() + 10);	
			}
		}


		// Dodge in a random direction UNLESS at the edge of level or wall, then dodges away
		if (this.dodgeWay == DIR.left || this.dodgeWay == DIR.right) {
			if ((dodgePos.y == 0 || currLevel[dodgePos.y-1][dodgePos.x] == "W") &&
				(dodgePos.y == currLevel.length-1 || currLevel[dodgePos.y+1][dodgePos.x] == "W")) {
				dodgePos = this.alleySave;
				console.log("RUNNNNING TO ALLEYSAVE WOOOHOO");

			// Edge or wall ABOVE player
			} else if (dodgePos.y == 0 || currLevel[dodgePos.y-1][dodgePos.x] == "W") {

				// ONLY move down if the snowball is in the highest row
				if (this.targetSnowball.getYAnchor() <= (dodgePos.y*gridLen+gridLen)) {
					dodgePos.y += 1;
				}

			// Edge or wall BELOW player
			} else if (dodgePos.y == currLevel.length-1 || currLevel[dodgePos.y+1][dodgePos.x] == "W") {

				// ONLY move up if the snowball is in the lowest row
				if (this.targetSnowball.getYAnchor() + this.targetSnowball.height >= (dodgePos.y*gridLen)) {
					dodgePos.y -= 1;
				}

			// Nothing around, dodge anywhere
			} else {

				// Check if snowball would hit bot if bot was in the current dodgePos
				var killzone = false;
				var gapToEdge = (this.img.height/this.nRow-this.height)/2;
				if ((this.targetSnowball.getYAnchor()+this.targetSnowball.height) >= (dodgePos.y*gridLen+gapToEdge) &&
					(this.targetSnowball.getYAnchor() <= (dodgePos.y*gridLen+gridLen-gapToEdge))) {
					killzone = true;
				}

				// Only move if currPos is killzone
				if (killzone) {

					// Dodge down if more clearance
					if ((this.targetSnowball.getYAnchor()+ Math.floor(this.targetSnowball.height/2)) <= (this.getYAnchor()+Math.floor(this.height/2))) {
						dodgePos.y += 1;
						console.log("DOWN");

					// Dodge up if more clearance
					} else {
						dodgePos.y -= 1;
						console.log("UP");		
					}			

				// Dodge BACK to same spot because it is the safe spot
				} else {
					// Same dodgePos
				}

				console.log("targetsnowball y = " + this.targetSnowball.getYAnchor()+4 +   "   bot y = " + this.getYAnchor() + 10);
			}
		}

		console.log("dodging to ["+dodgePos.x+","+dodgePos.y+"]");

		var list = [];
		list.push(dodgePos);
		return list;
	}

	// Checks if any incoming snowballs are gonna hit the bot
	// This function tells the bot either to continue moving OR stop in order to dodge the bullet.
	checkDodge() {
		var maxDist = 100;
		var minDist = 40;
		var randDist = Math.floor((maxDist-minDist) * Math.random());

		// ONLY SNOWBALLS AT THE MOMENT
		for (var i = 0; i < tempArr.array[3].length; i++) {
			var snowball = tempArr.array[3][i];

			// Detecting enemy snowballs
			if (snowball instanceof Snowball && !this.checkedBalls.includes(snowball.id) && !snowball.dead && snowball.owner.playerID != this.playerID) {

				// Snowballs that are moving RIGHT towards the bot  - only 80 pixels within
				if (snowball.x < this.x && snowball.dir == DIR.right && this.x - snowball.x <= minDist+randDist) {
					var snowballPos = {
						x: snowball.x,
						y: snowball.y
					};
					var playerPos = {
						x: this.x,
						y: this.y
					};

					var ok = snowballPos.y;
					var omg = playerPos.y;
					


					var multiple = 10;
					while (snowballPos.x < playerPos.x) {
						snowballPos.x += snowball.speed * multiple;

						if (this.moving) {
							if (this.angle == DIR.left) {
								playerPos.x -= this.speed * multiple;
							} else if (this.angle == DIR.right) {
								playerPos.x += this.speed * multiple;
							} else if (this.angle == DIR.up) {
								playerPos.y -= this.speed * multiple;
							} else {
								playerPos.y += this.speed * multiple;
							}
						}

						var rect1 = snowball.getRectAt(snowballPos.x, snowballPos.y);
						var rect2 = this.getRectAt(playerPos.x, playerPos.y);
						//ctx.fillRect(rect1.x, rect1.y, snowball.width, snowball.height);
						//ctx.fillRect(rect2.x, rect2.y, this.width, this.height);

						if (testCollisionRectRect(rect1, rect2)) {
							console.log("IT PASSES THROUGH FUCKK  RIGHTT current task =" + this.task +    "dist looked at = " + minDist+"+"+randDist);


							console.log("snowball y = " + ok + "      player y = " + omg);

							console.log("snowball x = "+ snowball.x + "    player x ="+this.x);

							this.dodgeWaitTime = Math.floor((this.x-snowball.x)/snowball.speed + this.img.width/this.nCol/snowball.speed);
							this.targetSnowball = snowball;
							this.checkedBalls.push(snowball.id);

							// Special case where bot is inline with enemy shooting
							var rect1 = snowball.getRectAt(this.x, snowball.y);
							var rect2 = this.getRectAt(this.x, this.y);
							if (testCollisionRectRect(rect1, rect2)) {
								console.log("Directly INLINEEEEEE");
								this.dodgeMethod = DODGE.move;
								return DIR.right;
							}


							if (this.angle == DIR.up || this.angle == DIR.down) {
								this.dodgeMethod = DODGE.stop;
							} else {
								this.dodgeMethod = DODGE.move;
							}
							return DIR.right;
						}
					}
					
				} else if (snowball.x > this.x && snowball.dir == DIR.left && snowball.x - this.x <= minDist+randDist) {
					var snowballPos = {
						x: snowball.x,
						y: snowball.y
					};
					var playerPos = {
						x: this.x,
						y: this.y
					};

					// Check if snowball crosses over the player
					var multiple = 10;
					while (snowballPos.x > playerPos.x) {
						snowballPos.x -= snowball.speed * multiple;

						if (this.moving) {
							if (this.angle == DIR.left) {
								playerPos.x -= this.speed * multiple;
							} else if (this.angle == DIR.right) {
								playerPos.x += this.speed * multiple;
							} else if (this.angle == DIR.up) {
								playerPos.y -= this.speed * multiple;
							} else {
								playerPos.y += this.speed * multiple;
							}
						}

						var rect1 = snowball.getRectAt(snowballPos.x, snowballPos.y);
						var rect2 = this.getRectAt(playerPos.x, playerPos.y);
						//ctx.fillRect(rect1.x, rect1.y, snowball.width, snowball.height);
						//ctx.fillRect(rect2.x, rect2.y, this.width, this.height);

						if (testCollisionRectRect(rect1, rect2)) {
							console.log("IT PASSES THROUGH FUCKK  LEFTTT current task =" + this.task);

							this.dodgeWaitTime = Math.floor((snowball.x-this.x)/snowball.speed + this.img.width/this.nCol/snowball.speed);
							this.targetSnowball = snowball;
							this.checkedBalls.push(snowball.id);

							// Special case where bot is inline with enemy shooting
							var rect1 = snowball.getRectAt(this.x, snowball.y);
							var rect2 = this.getRectAt(this.x, this.y);
							if (testCollisionRectRect(rect1, rect2)) {
								console.log("Directly INLINEEEEEE");
								this.dodgeMethod = DODGE.move;
								return DIR.left;
							}

							if (this.angle == DIR.up || this.angle == DIR.down) {
								this.dodgeMethod = DODGE.stop;
							} else {
								this.dodgeMethod = DODGE.move;
							}
							return DIR.left;
						}
					}
				} else if (snowball.y < this.y && snowball.dir == DIR.down && this.y - snowball.y <= minDist+randDist) {
					var snowballPos = {
						x: snowball.x,
						y: snowball.y
					};
					var playerPos = {
						x: this.x,
						y: this.y
					};

					// Check if snowball crosses over the player
					var multiple = 10;
					while (snowballPos.y < playerPos.y) {
						snowballPos.y += snowball.speed * multiple;

						if (this.moving) {
							if (this.angle == DIR.left) {
								playerPos.x -= this.speed * multiple;
							} else if (this.angle == DIR.right) {
								playerPos.x += this.speed * multiple;
							} else if (this.angle == DIR.up) {
								playerPos.y -= this.speed * multiple;
							} else {
								playerPos.y += this.speed * multiple;
							}
						}

						var rect1 = snowball.getRectAt(snowballPos.x, snowballPos.y);
						var rect2 = this.getRectAt(playerPos.x, playerPos.y);
						//ctx.fillRect(rect1.x, rect1.y, snowball.width, snowball.height);
						//ctx.fillRect(rect2.x, rect2.y, this.width, this.height);

						if (testCollisionRectRect(rect1, rect2)) {
							console.log("IT PASSES THROUGH FUCKK  DOWNNN current task =" + this.task);
							this.dodgeWaitTime = Math.floor((this.y-snowball.y)/snowball.speed + this.img.height/this.nRow/snowball.speed);
							this.targetSnowball = snowball;
							this.checkedBalls.push(snowball.id);

							// Special case where bot is inline with enemy shooting
							var rect1 = snowball.getRectAt(snowball.x, this.y);
							var rect2 = this.getRectAt(this.x, this.y);
							if (testCollisionRectRect(rect1, rect2)) {
								console.log("Directly INLINEEEEEE");
								this.dodgeMethod = DODGE.move;
								return DIR.down;
							}

							if (this.angle == DIR.left || this.angle == DIR.right) {
								this.dodgeMethod = DODGE.stop;
							} else {
								this.dodgeMethod = DODGE.move;
							}
							return DIR.down;
						}
					}		

				} else if (snowball.y > this.y && snowball.dir == DIR.up && snowball.y - this.y <= minDist+randDist) {
					var snowballPos = {
						x: snowball.x,
						y: snowball.y
					};
					var playerPos = {
						x: this.x,
						y: this.y
					};


					// Check if snowball crosses over the player
					var multiple = 10;
					while (snowballPos.y > playerPos.y) {

						snowballPos.y -= snowball.speed * multiple;
						if (this.moving) {
							if (this.angle == DIR.left) {
								playerPos.x -= this.speed * multiple;
							} else if (this.angle == DIR.right) {
								playerPos.x += this.speed * multiple;
							} else if (this.angle == DIR.up) {
								playerPos.y -= this.speed * multiple;
							} else {
								playerPos.y += this.speed * multiple;
							}
						}

						var rect1 = snowball.getRectAt(snowballPos.x, snowballPos.y);
						var rect2 = this.getRectAt(playerPos.x, playerPos.y);
						//ctx.fillRect(rect1.x, rect1.y, snowball.width, snowball.height);
						//ctx.fillRect(rect2.x, rect2.y, this.width, this.height);

						if (testCollisionRectRect(rect1, rect2)) {
							console.log("IT PASSES THROUGH FUCKK   UPPP current task =" + this.task);
							this.dodgeWaitTime = Math.floor((snowball.y-this.y)/snowball.speed + this.img.height/this.nRow/snowball.speed);
							this.targetSnowball = snowball;
							this.checkedBalls.push(snowball.id);

							// Special case where bot is inline with enemy shooting
							var rect1 = snowball.getRectAt(snowball.x, this.y);
							var rect2 = this.getRectAt(this.x, this.y);
							if (testCollisionRectRect(rect1, rect2)) {
								console.log("Directly INLINEEEEEE");
								this.dodgeMethod = DODGE.move;
								return DIR.up;
							}

							if (this.angle == DIR.left || this.angle == DIR.right) {
								this.dodgeMethod = DODGE.stop;
							} else {
								this.dodgeMethod = DODGE.move;
							}
							return DIR.up;
						}
					}
				}
			}
		}
		return false;
	}

	// Find the grids that the enemy is currently in
	findEnemyLoc() {
		var enemy = playerArr[0];
		var rect1 = {
			x: enemy.getXAnchor(),
			y: enemy.getYAnchor(),
			width: enemy.width,
			height: enemy.height
		};

		// Check which grid enemy is in
		var list = [];
		for (var i = 0; i < currLevel.length; i++) {
			for (var j = 0; j < currLevel[i].length; j++) {
				var rect2 = {
					x: j*gridLen,
					y: i*gridLen,
					width: gridLen,
					height: gridLen
				};

				// Push the coordinates of the grid
				if (testCollisionRectRect(rect1, rect2)) {
					list.push({
						x: j,
						y: i
					});
				}
			}
		}

		// Get enemy's anchor position
		var enemy = {
			x: enemy.getXAnchor(),
			y: enemy.getYAnchor(),
			width: enemy.width,
			height: enemy.height
		};	

		var grid;
		if (list.length == 1) {
			grid = list[0];

		} else if (list.length == 2) {
			// Overlapping horizontal tiles
			if (list[0].y == list[1].y) {
				var box1Hor = (list[0].x+1)*gridLen-enemy.x;
				var box2Hor = enemy.width - box1Hor;

				if (box1Hor >= box2Hor) {
					grid = list[0];
				} else {
					grid = list[1];
				}

			// Overlapping vertical tiles
			} else {
				var box1Ver = (list[0].y+1)*gridLen-enemy.y;
				var box2Ver = enemy.height - box1Ver;

				if (box1Ver >= box2Ver) {
					grid = list[0];
				} else {
					grid = list[1];
				}
			}	
			
		} else {
			var box1Hor = (list[0].x+1)*gridLen-enemy.x;
			var box1Ver = (list[0].y+1)*gridLen-enemy.y;
			var box2Hor = enemy.width - box1Hor;
			var box2Ver = box1Ver;
			var box3Hor = box1Hor;
			var box3Ver = enemy.height - box1Ver;
			var box4Hor = box2Hor;
			var box4Ver = box3Ver;

			var b1 = box1Hor + box1Ver;
			var b2 = box2Hor + box2Ver;
			var b3 = box3Hor + box3Ver;
			var b4 = box4Hor + box4Ver; 

			if (b1 >= b2 && b1 >= b3 && b1 >= b4) {
				grid = list[0];
				//console.log("b1");
			} else if (b2 > b1 && b2 > b3 && b2 > b4) {
				grid = list[1];
				//console.log("b2");
			} else if (b3 > b1 && b3 > b2 && b3 > b4) {
				grid = list[2];
				//console.log("b2");
			} else {
				grid = list[3];
				//console.log("b2");
			}/*
			console.log(box1Hor);
			console.log(box1Ver);
			console.log(box2Hor);
			console.log(box2Ver);
			console.log(box3Hor);
			console.log(box3Ver);
			console.log(box4Hor);
			console.log(box4Ver);*/
		}

		return grid;
	}

	// Find the grids that the flag is currently in
	findFlagLoc() {

		// Find the flag object
		var flag;
		for (var i of tempArr.array) {
			for (var j of i) {
				if (j instanceof Flag) {
					if (j.owner.playerID == this.playerID) {
						flag = j;
					}
				}
			}
		}


		var list = [];
		for (var i = 0; i < currLevel.length; i++) {
			for (var j = 0; j < currLevel[i].length; j++) {

				// Check which grid the flag is in
				var rect1 = {
					x: flag.getXAnchor(),
					y: flag.getYAnchor(),
					width: flag.width,
					height: flag.height
				};
				var rect2 = {
					x: j*gridLen,
					y: i*gridLen,
					width: gridLen,
					height: gridLen
				};

				// Push the coordinates of the grid
				if (testCollisionRectRect(rect1, rect2)) {
					list.push({
						x: j,
						y: i
					});
				}
			}
		}
		return list;	
	}

	// Move from current x,y position to given position  - only if there is no wall
	moveToPos(pos) {

		// Moving left and right
		if (this.x < pos.x*gridLen) {
			if (!this.checkEdgeColAt(this.speed, 0) && !this.checkWallColAt(this.speed, 0)) {
				this.x += this.speed;
				this.setAngle(DIR.right);
			}
		} else if (this.x > pos.x*gridLen) {
			if (!this.checkEdgeColAt(-this.speed, 0) && !this.checkWallColAt(-this.speed, 0)) {
				this.x -= this.speed;
				this.setAngle(DIR.left);
			}
		}

		// Moving up and down
		if (this.y < pos.y*gridLen) {
			if (!this.checkEdgeColAt(0, this.speed) && !this.checkWallColAt(0, this.speed)) {
				this.y += this.speed;
				this.setAngle(DIR.down);
			}
		} else if (this.y > pos.y*gridLen) {
			if (!this.checkEdgeColAt(0, -this.speed) && !this.checkWallColAt(0, -this.speed)) {
				this.y -= this.speed;
				this.setAngle(DIR.up);
			}
		}			
	}


	// Find the grids that the bot is currently in
	// Can return multiple grids if standing on multiple
	findBotLoc() {
		var list = [];
		for (var i = 0; i < currLevel.length; i++) {
			for (var j = 0; j < currLevel[i].length; j++) {

				// Check which grid the bot is in
				var rect1 = {
					x: this.getXAnchor(),
					y: this.getYAnchor(),
					width: this.width,
					height: this.height
				};
				var rect2 = {
					x: j*gridLen,
					y: i*gridLen,
					width: gridLen,
					height: gridLen
				};

				// Push the coordinates of the grid
				if (testCollisionRectRect(rect1, rect2)) {
					list.push({
						x: j,
						y: i
					});
				}
			}
		}
		return list;
	}


}




// Array containing all the temp objects in the game with layers
class ObjectArrayLayered {
	constructor(layers) {
		this.array = [];
		this.numLayer = layers;

		this.hud = [];

		for (var i = 0; i < this.numLayer; i++) {
			this.array.push([]);
		}
	}

	// Update and draw all objects in certain layer
	updateLayer(layer) {
		for (var i = 0; i < this.array[layer].length; i++) {
			if (!this.array[layer][i].dead) {
				this.array[layer][i].update();
			}
		}
	}

	// Render all the details for the HUD
	renderHUD() {
		for (var i = 0; i < this.hud.length; i++) {
			var curr = this.hud[i];
			ctx.drawImage(curr.img, curr.x, curr.y);
		}
		this.hud = [];
	}

	// Push images to be rendered as HUD
	pushHUD(img, x, y) {
		this.hud.push({
			img: img,
			x: x,
			y: y
		})
	}

	// Add entity to layer in array
	add(entity) {

		var layer = this.determineLayer(entity);
		//console.log("put " + entity.constructor.name + " in layer " + layer);

		for (var i = 0; i < this.array[layer].length; i++) {
			if (this.array[layer][i].dead) {
				this.array[layer][i] = entity;
				return;
			}
		}
		this.array[layer].push(entity);
	}

	// Determines what layer this entity belongs in
	determineLayer(entity) {
		switch(entity.constructor.name) {

			//case "Snow":

			case "Goal":
				return 0;

			case "Crate":
				return 1;

			//case "Wall":

			case "Shell":
			case "MineBomb":
				return 2;

			//case "Player":

			case "Bullet":
			case "Missile":
			case "Pellet":
			case "LaserBlast":
			case "Snowball":
			case "Flag":
				return 3;

			case "Gun":
			case "RocketLauncher":
			case "Uzi":
			case "Shotgun":
			case "SnowGun":
			case "LaserGun":
			case "Mine":
				return 4;

			case "Smoke":
			case "Explosion":
			case "Confetti":
				return 5;
		}
	}

	// Return size of array at certain layer
	size(layer) {
		return this.array[layer].length;
	}
}


// Array containing all the objects in the game
class ObjectArray {
	constructor() {
		this.array = [];
	}

	// Update all entities
	update() {
		for (var i = 0; i < this.array.length; i++) {
			if (!this.array[i].dead) {
				this.array[i].update();
			}
		}
	}

	// Add entity to array
	add(entity) {
		for (var i = 0; i < this.array.length; i++) {
			if (this.array[i].dead) {
				this.array[i] = entity;
				return;
			}
		}
		this.array.push(entity);
	}

	// Return size of array 
	size() {
		return this.array.length;
	}
}


// Array containing the unlocked items
class UnlockArray {
	constructor() {
		this.array = [];
	}

	// Add item to the array
	add(name, desc, cost) {
		this.array.push({
			name: name,
			desc: desc,
			cost: cost
		});
	}
}