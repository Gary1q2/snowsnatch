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
			this.player.gun = new SnowGun(this.player);
		}
	}
}

class RocketLauncher extends Gun {
	constructor(player) {
		super(0, 100, 22, 20, rocketLauncher_img, 1, 2, [0], 0, 0, player);
		this.gunID = 5;
 
		this.shootTime = 80;
		this.ammo = 6;		
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
			this.drawAnimated([1,1,1,1,1,1,1,1,1,1,1,1]);
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);	
		}	

		ctx.drawImage(ammo_img, this.player.x, this.player.y-10);
		ctx.fillText(this.ammo, this.player.x+12, this.player.y);
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
		super(0, 100, 20, 20, uzi_img, 2, 2, [0], 0, 0, player);
		this.gunID = 4;
 
		this.shootTime = 15;
		this.ammo = 15;
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
			this.drawAnimated([2,1]);
			if (this.finishAnim) {
				this.shooting = false;
			}

		// Idle gun in 4 directions
		} else {
			this.drawAnimated(this.frameSeq);	
		}	

		ctx.drawImage(ammo_img, this.player.x, this.player.y-10);
		ctx.fillText(this.ammo, this.player.x+12, this.player.y);
	}

	// Shoot the gun (create bullet)
	shoot() {
		this.shooting = true;
		this.ammo--;
		console.log("smg ammo = " + this.ammo);
		tempArr.add(new Pellet(this.x, this.y, this.player.playerID, this.player.angle, -1, -1, 2, 10));
		
		uziShoot_snd.play();

		for (var i = 0; i < 10; i++) {
			tempArr.add(new Confetti(this.x, this.y, 3, 4));
		}

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}


class Shotgun extends Gun {
	constructor(player) {
		super(0, 100, 20, 20, shotgun_img, 2, 3, [0], 0, 0, player);
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
			tempArr.add(new Pellet(this.x, this.y, this.player.playerID, this.player.angle, 6+Math.floor(Math.random()*10), 17, 5, 40));
		}
		shotgunShoot_snd.play();


		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}

class SnowGun extends Gun {
	constructor(player) {
		super(0, 100, 20, 20, gunImg, 2, 2, [0], 0,0, player);
		this.gunID = 1;
		this.shootTime = 30;
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
		tempArr.add(new Snowball(this.x, this.y, this.player.playerID, this.player.angle));
		shoot_snd.play();

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}
	 
class LaserGun extends Gun {
	constructor(player) {
		super(0, 100, 20, 20, laserGun_img, 2, 2, [0], 0, 0, player);
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
	}

	// Charging down the gun
	chargeGun() {
		if (this.chargeTimer > 0) {
			this.chargeTimer--;
			if (this.chargeTimer == 0) {
				this.shooting = true;

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

			if (this.player.angle == DIR.left) {
				ctx.fillRect(this.player.x+this.player.width/2, this.player.y+this.player.height/2-beamWidth/2, -beamDist, beamWidth);
			} else if (this.player.angle == DIR.right) {
				ctx.fillRect(this.player.x+this.player.width/2, this.player.y+this.player.height/2-beamWidth/2, beamDist, beamWidth);
			} else if (this.player.angle == DIR.up) {
				ctx.fillRect(this.player.x+this.player.width/2-beamWidth/2, this.player.y+this.player.height/2, beamWidth, -beamDist);
			} else if (this.player.angle == DIR.down) {
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
			console.log("ammo = " + this.ammo);
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
	draw() {
		this.drawAnimated(this.frameSeq);
	}
}

class Explosion extends Bullet {
	constructor(x, y, owner, dir) {
		super(x, y, 40, 40, explosion_img, 4, 3, [0,1,2,3,4,5,6,7,8,9], 25, 25, owner, dir);
		this.dmgTime = 1;     // Initial time that can damage you

		explosion_snd.play();
	}
	update() {

		// Player can only get damaged during damage time
		if (this.dmgTime > 0) {
			this.checkHit();
		}
		this.tickTimer();

		this.drawCol();
		this.draw();

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

class Missile extends Bullet {
	constructor(x, y, owner, dir) {
		super(x, y, 10, 7, missile_img, 2, 2, [0,1,2,3], 0, 0, owner, dir);
		this.speed = 1;
		this.maxSpeed = 6;
		this.setAngle(this.dir);

		this.delayBeforeSpeed = 20;   // How long to wait before speeding up

		this.speedTickTime = 5;       // Time interval to speed up
		this.speedTickSpeed = 0.5;    // Speed interval to speed up
		this.ticker = this.speedTickTime;  // Variable to count the ticking

		missileLaunch_snd.play();
	}
	update() {
		this.updateMovement();
		this.checkHit();
		this.checkDead();
		this.draw();
		this.drawCol();

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
		this.dead = true;
		tempArr.add(new Explosion(this.x, this.y, this.owner, this.dir));
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
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen ||
		        this.checkWallCol()) {
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
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen ||
		        wallHit) {
			if (this.deadTimer == -1) {
				this.dead = true;
			} else {
				this.moveTimer = 0;
			}

			// Damage wall and REMOVE pellet instantly to prevent wall instagib
			if (wallHit) {
				wallHit.damageWall(1);
				this.dead = true;
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
		super(x, y, 20, 8, laserBeam_img, 2, 3, [0,1,2], 0, 0, owner, dir);
		this.aliveTimer = 30;  // How long to stay alive for
		this.hurtTimer = 1; // How long can deal damage

		this.setAngle(dir);
	}

	update() {
		this.checkHit();
		this.tickTimer();
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
		if (this.x < 0 || this.x > numWidth*gridLen-gridLen ||
		      this.y < 0 || this.y > numHeight*gridLen-gridLen ||
		        wallHit) {
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
		snowbreak_snd.play();

		// Prepare for new animation
		this.animIndex = 0;
		this.animDelay = 0;
	}
}