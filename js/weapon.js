class Gun extends Entity {
	constructor(x, y, width, height, img, nRow, nCol, frameSeq, centerX, centerY, player) {
		super(player.x, player.y, width, height, img, nRow, nCol, frameSeq, centerX, centerY);

		// All guns stick to play regardless of passed in x & y coordinates

		this.shooting = false;
		this.player = player;
	}

	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw([0]);
	}

	// Draw the gun on the player + shooting animation
	draw(shootingSeq) {
		this.setAngle(this.player.angle);

		// Shooting animation in 4 directions
		if (this.shooting) {
			this.drawAnimated(shootingSeq);
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);	
		}	
	}

	// Stick with the player
	updateMovement() {
		this.x = this.player.x;
		this.y = this.player.y;
		this.setAngle(this.player.angle);
	}

	// Check if out of ammo
	checkAmmo() {
		if (this.ammo == 0) {
			this.player.gun = new SnowGun(this.player);
		}
	}
}

class Mine extends Gun {
	constructor(player) {
		super(0, 100, 8, 8, mine_img, 3, 3, [0], 0, 0, player);
		this.gunID = 6;

		this.shootTime = 1;
		this.ammo = 2;

		this.shootTime = 20;
		this.animDelayTime = 20;

		document.getElementById("ammo"+this.player.playerID).style.visibility = "visible";
	}
	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw([8]);
		if (debug) {
			this.drawCol();
		}
	}

	// Draw the mine on the player 
	draw() {

		// Shooting animation in 4 directions
		if (this.shooting) {
			this.drawAnimated([8]);
			if (this.finishAnim) {
				this.shooting = false;
				this.ammo--;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);	
		}	
	}
	shoot() {
		this.shooting = true;
		tempArr.add(new MineBomb(this.x, this.y, this.player.playerID));
		playSound(mineDrop_snd);
	}
}

class RocketLauncher extends Gun {
	constructor(player) {
		super(0, 100, 8, 8, rocketLauncher_img, 1, 2, [0], 0, 0, player);
		this.gunID = 5;
 
		this.shootTime = 80;
		this.ammo = 6;		
		document.getElementById("ammo"+this.player.playerID).style.visibility = "visible";
	}
	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw([1,1,1,1,1,1,1,1,1,1,1,1]);
		if (debug) {
			this.drawCol();
		}
	}	

	// Shoot the gun (create rocket)
	shoot() {
		this.shooting = true;
		this.ammo--;
		console.log("rocket ammo = " + this.ammo);
		tempArr.add(new Missile(this.x, this.y, this.player.playerID, this.player.angle));

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}

class Uzi extends Gun {
	constructor(player) {
		super(0, 100, 8, 8, uzi_img, 2, 2, [0], 0, 0, player);
		this.gunID = 4;
 
		this.shootTime = 15;
		this.ammo = 15;
		document.getElementById("ammo"+this.player.playerID).style.visibility = "visible";
	}
	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw([2,1]);
		if (debug) {
			this.drawCol();
		}
	}	


	// Shoot the gun (create bullet)
	shoot() {
		this.shooting = true;
		tempArr.add(new Pellet(this.x, this.y, this.player.playerID, this.player.angle, -1, -1, 2, 10));
		
		playSound(uziShoot_snd);

		tempArr.add(new Shell(this.x, this.y, shell_img, this.player.angle));

		this.ammo--;

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}


class Shotgun extends Gun {
	constructor(player) {
		super(0, 100, 8, 8, shotgun_img, 2, 3, [0], 0, 0, player);
		this.gunID = 3;
		this.shootTime = 60;
		this.ammo = 10;

		document.getElementById("ammo"+this.player.playerID).style.visibility = "visible";
	}

	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw();
		if (debug) {
			this.drawCol();
		}
	}	
	draw() {
		this.setAngle(this.player.angle);

		// Shooting animation in 4 directions
		if (this.shooting) {
			this.drawAnimated([1,2,4,3,4,0]);
			if (this.finishAnim) {
				this.shooting = false;
				playSound(shotgunReload_snd);
				tempArr.add(new Shell(this.x, this.y, shellShotgun_img, this.player.angle));
				this.ammo--;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);	
		}	
	}

	// Shoot the gun (create bullet + recoil)
	shoot() {
		this.shooting = true;
		console.log("shotty ammo = " + this.ammo);
		for (var i = 0; i < 6; i++) {
			tempArr.add(new Pellet(this.x, this.y, this.player.playerID, this.player.angle, 6+Math.floor(Math.random()*10), 17, 5, 40));
		}
		playSound(shotgunShoot_snd);


		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}

class SnowGun extends Gun {
	constructor(player) {
		super(0, 100, 8, 8, gunImg, 2, 2, [0], 0,0, player);
		this.gunID = 1;
		this.shootTime = 30;
		this.shooting = false;

		document.getElementById("ammo"+this.player.playerID).style.visibility = "hidden";
	}

	update() {
		this.updateMovement();
		this.draw([2,1]);
		if (debug) {
			this.drawCol();
		}
	}	


	// Shoot the gun (create bullet + recoil)
	shoot() {
		this.shooting = true;
		tempArr.add(new Snowball(this.x, this.y, this.player.playerID, this.player.angle));
		playSound(shoot_snd);

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}
	 
class LaserGun extends Gun {
	constructor(player) {
		super(0, 100, 8, 8, laserGun_img, 2, 2, [0], 0, 0, player);
		this.gunID = 2;
		this.shootTime = 90;

		this.chargeTime = 60;
		this.chargeTimer = 0;

		this.ammo = 10;

		document.getElementById("ammo"+this.player.playerID).style.visibility = "visible";
	}

	update() {
		this.updateMovement();
		this.checkAmmo();
		this.draw();
		if (debug) {
			this.drawCol();
		}
		this.chargeGun();
	}

	// Charging down the gun
	chargeGun() {
		if (this.chargeTimer > 0) {
			this.chargeTimer--;
			if (this.chargeTimer == 0) {
				this.shooting = true;

				this.ammo--;
				console.log("ammo = " + this.ammo);

				console.log("SHOT LASERRR");
				console.log("player angle = " + this.player.angle);
				if (this.player.angle == DIR.left) {
					for (var i = this.x-this.player.width/2; i > -20; i-=20) {
						tempArr.add(new LaserBlast(i, this.y, this.player.playerID, this.player.angle));
					}
				} else if (this.player.angle == DIR.right) {
					for (var i = this.x+this.player.width/2; i < canvas.width; i+=20) {
						tempArr.add(new LaserBlast(i, this.y, this.player.playerID, this.player.angle));
					}
				} else if (this.player.angle == DIR.up) {
					for (var i = this.y-this.player.height/2; i > -20; i-=20) {
						tempArr.add(new LaserBlast(this.x, i, this.player.playerID, this.player.angle));
					}
				} else {
					for (var i = this.y+this.player.height/2; i < canvas.height; i+=20) {
						tempArr.add(new LaserBlast(this.x, i, this.player.playerID, this.player.angle));
					}
				}
				playSound(lasershoot_snd);

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

			var anchorX = this.player.x-this.player.centerX+this.player.img.width/this.player.nCol/2-this.player.width/2;
			var anchorY = this.player.y-this.player.centerY+this.player.img.height/this.player.nRow/2-this.player.height/2;

			if (this.player.angle == DIR.left) {
				ctx.fillRect(anchorX+this.player.width/2, anchorY+this.player.height/2-beamWidth/2, -beamDist, beamWidth);
			} else if (this.player.angle == DIR.right) {
				ctx.fillRect(anchorX+this.player.width/2, anchorY+this.player.height/2-beamWidth/2, beamDist, beamWidth);
			} else if (this.player.angle == DIR.up) {
				ctx.fillRect(anchorX+this.player.width/2-beamWidth/2, anchorY+this.player.height/2, beamWidth, -beamDist);
			} else {
				ctx.fillRect(anchorX+this.player.width/2-beamWidth/2, anchorY+this.player.height/2, beamWidth, beamDist);
			}

			ctx.fillStyle = "black";
			ctx.globalAlpha = 1;
		}
	}

	// Charge the gun + shoot it
	shoot() {
		if (this.chargeTimer == 0) {
			this.chargeTimer = this.chargeTime;
			playSound(lasercharge_snd);
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
	draw() {
		this.drawAnimated(this.frameSeq);
		if (debug) {
			this.drawCol();
		}
	}
}


class Explosion extends Bullet {
	constructor(x, y, owner, dir) {

		// Realign the explosion depending on missle direction
		// Realign by 1 grid... :)
		var tempX = x;
		var tempY = y;

		if (dir == DIR.right) {
			tempX += gridLen;
			tempY += gridLen/2;
		} else if (dir == DIR.left) {
			tempY += gridLen/2;
		} else if (dir == DIR.up) {
			tempX += gridLen/2;
		} else {
			tempX += gridLen/2;
			tempY += gridLen;
		}

		super(tempX, tempY, 60, 60, explosion_img, 4, 3, [0,1,2,3,4,5,6,7,8,9], 25, 25, owner, dir);
		this.dmgTime = 1;     // awInitial time that can damage you
		console.log("Created @ "+tempX+","+tempY);

		playSound(explosion_snd);
	}
	update() {

		// Player can only get damaged during damage time
		if (this.dmgTime > 0) {
			this.checkHit();
		}
		this.tickTimer();

		this.draw();
		if (debug) {
			this.drawCol();
		}

		if (this.finishAnim) {
			this.dead = true;
		}
	}

	// Check if hitting anyone or any walls
	checkHit() {
		for (var i of playerArr) {
			if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
				console.log("REKTT player " + i.playerID + "died...");
				i.die(this.dir);
			}
		}

		// Deal 2 damage to walls
		for (var i = 0; i < wallArr.size(); i++) {
			if (this.collideWith(wallArr.array[i])){
				wallArr.array[i].damageWall(2);
			}
		}
	}



	// Tick timer to get rid of explosion
	tickTimer() {
		if (this.dmgTime > 0) {
			this.dmgTime--;
		}
	}
}
class MineBomb extends Bullet {
	constructor(x, y, owner) {
		super(x, y, 20, 20, mine_img, 3, 3, [0,1,2,3,0,1,2,3,4,5,6], 0,0, owner);
		this.armed = false;
	}
	update() {
		if (this.armed) {
			this.checkHit();
		}
		this.draw();
		if (debug) {
			this.drawCol();
		}
	}

	draw() {
		if (!this.armed) {
			this.drawAnimated(this.frameSeq);
			if (this.finishAnim) {
				this.armed = true;
			}
		} else {
			this.animDelayTime = 10;
			this.drawAnimated([6,6,6,7]);
		}
	}

	// Check if hitting anyone
	checkHit() {
		for (var i of playerArr) {
			if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
				this.explode();
			}
		}
	}
	// Create explosion
	explode() {
		console.log("WIDTH = "+ this.width);
		tempArr.add(new Explosion(this.x, this.y, this.owner, this.dir));
		this.dead = true;
	}
}

class Missile extends Bullet {
	constructor(x, y, owner, dir) {
		super(x, y, 10, 10, missile_img, 2, 2, [0,1,2,3], 0, 0, owner, dir);
		this.speed = 1;
		this.maxSpeed = 6;
		this.setAngle(this.dir);

		this.delayBeforeSpeed = 20;   // How long to wait before speeding up

		this.speedTickTime = 5;       // Time interval to speed up
		this.speedTickSpeed = 0.5;    // Speed interval to speed up
		this.ticker = this.speedTickTime;  // Variable to count the ticking

		this.smokeTicker = 5;

		playSound(missileLaunch_snd);
	}
	update() {
		this.updateMovement();
		this.checkHit();
		this.checkDead();
		this.draw();
		if (debug) {
			this.drawCol();
		}

		if (this.delayBeforeSpeed <= 0) {
			if (this.ticker > 0) {
				this.ticker--;
				if (this.ticker == 0) {
					this.ticker = this.speedTickTime;
					if (this.speed < this.maxSpeed) {
						this.speed += this.speedTickSpeed;
					}
				}
			}
		}

		if (this.smokeTicker > 0) {
			this.smokeTicker--;
			if (this.smokeTicker == 0) {
				tempArr.add(new Smoke(this.x, this.y, this.dir));
				this.smokeTicker = 7+Math.ceil(Math.random()*4);
			}
		}
		this.delayBeforeSpeed--;
	}

	updateMovement() {
		if (this.dir == DIR.left) {
			this.x -= this.speed;
		} else if (this.dir == DIR.right) {
			this.x += this.speed;
		} else if (this.dir == DIR.up) {
			this.y -= this.speed;
		} else {
			this.y += this.speed;
		}
	}
	// Create explosion
	explode() {
		console.log("exploded at "+this.x+","+this.y);
		tempArr.add(new Explosion(this.x, this.y, this.owner, this.dir));
		this.dead = true;
	}

	// Check if hitting anyone
	checkHit() {
		for (var i of playerArr) {
			if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
				this.explode();
			}
		}
	}
	// Check if out of bounds or hit some terrain
	checkDead() {
		if (this.checkEdgeCol() || this.checkWallCol()) {
			this.explode();
		}
	}
}


class Pellet extends Bullet {
	constructor(x, y, owner, dir, moveTime, deadTime, speed, spread) {
		super(x, y, 4, 4, pellet_img, 1, 1, [0], 0, 0, owner, dir);
		this.moveTimer = moveTime;
		this.deadTimer = deadTime;

		this.speed = speed;
		this.spreadAngle = spread;

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
		if (this.moveTimer > 0 || this.moveTimer == -1) {
			this.updateMovement();	
		}
		this.tickTimers();
		this.checkDead();
		this.checkHit();
		this.draw();
		if (debug) {
			this.drawCol();
		}
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
		if (this.dir == DIR.left) {
			this.x -= this.hspeed;
			this.y -= this.vspeed;
		} else if (this.dir == DIR.right) {
			this.x += this.hspeed;
			this.y += this.vspeed;
		} else if (this.dir == DIR.up) {
			this.x -= this.vspeed;
			this.y -= this.hspeed;
		} else {
			this.x += this.vspeed;
			this.y += this.hspeed;
		}
	}
	// Check if out of bounds or hit some terrain
	checkDead() {
		var wallHit = this.checkWallCol();
		if (this.checkEdgeCol() || wallHit) {

			// Damage wall and REMOVE pellet instantly to prevent wall instagib
			if (wallHit) {
				wallHit.damageWall(1);
				this.dead = true;
			}

			if (this.deadTimer == -1) {
				this.dead = true;
			} else {
				this.moveTimer = 0;
			}	
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
	constructor(x, y, owner, dir) {

		// Setting rectangular hitbox depending on direction of player
		var wide;
		var tall;
		if (dir == DIR.left || dir == DIR.right) {
			wide = 20;
			tall = 8;
		} else {
			wide = 8;
			tall = 20;
		}
		super(x, y, wide, tall, laserBeam_img, 2, 3, [0,1,2], 0, 0, owner, dir);
		this.aliveTimer = 30;  // How long to stay alive for
		this.hurtTimer = 1; // How long can deal damage

		this.setAngle(dir);
	}

	update() {
		this.checkHit();
		this.tickTimer();
		this.draw();
		if (debug) {
			this.drawCol();
		}
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


	// Check if hitting anyone or walls
	checkHit() {
		if (this.hurtTimer > 0) {
			for (var i of playerArr) {
				if (this.owner != i.playerID && this.collideWith(i) && !i.dead) {
					console.log("REKTT player " + i.playerID + "died...");
					i.die(this.dir);
				}
			}

			// Deal damage to walls
			for (var i = 0; i < wallArr.size(); i++) {
				if (this.collideWith(wallArr.array[i])){
					// 0.5 because laser is big and 2 can hit 1 wall
					wallArr.array[i].damageWall(0.5);  
				}
			}
		}	
	}

}
class Snowball extends Bullet {
	constructor(x, y, owner, dir) {
		super(x, y, 8, 8, snowball, 3, 2, [0], 0,0, owner, dir);
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
			if (debug) {
				this.drawCol();
			}
		}
	}

	// Draw idle or breaking animation
	draw() {
		if (this.breaking) {
			var seq = [1, 2, 3, 4];
			if (this.dir == DIR.left) {
				this.setAngle(DIR.up);
				this.drawAnimated(seq)
			} else if (this.dir == DIR.right) {
				this.setAngle(DIR.down);
				this.drawAnimated(seq)
			} else if (this.dir == DIR.up) {
				this.setAngle(DIR.left);
				this.drawAnimated(seq)
			} else if (this.dir == DIR.down) {
				this.setAngle(DIR.right);
				this.drawAnimated(seq)
			}
			if (this.finishAnim) {
				this.dead = true;
			}
		} else {
			this.setAngle(DIR.right);
			this.drawAnimated(this.frameSeq);
		}
		if (debug) {
			this.drawCol();
		}
	}

	updateMovement() {
		if (this.dir == DIR.left) {
			this.x -= this.speed;
			this.moveTimer = this.moveTime;
		} else if (this.dir == DIR.right) {
			this.x += this.speed;
			this.moveTimer = this.moveTime;
		} else if (this.dir == DIR.up) {
			this.y -= this.speed;
			this.moveTimer = this.moveTime;
		} else if (this.dir == DIR.down) {
			this.y += this.speed;
			this.moveTimer = this.moveTime;
		}	
	}

	// Check if out of bounds or hit some terrain
	checkDead() {
		var wallHit = this.checkWallCol();
		if (this.checkEdgeCol() || wallHit) {
			if (wallHit) {
				wallHit.damageWall(1);
			}
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
		playSound(snowbreak_snd);

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}