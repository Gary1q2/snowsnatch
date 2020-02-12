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

	// Draw collision box for sprite
	drawCol() {
		var x_anchor = this.x-this.centerX+this.colShiftX;
		var y_anchor = this.y-this.centerY+this.colShiftY;

		ctx.beginPath();

		x_anchor += this.img.width/this.nCol/2-this.width/2;
	    y_anchor += this.img.height/this.nRow/2-this.height/2;

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


class Player extends Entity {
	constructor(x, y, playerID, startFace) {
		var pengColor;
		//if (playerID == 1) {
			pengColor = peng;
		//} else {
		//	pengColor = peng2;
		//}

		super(x, y, 14, 14, pengColor, 1, 3, [0,1], 0,0);

		this.speed = 1;

		this.shootTimer = 0;

		this.playerID = playerID;


		this.gun = new SnowGun(this);

		this.startFace = startFace
		this.angle = this.startFace;

		this.dead = false;
		this.dying = false;

		this.leftKey;
		this.rightKey;
		this.upKey;
		this.downKey;
		this.shootKey;

		this.moving = false; // If player is moving or not

		this.strafeDir = DIR.none; // Direction keep facing when strafing
		this.firstKeyPress = DIR.none;  // Key first pressed for strafing
		

		this.canMoveTimer = 100;

		this.initX = x;   // Remember initial spawn location
		this.initY = y;

		this.respawnTimer = 0;
		this.respawnTime = 100;

		this.score = 0;

		this.hasFlag = false;
	}
	update() {
		if (!this.dead && this.canMoveTimer <= 0) {
			this.updateKeypress();
			if (this.shootKey) {
				this.shoot();
			}
			this.updateMovement();
		}

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

				// Prepare for new animation
				this.animIndex = 0;
				this.animDelay = 0;
				this.animDelayTime = 6;
			}
		} else {
			this.moving = false;
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

	draw() {
		// Alive sprite
		if (!this.dead) {

			// Walking animation
			if (this.moving) {
				this.drawAnimated([0, 2]);

			// Idle animation
			} else {
				this.animDelayTime = 20;
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



		// Reset the pathing array if bot dies + reset its current position
		if (this instanceof(Bot)) {
			this.path = [];
			this.currPos = this.startPos;
			console.log("i died and im a bot -> my path array reset");
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

		this.setAngle(this.startFace);
		this.changeSprite(temp, 14, 14, 1, 3, [0, 1], 0,0);
	}
}

class Bot extends Player {
	constructor(x, y, playerID, startFace, level) {
		super(x, y, playerID, startFace);
		console.log("I am a bot... i will destroy you...");

		// Store the level layout
		this.level = level;


		// This isn't updated... so won't update when walls are destroyed
		this.astar = new Astar(level);

		this.task = TASK.getFlag;

		this.path = [];

		// Current position of bot
		this.currPos = {
			x: x/gridLen,
			y: y/gridLen
		};

		// Remember the starting coordinates
		this.startPos = this.currPos;

		// Find the coordinates for the bot's goal
		this.goal;
		for (var i = 0; i < level.length; i++) {
			for (var j = 0; j < level[i].length; j++) {
				if (level[i][j] == "T") {
					this.goal = {
						x: j,
						y: i
					};
				}
			}
		}
	}

	update() {
		super.update();

		// Stop moving when gameover
		if (!game.gameover) {

			// Only move if allowed
			if (!this.dead && this.canMoveTimer <= 0) {


				// Decide what task the bot needs to do
				if (!this.hasFlag) {
					this.task = TASK.getFlag;
				} else {
					this.task = TASK.goHome;
				}


				// Generate path to get the flag
				if (this.task == TASK.getFlag && this.path.length == 0) {
					this.path = this.astar.search(this.currPos, {
						x: 2,
						y: 2
					});


				// Generate path to go home
				} else if (this.task == TASK.goHome && this.path.length == 0) {
					this.path = this.astar.search(this.currPos, this.goal);
				}

				// Move the bot because it has somewhere to go
				if (this.path.length != 0) {

					// Not yet reached the 1st designated grid
					if (this.x != this.path[0].x*gridLen || this.y != this.path[0].y*gridLen) {
						this.moveToPos(this.path[0]);

					// Reached spot, pop off
					} else {
						//console.log("Popped path ["+this.path[0].x+","+this.path[0].y+"]");
						this.currPos = this.path[0];
						this.path.shift();
					}
				}


				// Shooting automatically
				//if (this.shootTimer == 0) { 
					//this.shoot();
				//	var omg = this.findBotLoc();
				//	var string = "";
				//	for (var i = 0; i < omg.length; i++) {
				//		string += "["+omg[i].x+","+omg[i].y+"]";
				//	}
					//console.log(string);
				//}
			}
		}
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
		for (var i = 0; i < this.level.length; i++) {
			for (var j = 0; j < this.level[i].length; j++) {

				// Check which grid the flag is in
				var rect1 = {
					x: flag.x-flag.centerX+flag.colShiftX+flag.img.width/flag.nCol/2-flag.width/2,
					y: flag.y-flag.centerY+flag.colShiftY+flag.img.height/flag.nRow/2-flag.height/2,
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

	// Move from current x,y position to given position
	moveToPos(pos) {

		// Moving left and right
		if (this.x < pos.x*gridLen) {
			this.x += this.speed;
		} else if (this.x > pos.x*gridLen) {
			this.x -= this.speed;
		}

		// Moving up and down
		if (this.y < pos.y*gridLen) {
			this.y += this.speed;
		} else if (this.y > pos.y*gridLen) {
			this.y -= this.speed;
		}
	}


	// Find the grids that the bot is currently in
	// Can return multiple grids if standing on multiple
	findBotLoc() {
		var list = [];
		for (var i = 0; i < this.level.length; i++) {
			for (var j = 0; j < this.level[i].length; j++) {

				// Check which grid the bot is in
				var rect1 = {
					x: this.x-this.centerX+this.colShiftX+this.img.width/this.nCol/2-this.width/2,
					y: this.y-this.centerY+this.colShiftY+this.img.height/this.nRow/2-this.height/2,
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
			//	return 0;

			case "Goal":
				return 0;

			case "Crate":
				return 1;

			//case "Wall":
			//	return 3;

			//	return 4;

			case "Shell":
			case "Flag":
			case "MineBomb":
				return 2;

			//case "Player":
			//	return 6;


			case "Bullet":
			case "Missile":
			case "Pellet":
			case "LaserBlast":
			case "Snowball":
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