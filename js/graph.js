class Graph {
	constructor(level) {
		this.height = level.length;
		this.width = level[0].length;
		this.level = level;

		this.squareLen = 20;
	}

	drawMaze() {
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				if (this.level[i][j] == 0) {
					ctx.fillStyle = "white";
				} else if (this.level[i][j] == 1) {
					ctx.fillStyle = "brown";
				} else if (this.level[i][j] == 2) {
					ctx.fillStyle = "blue";
				} else if (this.level[i][j] == 3) {
					ctx.fillStyle = "pink";
				} 
				ctx.fillRect(j*this.squareLen, i*this.squareLen, this.squareLen, this.squareLen);
			}
		}
	}

	drawPath(path) {
		ctx.fillStyle = "green";
		for (var i = 0; i < path.length; i++) {
			ctx.fillRect(path[i].x*this.squareLen, path[i].y*this.squareLen, this.squareLen, this.squareLen);
		}
	}
}