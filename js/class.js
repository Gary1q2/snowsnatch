class Entity {
	constructor(x, y, width, height, img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
	}
	draw() {
		ctx.drawImage(this.img,this.x,this.y);
	}
	update() {
		this.draw();
	}

	// Check collision with another object
	collideWith(other) {
		var rect1 = {
			x: this.x - this.width/2,
			y: this.y - this.height/2,
			width: this.width,
			height: this.height
		};
		var rect2 = {
			x: other.x - other.width/2,
			y: other.y - other.height/2,
			width: other.width,
			height: other.height
		};
		return testCollisionRectRect(rect1, rect2);
	}
}

class AnimEntity extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq) {
		super(x, y, width, height, img);

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

		var xPos = (this.animCurrFrame % this.nRow) * this.img.width/this.nCol;
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
}

class Gun extends AnimEntity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);

		this.shooting = false;
		this.player = player;
	}

	update() {
		this.updateMovement();
		this.draw();
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
	constructor(x, y, owner, dir, width, height, img) {
		super(x, y, width, height, img);
		this.speed = 2;
		this.dir = dir;
		this.dead = false;
		this.owner = owner;
	}

	update() {
		this.updateMovement();
		this.checkHit();
		this.checkDead();

		if (!this.dead) {
			super.update();
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
				this.dead = true;
				console.log("REKTT player " + i.playerID + "died...");
				i.die();
			}
		}
	}

	// Check if out of bounds or not
	checkDead() {
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen) {
			this.dead = true;
		}
	}
}

class Player extends AnimEntity {
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
	}

	draw() {
		if (!this.dead) {
			if (this.facing == "left") {
				this.drawAnimated(this.frameSeq, 180);
			} else if (this.facing == "right") {
				this.drawAnimated(this.frameSeq, 0);
			} else if (this.facing == "up") {
				this.drawAnimated(this.frameSeq, 90);
			} else if (this.facing == "down") {
				this.drawAnimated(this.frameSeq, 270);
			}
		} else {
			this.drawAnimated([2], 0);
		}
	}

	// Update movement based on key presses
	updateMovement() {
		if (this.leftKey && this.x > 0) {
			this.x -= this.speed;
			this.facing = "left";
		}
		if (this.rightKey && this.x < numWidth*gridLen-gridLen) {
			this.x += this.speed;
			this.facing = "right";
		}
		if (this.upKey && this.y > 0) {
			this.y -= this.speed;
			this.facing = "up";
		}
		if (this.downKey && this.y < numHeight*gridLen-gridLen) {
			this.y += this.speed;
			this.facing = "down";
		}
	}

	shoot() {
		if (this.shootKey && this.shootTimer == 0) {
			console.log("created a bullet");
			this.gun.shoot();
			bulletArr.add(new Bullet(this.x, this.y, this.playerID, this.facing, 7, 7, snowball));
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