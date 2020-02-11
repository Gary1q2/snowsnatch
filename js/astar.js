class astar {

	// Create 4x4 array grid
	constructor(height, width) {

		this.height = height;
		this.width = width;

		// Create 2D array
		this.array = new Array(this.height);
		for (var i = 0; i < this.array.length; i++) {
			this.array[i] = new Array(this.width);
		}

		// Fill array with variables
		for (var i = 0; i < this.array.length; i++) {
			for (var j = 0; j < this.array[i].length; j++) {
				this.array[i][j] = {
					f: -1,
					g: -1,
					h: -1,
					parent: null
				}
			}
		}
		console.log(this.array);
	}


	search(start, goal) {

		if (JSON.stringify(start) === JSON.stringify(goal)) {
			console.log("Already at the goal");
			return;
		}

		// Initialise starting node in array
		this.array[start.y][start.x].f = 0;
		this.array[start.y][start.x].g = 0;
		this.array[start.y][start.x].h = 0;
		this.array[start.y][start.x].parent = null;

		var openList = [];
		var closedList = [];

		openList.push(start);


		while (openList.length != 0) {

			var lowIndex = 0;
			for (var i = 0; i < openList.length; i++) {
				if (openList[i].f < openList[lowIndex].f) {
					lowIndex = i;
				}
			}
			var currentNode = openList[lowIndex];
			console.log("Reached new node ["+currentNode.x+","+currentNode.y+"]");


			openList.splice(lowIndex, 1);
			closedList.push(currentNode);

			var neighbours = this.neighbours(currentNode);
			for (var i = 0; i < neighbours.length; i++) {
				var neighbour = neighbours[i];
				console.log("Neighbour found ["+neighbour.x+","+neighbour.y+"]");

				// Check if goal
				if (JSON.stringify(neighbour) === JSON.stringify(goal)) {
					this.array[neighbour.y][neighbour.x].parent = currentNode;
					console.log("Found goal");
					return this.getPath(neighbour);

				} else {
					var newG = this.array[currentNode.y][currentNode.x].g + 1;

					// Node in openList
					if (this.containsObject(neighbour, openList)) {
						console.log("In openList");

						// Skip if new G value is larger than existing one
						if (this.array[neighbour.y][neighbour.x].g <= newG) {
							continue;
						}

					// Node in closedList
					} else if (this.containsObject(neighbour, closedList)) {
						console.log("In closedList");

						// Skip if new G value is larger than existing one
						if (this.array[neighbour.y][neighbour.x].g <= newG) {
							continue;
						}
						//openList.push(neighbour);
						//closedList.splice(closedList.indexOf(neighbour), 1);

					} else {
						console.log("Not in any list... added to openList");
						openList.push(neighbour);
						this.array[neighbour.y][neighbour.x].h = this.manhattan(neighbour, goal);
					}

					this.array[neighbour.y][neighbour.x].g = newG;
					this.array[neighbour.y][neighbour.x].f = this.array[neighbour.y][neighbour.x].g + this.array[neighbour.y][neighbour.x].h;
					this.array[neighbour.y][neighbour.x].parent = currentNode;
				}
			}
		}

		console.log("No path available...");
		return;
	}

	// Return the path from start to current node
	getPath(currNode) {
		var curr = currNode
		var path = [];
		console.log("loop time");
		while (this.array[curr.y][curr.x].parent) {
			console.log("["+curr.x+","+curr.y+"]");
			path.push(curr);
			curr = this.array[curr.y][curr.x].parent;
		}
		path.push(curr);
		return path.reverse();
	}

	// Return manhattan distance of 2 grids
	manhattan(pos1, pos2) {
		return Math.abs(pos1.x-pos2.x) + Math.abs(pos1.y-pos2.y);
	}

	// Return all neighbours of the current node (only up, down, left & right)
	neighbours(pos) {
		var list = [];

		// Bottom neighbour
		if (pos.y > 0) {
			list.push({
				x: pos.x,
				y: pos.y-1
			})
		}

		// Top neighbour
		if (pos.y < this.height-1) {
			list.push({
				x: pos.x,
				y: pos.y+1
			})
		}

		// Left neighbour
		if (pos.x > 0) {
			list.push({
				x: pos.x-1,
				y: pos.y
			})
		}

		// Right neighbour
		if (pos.x < this.width-1) {
			list.push({
				x: pos.x+1,
				y: pos.y
			})
		}

		return list;
	}

	// Checks if given array contains given object
	containsObject(obj, list) {
		for (var i = 0; i < list.length; i++) {
			if (JSON.stringify(obj) === JSON.stringify(list[i])) {
				return true;
			}
		}
		return false;
	}
}