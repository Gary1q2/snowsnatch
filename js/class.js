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

class Player extends Entity {
	constructor(x, y, width, height, img) {
		super(x, y, width, height, img);
	}
	update() {
		this.updateMovement();
		super.update();
	}

	// Update movement based on key presses
	updateMovement() {
		if (Keys.left && !Keys.right && this.x > 0) {
			this.x--;
		}
		if (Keys.right && !Keys.left && this.x < numWidth-1) {
			this.x++;
		}
		if (Keys.up && !Keys.down && this.y > 0) {
			this.y--;
		}
		if (Keys.down && !Keys.up && this.y < numHeight-1) {
			this.y++;
		}
	}
}