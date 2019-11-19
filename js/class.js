class Entity {
	constructor(x, y, width, height, img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
	}
	draw() {
		ctx.drawImage(this.img,this.x*gridLen,this.y*gridLen);
	}
	update() {
		this.draw();
	}
}


class Bullet extends Entity{
	constructor(x, y, dir, width, height, img) {
		super(x, y, width, height, img);

		this.dir = dir;
		this.dead = false;

		this.moveTime = 5;
		this.moveTimer = 0;
	}
	update() {


		this.updateMovement();
		this.checkDead();
		super.update();
	}

	updateMovement() {
		if (this.moveTimer == 0) {
			if (this.dir == "left") {
				this.x--;
				this.moveTimer = this.moveTime;
			} else if (this.dir == "right") {
				this.x++;
				this.moveTimer = this.moveTime;
			} else if (this.dir == "up") {
				this.y--;
				this.moveTimer = this.moveTime;
			} else if (this.dir == "down") {
				this.y++;
				this.moveTimer = this.moveTime;
			}
		}

		if (this.moveTimer > 0) {
			this.moveTimer--;
		}
	}

	// Check if out of bounds or not
	checkDead() {
		if (this.x < 0 || this.x > numWidth-1 ||
		      this.y < 0 || this.y > numHeight-1) {
			this.dead = true;
		}
	}
}

class Player extends Entity {
	constructor(x, y, width, height, img) {
		super(x, y, width, height, img);

		this.facing = "right";

		// Key presses
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;

		this.shootTime = 20;
		this.shootTimer = 0;
	}
	update() {
		this.shoot();
		this.updateMovement();
		this.draw();
	}

	draw() {
		super.draw();

		if (this.facing == "left") {
			ctx.translate(this.x*gridLen+gridLen, this.y*gridLen);
			ctx.scale(-1, 1);
		} else if (this.facing == "right") {
			ctx.translate(this.x*gridLen, this.y*gridLen);
		} else if (this.facing == "up") {
			ctx.translate(this.x*gridLen, this.y*gridLen+gridLen);
			ctx.rotate(-90*Math.PI/180);
		} else if (this.facing == "down") {
			ctx.translate(this.x*gridLen+gridLen, this.y*gridLen);
			ctx.rotate(90*Math.PI/180);
		}

		ctx.drawImage(gun, this.x, this.y);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	// Update movement based on key presses
	updateMovement() {
		if (!this.moveLeft && Keys.left && this.x > 0) {
			this.x--;
			this.facing = "left";
		}
		if (!this.moveRight && Keys.right && this.x < numWidth-1) {
			this.x++;
			this.facing = "right";
		}
		if (!this.moveUp && Keys.up && this.y > 0) {
			this.y--;
			this.facing = "up";
		}
		if (!this.moveDown && Keys.down && this.y < numHeight-1) {
			this.y++;
			this.facing = "down";
		}

		this.moveLeft = Keys.left;
		this.moveRight = Keys.right;
		this.moveUp = Keys.up;
		this.moveDown = Keys.down;
	}

	shoot() {
		if (Keys.space && this.shootTimer == 0) {
			console.log("created a bullet");
			bulletArr.add(new Bullet(this.x, this.y, this.facing, 20, 20, snowball));
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