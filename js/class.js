class Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;

		this.nRow = nRow;
		this.nCol = nCol;
		this.frameSeq = frameSeq;

		this.animIndex = 0;
		this.animCurrFrame = 0;
		this.animDelay = 0;
		this.finishAnim = false;
	}
	update() {
		this.drawAnimated(this.frameSeq, 0); 
	}

 	drawAnimated(array, angle) {
		this.finishAnim = false;
		this.animCurrFrame = array[this.animIndex];

		var xPos = (this.animCurrFrame % this.nCol) * this.img.width/this.nCol;
		var yPos = Math.floor(this.animCurrFrame / this.nCol) * this.img.height/this.nRow;
	
		// Draw animation depending on angle
		if (angle == 0) {
			ctx.translate(this.x, this.y);
		} else if (angle == 90) {
			ctx.translate(this.x, this.y);
			ctx.rotate(-90*Math.PI/180);
			ctx.translate(-this.img.width/this.nCol, 0);
		} else if (angle == 180) {
			ctx.translate(this.x+this.img.width/this.nCol, this.y);
			ctx.scale(-1, 1);
		} else if (angle == 270) {
			ctx.translate(this.x, this.y);
			ctx.rotate(90*Math.PI/180);
			ctx.translate(0, -this.img.width/this.nCol);		
		}
		ctx.drawImage(this.img, xPos, yPos, this.img.width/this.nCol, this.img.height/this.nRow, 0, 0,
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
		var x_anchor = this.x+this.img.width/this.nCol/2-this.width/2;
		var y_anchor = this.y+this.img.height/this.nRow/2-this.height/2;

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
			x: this.x+this.img.width/this.nCol/2-this.width/2,
			y: this.y+this.img.height/this.nRow/2-this.height/2,
			width: this.width,
			height: this.height
		};
		var rect2 = {
			x: other.x+other.img.width/other.nCol/2-other.width/2,
			y: other.y+other.img.height/other.nRow/2-other.height/2,
			width: other.width,
			height: other.height
		};
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
}


class Wall extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);
	}

	update() {
		super.update();
		//this.drawCol();
	}
}

class Gun extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);

		this.shooting = false;
		this.player = player;
	}

	update() {
		this.updateMovement();
		this.draw();
		this.drawCol();
	}

	draw() {

		// Shooting animation in 4 directions
		if (this.shooting) {
			if (this.player.facing == "left") {
				this.drawAnimated([2, 1], 180);
			} else if (this.player.facing == "right") {
				this.drawAnimated([2, 1], 0);
			} else if (this.player.facing == "up") {
				this.drawAnimated([2, 1], 90);
			} else if (this.player.facing == "down") {
				this.drawAnimated([2, 1], 270);
			}	
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			if (this.player.facing == "left") {
				this.drawAnimated(this.frameSeq, 180);
			} else if (this.player.facing == "right") {
				this.drawAnimated(this.frameSeq, 0);
			} else if (this.player.facing == "up") {
				this.drawAnimated(this.frameSeq, 90);
			} else if (this.player.facing == "down") {
				this.drawAnimated(this.frameSeq, 270);
			}			
		}	
	}

	// Stick with the player
	updateMovement() {
		this.x = this.player.x;
		this.y = this.player.y;
	}
	// Display shooting animation
	shoot() {
		this.shooting = true;

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}
class Bullet extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);
		this.speed = 2;
		this.dir = dir;
		this.dead = false;
		this.owner = owner;

		this.breaking = false;   // Showing breaking animation
	}

	update() {
		if (!this.breaking) {
			this.updateMovement();
			this.checkHit();
			this.checkDead();
		}
		if (!this.dead) {
			this.draw();
		}
	}

	// Draw idle or breaking animation
	draw() {
		if (this.breaking) {
			console.log("breaking... frame" + this.animIndex);
			var seq = [1, 2, 3, 4];
			if (this.dir == "left") {
				this.drawAnimated(seq, 90)
			} else if (this.dir == "right") {
				this.drawAnimated(seq, 270)
			} else if (this.dir == "up") {
				this.drawAnimated(seq, 180)
			} else if (this.dir == "down") {
				this.drawAnimated(seq, 0)
			}
			if (this.finishAnim) {
				console.log("finished");
				this.dead = true;
			}
		} else {
			console.log("not broken");
			this.drawAnimated(this.frameSeq, 0);
		}
	}
	updateMovement() {
		if (this.dir == "left") {
			this.x -= this.speed;
			this.moveTimer = this.moveTime;
		} else if (this.dir == "right") {
			this.x += this.speed;
			this.moveTimer = this.moveTime;
		} else if (this.dir == "up") {
			this.y -= this.speed;
			this.moveTimer = this.moveTime;
		} else if (this.dir == "down") {
			this.y += this.speed;
			this.moveTimer = this.moveTime;
		}	
	}

	// Check if hitting anyone
	checkHit() {
		for (var i of playerArr) {
			if (this.owner != i.playerID && this.collideWith(i)) {
				console.log("REKTT player " + i.playerID + "died...");
				this.break();
				i.die();
			}
		}
	}

	// Check if out of bounds or hit some terrain
	checkDead() {
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen ||
		        this.checkWallCol()) {
			this.break();
		}
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

	// Snowball break apart after hitting object
	break() {
		console.log("BROKE");
		this.breaking = true;
		snowbreak_snd.play();

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}

}

class Player extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, playerID, startFace) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);

		this.speed = 1;
		this.facing = startFace;

		this.shootTime = 20;
		this.shootTimer = 0;

		this.playerID = playerID;

		this.gun = new Gun(0, 100, 20, 20, gunImg, 2, 2, [0], this);

		this.dead = false;

		this.leftKey;
		this.rightKey;
		this.upKey;
		this.downKey;
		this.shootKey;

		this.moving = false; // If player is moving or not
	}
	update() {
		if (!this.dead) {
			this.updateKeypress();
			this.shoot();
			this.updateMovement();
		}
		this.draw();

		if (!this.dead) {
			this.gun.update();
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
			}
		} else {
			this.moving = false;
		}
	}

	draw() {
		// Alive sprite
		if (!this.dead) {

			// Walking animation
			if (this.moving) {
				if (this.facing == "left") {
					this.drawAnimated([0, 1], 180);
				} else if (this.facing == "right") {
					this.drawAnimated([0, 1], 0);
				} else if (this.facing == "up") {
					this.drawAnimated([0, 1], 90);
				} else if (this.facing == "down") {
					this.drawAnimated([0, 1], 270);
				}

			// Idle animation
			} else {
				this.animIndex = 0;
				if (this.facing == "left") {
					this.drawAnimated(this.frameSeq, 180);
				} else if (this.facing == "right") {
					this.drawAnimated(this.frameSeq, 0);
				} else if (this.facing == "up") {
					this.drawAnimated(this.frameSeq, 90);
				} else if (this.facing == "down") {
					this.drawAnimated(this.frameSeq, 270);
				}
			}

		// Dead sprite
		} else {
			this.drawAnimated([2], 0);
		}
		this.drawCol();
	}

	// Update movement based on key presses
	updateMovement() {
		if (this.leftKey) {
			if (this.x > 0 && !this.checkWallColAt(-this.speed, 0)) {
				this.x -= this.speed;
			}
			this.facing = "left";
		}
		if (this.rightKey) {
			if (this.x < numWidth*gridLen-gridLen && !this.checkWallColAt(this.speed, 0)) {
				this.x += this.speed;
			}
			this.facing = "right";		
		}
		if (this.upKey) {
			if (this.y > 0 && !this.checkWallColAt(0, -this.speed)) {
				this.y -= this.speed;
			}
			this.facing = "up";		
		}
		if (this.downKey) {
			if (this.y < numHeight*gridLen-gridLen && !this.checkWallColAt(0, this.speed)) {
				this.y += this.speed;
			}
			this.facing = "down";		
		}
	}

	shoot() {
		if (this.shootKey && this.shootTimer == 0) {
			console.log("created a bullet");
			this.gun.shoot();
			bulletArr.add(new Bullet(this.x, this.y, 8, 8, snowball, 3, 2, [0], this.playerID, this.facing));
			this.shootTimer = this.shootTime;
			shoot_snd.play();
		}

		if (this.shootTimer > 0) {
			this.shootTimer--;
		}
	}

	// Get the player to die
	die() {
		this.dead = true;
		die_snd.play();
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

	// Check collision with wall objects at offset
	checkWallColAt(xOff, yOff) {
		for (var i = 0; i < wallArr.length; i++) {
			if (this.collideWithAt(wallArr[i], xOff, yOff)) {
				return true;
			}
		}
		return false;
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