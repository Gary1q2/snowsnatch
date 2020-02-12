class Graph {
	constructor(level) {
		this.height = level.length;
		this.width = level[0].length;
		this.level = level;

		this.squareLen = 20;

		this.astar = new Astar(level);
	}

	// Draw the maze with colors
	drawMaze() {
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				if (this.level[i][j] == 0) {
					ctx.fillStyle = "white";
				} else if (this.level[i][j] == 1) {
					ctx.fillStyle = "black";
				} else if (this.level[i][j] == 2) {
					ctx.fillStyle = "red";
				} else if (this.level[i][j] == 3) {
					ctx.fillStyle = "blue";
				} 
				ctx.fillRect(j*this.squareLen, i*this.squareLen, this.squareLen, this.squareLen);
			}
		}
	}

	// Draw the path on top of the maze
	drawPath() {
		var path = this.astar.search();
		if (!path) { return; }
		
		// Log the path
		//console.log("\npath:");
		for (var i = 0; i < path.length; i++) {
			console.log("["+path[i].x+","+path[i].y+"]");
		}

		ctx.fillStyle = "green";
		for (var i = 0; i < path.length; i++) {
			if (JSON.stringify(path[i]) == JSON.stringify(this.astar.start) || JSON.stringify(path[i]) == JSON.stringify(this.astar.goal)) {
				continue;
			}
			ctx.fillRect(path[i].x*this.squareLen, path[i].y*this.squareLen, this.squareLen, this.squareLen);
		}
	}
}