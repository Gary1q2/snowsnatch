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
		this.finishAnim = false;
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

		if (this.animDelay <= 4) {
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
		var x_anchor = this.x-this.centerX;
		var y_anchor = this.y-this.centerY;

		ctx.beginPath();

		if (this.angle == DIR.right || this.angle == DIR.left) {
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

		} else if (this.angle == DIR.up || this.angle == DIR.down) {
			x_anchor += this.img.width/this.nCol/2-this.height/2;
		    y_anchor += this.img.height/this.nRow/2-this.width/2;

			// Left vertical
			ctx.moveTo(x_anchor+0.5, y_anchor);
			ctx.lineTo(x_anchor+0.5, y_anchor+this.width);

			// Right vertical
			ctx.moveTo(x_anchor+this.height-0.5, y_anchor);
			ctx.lineTo(x_anchor+this.height-0.5, y_anchor+this.width);

			// Top horizontal
			ctx.moveTo(x_anchor, y_anchor+0.5);
			ctx.lineTo(x_anchor+this.height, y_anchor+0.5);

			// Bottom horizontal
			ctx.moveTo(x_anchor, y_anchor+this.width-0.5);
			ctx.lineTo(x_anchor+this.height, y_anchor+this.width-0.5);
		}

		ctx.stroke();
	}


	// Check collision with another object
	collideWith(other) {
		var rect1;
		if (this.angle == DIR.right || this.angle == DIR.left) {
			rect1 = {
				x: this.x-this.centerX+this.img.width/this.nCol/2-this.width/2,
				y: this.y-this.centerY+this.img.height/this.nRow/2-this.height/2,
				width: this.width,
				height: this.height
			};
		} else if (this.angle == DIR.up || this.angle == DIR.down) {
			rect1 = {
				x: this.x-this.centerX+this.img.width/this.nCol/2-this.height/2,
				y: this.y-this.centerX+this.img.height/this.nRow/2-this.width/2,
				width: this.height,
				height: this.width
			};
		}

		var rect2;
		if (other.angle == DIR.right || other.angle == DIR.left) {
			rect2 = {
				x: other.x+other.img.width/other.nCol/2-other.width/2,
				y: other.y+other.img.height/other.nRow/2-other.height/2,
				width: other.width,
				height: other.height
			};
		} else if (other.angle == DIR.up || other.angle == DIR.down) {
			rect2 = {
				x: other.x+other.img.width/other.nCol/2-other.height/2,
				y: other.y+other.img.height/other.nRow/2-other.width/2,
				width: other.height,
				height: other.width
			};
		}
		return testCollisionRectRect(rect1, rect2);
	}

	// Check collision with another object @ certain offset
	collideWithAt(other, xOff, yOff) {
		var rect1 = {
			x: this.x + xOff,
			y: this.y + yOff,
			width: this.width,
			height: this.height
		};
		var rect2 = {
			x: other.x,
			y: other.y,
			width: other.width,
			height: other.height
		};
		return testCollisionRectRect(rect1, rect2);
	}

	// Check collision with wall objects
	checkWallCol() {
		for (var i = 0; i < wallArr.length; i++) {
			if (this.collideWith(wallArr[i])) {
				return true;
			}
		}
		return false;
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
					snowbreak_snd.play();
				}
				break;
			}
		}
	}
}

class Crate extends Entity {
	constructor(x, y) {
		super(x, y, 20, 20, crate_img, 1, 2, [0], 0, 0);
		this.dead = false;

		this.broken = false;
		this.waitTimer = 0;
		this.waitTime = 60;
	}
	update() {
		this.checkGot();
		this.draw();

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
				this.drawAnimated([1]);
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
				crateOpen_snd.play();

				// Alternate guns
				while (true) {
					var rand = Math.random();
					if (rand < 0.5 && i.gun.gunID != 2) {
						i.gun = new LaserGun(i);
						break;
					} else if (rand >= 0.5 && i.gun.gunID != 3) {
						i.gun = new Shotgun(i);
						break;
		     		}
	     		}

	     		// Spawn crate in random empty spawn
	     		while (true) {
	     			var temp_y = Math.floor(Math.random()*numHeight);
	     			var temp_x = Math.floor(Math.random()*numWidth);
	     			if (game.level[temp_y][temp_x] != "W") {
	     				tempArr.add(new Crate(temp_x*gridLen, temp_y*gridLen));
	     				break;
	     			}
	     		}
				
				break;
			}
		}
	}
}

class Wall extends Entity {
	constructor(x, y) {
		super(x, y, 20, 20, wall, 1, 1, [0], 0,0);
	}

	update() {
		super.update();
	}
}


class Player extends Entity {
	constructor(x, y, playerID, startFace) {
		super(x, y, 20, 20, peng, 4, 3, [0], 0,0);

		this.speed = 1;

		this.shootTimer = 0;

		this.playerID = playerID;


		this.gun = new SnowGun(this);


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
	}
	update() {
		if (!this.dead && this.canMoveTimer <= 0) {
			this.updateKeypress();
			this.shoot();
			this.updateMovement();
		}
		this.draw();

		if (!this.dead) {
			this.gun.update();
		}

		this.canMoveTimer--;
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
				this.drawAnimated([0, 9]);

			// Idle animation
			} else {
				this.animIndex = 0;
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
		this.drawCol();
	}

	// Update movement based on key presses
	updateMovement() {
		if (this.leftKey) {
			if (this.x > 0 && !this.checkWallColAt(-this.speed, 0)) {
				this.x -= this.speed;
			}
		}
		if (this.rightKey) {
			if (this.x < numWidth*gridLen-gridLen && !this.checkWallColAt(this.speed, 0)) {
				this.x += this.speed;
			}
		}
		if (this.upKey) {
			if (this.y > 0 && !this.checkWallColAt(0, -this.speed)) {
				this.y -= this.speed;
			}	
		}
			
		if (this.downKey) {
			if (this.y < numHeight*gridLen-gridLen && !this.checkWallColAt(0, this.speed)) {
				this.y += this.speed;
			}	
		}
			
	}

	shoot() {
		if (this.shootKey && this.shootTimer == 0) {
			this.gun.shoot();
			this.shootTimer = this.gun.shootTime;
		}

		if (this.shootTimer > 0) {
			this.shootTimer--;
		}
	}

	// Get the player to die
	die(bulletDir) {
		this.dead = true;
		this.dying = true;

		this.setAngle(DIR.right);
		// Set direction for player to die
		/*if (bulletDir == DIR.left) {
			this.setAngle(DIR.right);
		} else if (bulletDir == DIR.right) {
			this.setAngle(DIR.left);
		} else if (bulletDir == DIR.up) {
			this.setAngle(DIR.down);
		} else if (bulletDir == DIR.down) {
			this.setAngle(DIR.up);
		}*/
		

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
		this.changeSprite(playerDie_img, 60, 60, 3, 3, [0], 20, 20);

		die_snd.play();
		die2_snd.play();
	}

	// Check collision with wall objects at offset
	checkWallColAt(xOff, yOff) {
		for (var i = 0; i < wallArr.length; i++) {
			if (this.collideWithAt(wallArr[i], xOff, yOff)) {
				return true;
			}
		}
		return false;
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
}