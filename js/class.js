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

		this.angle = "right"; // 0 = right, 90 = up, 180 = left, 270 = down

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
		if (this.angle == "right") {
			ctx.translate(this.x, this.y);
		} else if (this.angle == "up") {
			ctx.translate(this.x, this.y);
			ctx.rotate(-90*Math.PI/180);
			ctx.translate(-this.img.width/this.nCol, 0);
		} else if (this.angle == "left") {
			ctx.translate(this.x+this.img.width/this.nCol, this.y);
			ctx.scale(-1, 1);
		} else if (this.angle == "down") {
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
		var x_anchor;
		var y_anchor;

		ctx.beginPath();

		if (this.angle == "right" || this.angle == "left") {
			x_anchor = this.x+this.img.width/this.nCol/2-this.width/2;
		    y_anchor = this.y+this.img.height/this.nRow/2-this.height/2;

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

		} else if (this.angle == "up" || this.angle == "down") {
			x_anchor = this.x+this.img.width/this.nCol/2-this.height/2;
		    y_anchor = this.y+this.img.height/this.nRow/2-this.width/2;

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
		if (this.angle == "right" || this.angle == "left") {
			rect1 = {
				x: this.x+this.img.width/this.nCol/2-this.width/2,
				y: this.y+this.img.height/this.nRow/2-this.height/2,
				width: this.width,
				height: this.height
			};
		} else if (this.angle == "up" || this.angle == "down") {
			rect1 = {
				x: this.x+this.img.width/this.nCol/2-this.height/2,
				y: this.y+this.img.height/this.nRow/2-this.width/2,
				width: this.height,
				height: this.width
			};
		}

		var rect2;
		if (other.angle == "right" || other.angle == "left") {
			rect2 = {
				x: other.x+other.img.width/other.nCol/2-other.width/2,
				y: other.y+other.img.height/other.nRow/2-other.height/2,
				width: other.width,
				height: other.height
			};
		} else if (other.angle == "up" || other.angle == "down") {
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

	setAngle(angle) {
		this.angle = angle;
	}
}

class Crate extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);

		this.dead = false;
	}
	update() {
		super.update();
		this.checkGot();
	}
	// Check if player got it
	checkGot() {
		for (var i of playerArr) {
			if (this.collideWith(i)) {
				console.log("player " + i.playerID + " got a crate");
				this.dead = true;
				tempArr.add(new Crate(Math.floor(Math.random()*8)*gridLen,8*gridLen, 20, 20, crate_img, 1, 1, [0]));
			}
		}
	}
}

class Wall extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);
	}

	update() {
		super.update();
		this.drawCol();
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
				this.setAngle("left");
				this.drawAnimated([2, 1]);
			} else if (this.player.facing == "right") {
				this.setAngle("right");
				this.drawAnimated([2, 1]);
			} else if (this.player.facing == "up") {
				this.setAngle("up");
				this.drawAnimated([2, 1]);
			} else if (this.player.facing == "down") {
				this.setAngle("down");
				this.drawAnimated([2, 1]);
			}	
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			if (this.player.facing == "left") {
				this.setAngle("left");
				this.drawAnimated(this.frameSeq);
			} else if (this.player.facing == "right") {
				this.setAngle("right");
				this.drawAnimated(this.frameSeq);
			} else if (this.player.facing == "up") {
				this.setAngle("up");
				this.drawAnimated(this.frameSeq);
			} else if (this.player.facing == "down") {
				this.setAngle("down");
				this.drawAnimated(this.frameSeq);
			}			
		}	
	}

	// Stick with the player
	updateMovement() {
		this.x = this.player.x;
		this.y = this.player.y;
	}
}

class SnowGun extends Gun {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, player);
	}

	update() {
		super.update();
	}	

	// Shoot the gun (create bullet + recoil)
	shoot() {
		this.shooting = true;
		tempArr.add(new Snowball(this.x, this.y, 8, 8, snowball, 3, 2, [0], this.player.playerID, this.player.facing));

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}
	 
class LaserGun extends Gun {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, player);

		this.chargeTime = 60;
		this.chargeTimer = 0;
	}

	update() {
		this.updateMovement();
		this.draw();
		this.chargeGun();
	}

	// Charging down the gun
	chargeGun() {
		if (this.chargeTimer > 0) {
			this.chargeTimer--;
			if (this.chargeTimer == 0) {
				this.shooting = true;

				console.log("SHOT LASERRR");
				if (this.player.facing == "left") {
					for (var i = this.x-this.player.width/2; i > -20; i-=20) {
						tempArr.add(new LaserBlast(i, this.y, 20, 8, laserBeam_img, 2, 3, [0,1,2], this.player.playerID, this.player.facing));
					}
				} else if (this.player.facing == "right") {
					for (var i = this.x+this.player.width/2; i < canvas.width; i+=20) {
						tempArr.add(new LaserBlast(i, this.y, 20, 8, laserBeam_img, 2, 3, [0,1,2], this.player.playerID, this.player.facing));
					}
				} else if (this.player.facing == "up") {
					for (var i = this.y-this.player.height/2; i > -20; i-=20) {
						tempArr.add(new LaserBlast(this.x, i, 20, 8, laserBeam_img, 2, 3, [0,1,2], this.player.playerID, this.player.facing));
					}
				} else if (this.player.facing == "down") {
					for (var i = this.y+this.player.height/2; i < canvas.height; i+=20) {
						tempArr.add(new LaserBlast(this.x, i, 20, 8, laserBeam_img, 2, 3, [0,1,2], this.player.playerID, this.player.facing));
					}
				}

				// Prepare for new animation
				this.animIndex = 0;
				this.animDelay = 0;
			}
		}
	}

	draw() {

		// Shooting animation in 4 directions
		if (this.shooting) {
			if (this.player.facing == "left") {
				this.setAngle("left");
				this.drawAnimated([2, 1]);
			} else if (this.player.facing == "right") {
				this.setAngle("right");
				this.drawAnimated([2, 1]);
			} else if (this.player.facing == "up") {
				this.setAngle("up");
				this.drawAnimated([2, 1]);
			} else if (this.player.facing == "down") {
				this.setAngle("down");
				this.drawAnimated([2, 1]);
			}	
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			if (this.player.facing == "left") {
				this.setAngle("left");
				this.drawAnimated(this.frameSeq);
			} else if (this.player.facing == "right") {
				this.setAngle("right");
				this.drawAnimated(this.frameSeq);
			} else if (this.player.facing == "up") {
				this.setAngle("up");
				this.drawAnimated(this.frameSeq);
			} else if (this.player.facing == "down") {
				this.setAngle("down");
				this.drawAnimated(this.frameSeq);
			}			
		}	

		// Charging animation
		if (this.chargeTimer > 0) {
			ctx.fillStyle = "red";
			ctx.globalAlpha = 0.3;
			var beamWidth = 4;
			var beamDist = 400;

			if (this.player.facing == "left") {
				ctx.fillRect(this.player.x+this.player.width/2, this.player.y+this.player.height/2-beamWidth/2, -beamDist, beamWidth);
			} else if (this.player.facing == "right") {
				ctx.fillRect(this.player.x+this.player.width/2, this.player.y+this.player.height/2-beamWidth/2, beamDist, beamWidth);
			} else if (this.player.facing == "up") {
				ctx.fillRect(this.player.x+this.player.width/2-beamWidth/2, this.player.y+this.player.height/2, beamWidth, -beamDist);
			} else if (this.player.facing == "down") {
				ctx.fillRect(this.player.x+this.player.width/2-beamWidth/2, this.player.y+this.player.height/2, beamWidth, beamDist);
			}

			ctx.fillStyle = "black";
			ctx.globalAlpha = 1;
		}
	}

	// Charge the gun + shoot it
	shoot() {
		if (this.chargeTimer == 0) {
			this.chargeTimer = this.chargeTime;
		}
	}
}

class Bullet extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq);
		this.dir = dir;
		this.owner = owner;
	}
}

class LaserBlast extends Bullet {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, owner, dir);

		this.aliveTimer = 30;  // How long to stay alive for
		this.hurtTimer = 10; // How long can deal damage

		this.dead = false;

		this.angle = dir;
	}

	update() {
		this.tickTimer();
		this.checkHit();
		this.draw();
		this.drawCol();
	}

	// Count down until the beam disappears
	tickTimer() {
		if (this.aliveTimer > 0) {
			this.aliveTimer--;
			if (this.aliveTimer == 0) {
				this.dead = true;
			}
		} 
		if (this.hurtTimer > 0) {
			this.hurtTimer--;
		}
	}
	// Draw the laser beam
	draw() {
		if (!this.dead) {
			if (this.hurtTimer > 0) {
				if (this.dir == "left") {
					this.setAngle("left");
					this.drawAnimated(this.frameSeq);
				} else if (this.dir == "right") {
					this.setAngle("right");
					this.drawAnimated(this.frameSeq);
				} else if (this.dir == "up") {
					this.setAngle("up");
					this.drawAnimated(this.frameSeq);
				} else if (this.dir == "down") {
					this.setAngle("down");
					this.drawAnimated(this.frameSeq);
				}
			} else {
				if (this.dir == "left") {
					this.setAngle("left");
					this.drawAnimated([3,4,5]);
				} else if (this.dir == "right") {
					this.setAngle("right");
					this.drawAnimated([3,4,5]);
				} else if (this.dir == "up") {
					this.setAngle("up");
					this.drawAnimated([3,4,5]);
				} else if (this.dir == "down") {
					this.setAngle("down");
					this.drawAnimated([3,4,5]);
				}	
			}
		}
	}

	// Check if hitting anyone
	checkHit() {
		if (this.hurtTimer > 0) {
			for (var i of playerArr) {
				if (this.owner != i.playerID && this.collideWith(i)) {
					console.log("REKTT player " + i.playerID + "died...");
					i.die();
				}
			}
		}	
	}

}
class Snowball extends Bullet {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, owner, dir);

		this.speed = 2;
		this.dead = false;
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
			var seq = [1, 2, 3, 4];
			if (this.dir == "left") {
				this.setAngle("up");
				this.drawAnimated(seq)
			} else if (this.dir == "right") {
				this.setAngle("down");
				this.drawAnimated(seq)
			} else if (this.dir == "up") {
				this.setAngle("left");
				this.drawAnimated(seq)
			} else if (this.dir == "down") {
				this.setAngle("right");
				this.drawAnimated(seq)
			}
			if (this.finishAnim) {
				this.dead = true;
			}
		} else {
			this.setAngle("right");
			this.drawAnimated(this.frameSeq);
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

	// Check if out of bounds or hit some terrain
	checkDead() {
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen ||
		        this.checkWallCol()) {
			this.break();
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

		//if (playerID == 1) {
		//	this.gun = new SnowGun(0, 100, 20, 20, gunImg, 2, 2, [0], this);
		//} else if (playerID == 2) {
			this.gun = new LaserGun(0, 100, 20, 20, laserGun_img, 2, 2, [0], this);
		//}

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
					this.setAngle("left");
					this.drawAnimated([0, 1]);
				} else if (this.facing == "right") {
					this.setAngle("right");
					this.drawAnimated([0, 1]);
				} else if (this.facing == "up") {
					this.setAngle("up");
					this.drawAnimated([0, 1]);
				} else if (this.facing == "down") {
					this.setAngle("down");
					this.drawAnimated([0, 1]);
				}

			// Idle animation
			} else {
				this.animIndex = 0;
				if (this.facing == "left") {
					this.setAngle("left");
					this.drawAnimated(this.frameSeq);
				} else if (this.facing == "right") {
					this.setAngle("right");
					this.drawAnimated(this.frameSeq);
				} else if (this.facing == "up") {
					this.setAngle("up");
					this.drawAnimated(this.frameSeq);
				} else if (this.facing == "down") {
					this.setAngle("down");
					this.drawAnimated(this.frameSeq);
				}
			}

		// Dead sprite
		} else {
			this.setAngle("right");
			this.drawAnimated([2]);
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
			this.gun.shoot();
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