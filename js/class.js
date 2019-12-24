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

		if (this.angle == "right" || this.angle == "left") {
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

		} else if (this.angle == "up" || this.angle == "down") {
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
		if (this.angle == "right" || this.angle == "left") {
			rect1 = {
				x: this.x-this.centerX+this.img.width/this.nCol/2-this.width/2,
				y: this.y-this.centerY+this.img.height/this.nRow/2-this.height/2,
				width: this.width,
				height: this.height
			};
		} else if (this.angle == "up" || this.angle == "down") {
			rect1 = {
				x: this.x-this.centerX+this.img.width/this.nCol/2-this.height/2,
				y: this.y-this.centerX+this.img.height/this.nRow/2-this.width/2,
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
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);
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
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);
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
						i.gun = new LaserGun(0, 100, 20, 20, laserGun_img, 2, 2, [0], 0, 0, i);
						break;
					} else if (rand >= 0.5 && i.gun.gunID != 3) {
						i.gun = new Shotgun(0, 100, 20, 20, shotgun_img, 2, 3, [0], 0,0, i);
						break;
		     		}
	     		}

				tempArr.add(new Crate(Math.floor(Math.random()*19)*gridLen,Math.floor(Math.random()*9)*gridLen, 20, 20, crate_img, 1, 2, [0], 0,0));
				break;
			}
		}
	}
}

class Wall extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);
	}

	update() {
		super.update();
	}
}


class Gun extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);

		this.shooting = false;
		this.player = player;
	}

	update() {
		this.updateMovement();
		this.checkAmmo();
	}


	// Stick with the player
	updateMovement() {
		this.x = this.player.x;
		this.y = this.player.y;
		this.setAngle(this.player.angle);
	}

	checkAmmo() {
		if (this.ammo == 0) {
			this.player.gun = new SnowGun(0, 100, 20, 20, gunImg, 2, 2, [0], 0,0, this.player);
		}
	}
}

class Shotgun extends Gun {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player);
		this.gunID = 3;
		this.shootTime = 60;
		this.ammo = 10;
	}

	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw();
	}	
	draw() {
		this.setAngle(this.player.angle);

		// Shooting animation in 4 directions
		if (this.shooting) {
			this.drawAnimated([1,2,4,3,4,0]);
			if (this.finishAnim) {
				this.shooting = false;
				shotgunReload_snd.play();
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);	
		}	

		ctx.drawImage(ammo_img, this.player.x, this.player.y-10);
		ctx.fillText(this.ammo, this.player.x+12, this.player.y);
	}

	// Shoot the gun (create bullet + recoil)
	shoot() {
		this.shooting = true;
		this.ammo--;
		console.log("shotty ammo = " + this.ammo);
		for (var i = 0; i < 6; i++) {
			tempArr.add(new Pellet(this.x, this.y, 4, 4, pellet_img, 1, 1, [0], 0,0, this.player.playerID, this.player.angle));
		}
		shotgunShoot_snd.play();


		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}

class SnowGun extends Gun {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player);
		this.gunID = 1;
		this.shootTime = 20;
	}

	update() {
		this.updateMovement();
		this.draw();
	}	

	draw() {
		this.setAngle(this.player.angle);

		// Shooting animation in 4 directions
		if (this.shooting) {
			this.drawAnimated([2, 1]);
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);		
		}	

		//ctx.fillText("Ammo: "+this.ammo, this.player.x, this.player.y);
	}
	// Shoot the gun (create bullet + recoil)
	shoot() {
		this.shooting = true;
		tempArr.add(new Snowball(this.x, this.y, 8, 8, snowball, 3, 2, [0], 0,0, this.player.playerID, this.player.angle));
		shoot_snd.play();

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}
	 
class LaserGun extends Gun {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player);
		this.gunID = 2;
		this.shootTime = 90;

		this.chargeTime = 60;
		this.chargeTimer = 0;

		this.ammo = 10;
	}

	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw();
		this.chargeGun();

		console.log("ammo = " + this.ammo);
	}

	// Charging down the gun
	chargeGun() {
		if (this.chargeTimer > 0) {
			this.chargeTimer--;
			if (this.chargeTimer == 0) {
				this.shooting = true;

				console.log("SHOT LASERRR");
				console.log("player angle = " + this.player.angle);
				if (this.player.angle == "left") {
					for (var i = this.x-this.player.width/2; i > -20; i-=20) {
						tempArr.add(new LaserBlast(i, this.y, 20, 8, laserBeam_img, 2, 3, [0,1,2], 0,0, this.player.playerID, this.player.angle));
					}
				} else if (this.player.angle == "right") {
					for (var i = this.x+this.player.width/2; i < canvas.width; i+=20) {
						tempArr.add(new LaserBlast(i, this.y, 20, 8, laserBeam_img, 2, 3, [0,1,2], 0,0, this.player.playerID, this.player.angle));
					}
				} else if (this.player.angle == "up") {
					for (var i = this.y-this.player.height/2; i > -20; i-=20) {
						tempArr.add(new LaserBlast(this.x, i, 20, 8, laserBeam_img, 2, 3, [0,1,2], 0,0, this.player.playerID, this.player.angle));
					}
				} else {
					for (var i = this.y+this.player.height/2; i < canvas.height; i+=20) {
						tempArr.add(new LaserBlast(this.x, i, 20, 8, laserBeam_img, 2, 3, [0,1,2], 0,0, this.player.playerID, this.player.angle));
					}
				}
				lasershoot_snd.play();

				// Prepare for new animation
				this.animIndex = 0;
				this.animDelay = 0;
			}
		}
	}

	draw() {
		this.setAngle(this.player.angle);

		// Shooting animation in 4 directions
		if (this.shooting) {
			this.drawAnimated([2, 1]);	
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);		
		}	

		// Charging animation
		if (this.chargeTimer > 0) {
			ctx.fillStyle = "red";
			ctx.globalAlpha = 0.3;
			var beamWidth = 4;
			var beamDist = 400;

			if (this.player.angle == "left") {
				ctx.fillRect(this.player.x+this.player.width/2, this.player.y+this.player.height/2-beamWidth/2, -beamDist, beamWidth);
			} else if (this.player.angle == "right") {
				ctx.fillRect(this.player.x+this.player.width/2, this.player.y+this.player.height/2-beamWidth/2, beamDist, beamWidth);
			} else if (this.player.angle == "up") {
				ctx.fillRect(this.player.x+this.player.width/2-beamWidth/2, this.player.y+this.player.height/2, beamWidth, -beamDist);
			} else if (this.player.angle == "down") {
				ctx.fillRect(this.player.x+this.player.width/2-beamWidth/2, this.player.y+this.player.height/2, beamWidth, beamDist);
			}

			ctx.fillStyle = "black";
			ctx.globalAlpha = 1;
		}

		ctx.drawImage(ammo_img, this.player.x, this.player.y-10);
		ctx.fillText(this.ammo, this.player.x+12, this.player.y);
	}

	// Charge the gun + shoot it
	shoot() {
		if (this.chargeTimer == 0) {
			this.chargeTimer = this.chargeTime;
			this.ammo--;
			lasercharge_snd.play();
		}
	}
}

class Bullet extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);
		this.dir = dir;
		this.owner = owner;
		this.dead = false;
	}
}

class Pellet extends Bullet {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir);
		this.moveTimer = 6 + Math.floor(Math.random()*10);
		this.deadTimer = 17;


		this.speed = 5;
		this.spreadAngle = 40;

		// Choose top or bottom spread
		this.angle = Math.floor(Math.random()*this.spreadAngle/2) * Math.PI/180;
		if (Math.random() > 0.5) {
			this.angle = -this.angle;
		}

		// Separating speed in horizontal and vertical
		this.hspeed = this.speed * Math.cos(this.angle);
		this.vspeed = this.speed * Math.sin(this.angle);

		this.setAngle(this.dir);
	}	

	update() {
		if (this.moveTimer > 0) {
			this.updateMovement();	
		}
		this.tickTimers();
		this.checkDead();
		this.checkHit();
		this.draw();
	}
	draw() {
		this.drawAnimated(this.frameSeq);
		//this.drawCol();
	}

	// Count down the timers
	tickTimers() {
		if (this.moveTimer > 0) {
			this.moveTimer--;
		}
		if (this.deadTimer > 0) {
			this.deadTimer--;
			if (this.deadTimer == 0) {
				this.dead = true;
			}
		}		
	}
	updateMovement() {
		if (this.dir == "left") {
			this.x -= this.hspeed;
			this.y -= this.vspeed;
		} else if (this.dir == "right") {
			this.x += this.hspeed;
			this.y += this.vspeed;
		} else if (this.dir == "up") {
			this.x -= this.vspeed;
			this.y -= this.hspeed;
		} else {
			this.x += this.vspeed;
			this.y += this.hspeed;
		}
	}
	// Check if out of bounds or hit some terrain
	checkDead() {
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen ||
		        this.checkWallCol()) {
			this.moveTimer = 0;
		}
	}

	// Check if hitting anyone
	checkHit() {
		for (var i of playerArr) {
			if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
				console.log("REKTT player " + i.playerID + "died...");
				i.die(this.dir);
			}
		}
	}
}

class LaserBlast extends Bullet {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir);

		this.aliveTimer = 30;  // How long to stay alive for
		this.hurtTimer = 10; // How long can deal damage

		this.setAngle(dir);
	}

	update() {
		this.tickTimer();
		this.checkHit();
		this.draw();
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
				this.drawAnimated(this.frameSeq);
			} else {
				this.drawAnimated([3,4,5]);
			}
		}
	}


	// Check if hitting anyone
	checkHit() {
		if (this.hurtTimer > 0) {
			for (var i of playerArr) {
				if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
					console.log("REKTT player " + i.playerID + "died...");
					i.die(this.dir);
				}
			}
		}	
	}

}
class Snowball extends Bullet {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, owner, dir);
		this.speed = 2;
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
			if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
				console.log("REKTT player " + i.playerID + "died...");
				this.break();
				i.die(this.dir);
			}
		}
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
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, playerID, startFace) {
		super(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);

		this.speed = 1;

		this.shootTimer = 0;

		this.playerID = playerID;

		//if (playerID == 1) {
			this.gun = new SnowGun(0, 100, 20, 20, gunImg, 2, 2, [0], 0,0, this);
		//} else if (playerID == 2) {
		//	this.gun = new Shotgun(0, 100, 20, 20, shotgun_img, 2, 3, [0], 0,0, this);
			//this.gun = new LaserGun(0, 100, 20, 20, laserGun_img, 2, 2, [0], 0,0, this);
		//}

		this.dead = false;
		this.dying = false;

		this.leftKey;
		this.rightKey;
		this.upKey;
		this.downKey;
		this.shootKey;

		this.moving = false; // If player is moving or not

		this.strafeDir = "none"; // Direction keep facing when strafing
		this.firstKeyPress = "none";  // Key first pressed for strafing
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
			this.firstKeyPress = "none";
		}

		if (this.moving) {

			// Start strafing
			if (this.firstKeyPress == "none") {
				if (this.leftKey) { this.firstKeyPress = "left"; }
				if (this.rightKey) { this.firstKeyPress = "right"; }
				if (this.upKey) { this.firstKeyPress = "up"; }
				if (this.downKey) { this.firstKeyPress = "down"; }
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

		this.setAngle("right");
		// Set direction for player to die
		/*if (bulletDir == "left") {
			this.setAngle("right");
		} else if (bulletDir == "right") {
			this.setAngle("left");
		} else if (bulletDir == "up") {
			this.setAngle("down");
		} else if (bulletDir == "down") {
			this.setAngle("up");
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
		if (this.rightKey) { keys.push("right"); }
		if (this.leftKey) { keys.push("left");}
		if (this.upKey) { keys.push("up"); }
		if (this.downKey) { keys.push("down"); }
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