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
		this.drawAnimated(this.frameSeq); 
	}
 	drawAnimated(array) {
		this.finishAnim = false;
		this.animCurrFrame = array[this.animIndex];

		var xPos = (this.animCurrFrame % this.nRow) * this.img.width/this.nCol;
		var yPos = Math.floor(this.animCurrFrame / this.nCol) * this.img.height/this.nRow;

		ctx.drawImage(this.img, xPos, yPos, this.img.width/this.nCol, this.img.height/this.nRow, this.x, this.y,
					  this.img.width/this.nCol, this.img.height/this.nRow);

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
				alert("REKTT player " + i.playerID + "died...");
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

		this.leftKey;
		this.rightKey;
		this.upKey;
		this.downKey;
		this.shootKey;
	}
	update() {
		this.updateKeypress();
		this.shoot();
		this.updateMovement();
		this.draw();
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
		super.drawAnimated(this.frameSeq);
		if (this.facing == "left") {
			ctx.translate(this.x+gridLen, this.y);
			ctx.scale(-1, 1);
		} else if (this.facing == "right") {
			ctx.translate(this.x, this.y);
		} else if (this.facing == "up") {
			ctx.translate(this.x, this.y+gridLen);
			ctx.rotate(-90*Math.PI/180);
		} else if (this.facing == "down") {
			ctx.translate(this.x+gridLen, this.y);
			ctx.rotate(90*Math.PI/180);
		}

		ctx.drawImage(gun, 5, 5);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
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
			bulletArr.add(new Bullet(this.x, this.y, this.playerID, this.facing, 20, 20, snowball));
			this.shootTimer = this.shootTime;
		}

		if (this.shootTimer > 0) {
			this.shootTimer--;
		}

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