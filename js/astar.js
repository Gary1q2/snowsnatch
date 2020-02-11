class astar {

	// Create 4x4 array grid
	constructor() {

		this.height = 4;
		this.width = 4;

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
					debug: "",
					parent: null
				}
			}
		}
		console.log(this.array);
	}


	search(start, goal) {
		var openList = [];
		var closedList = [];
		openList.push(start);

		while (openList.length != 0) {

			// Find the node with the lowest f(x) in openlist
			var lowestIndex = -1;
			for (var i = 0; i < openList.length; i++) {
				if (lowestIndex == -1) {
					lowestIndex = i;
				} else {
					if (openList[i].f < openList[lowestIndex].f) {
						lowestIndex = i;
					}
				}
			}
			var currentNode = openList[lowestIndex];		

			// Goal has been found, SO RETURN THE PATH
			if (currentNode.x == goal.x && currentNode.y == goal.y) {
				var curr = currentNode;
				var path = [];
				while (curr.parent) {
					ret.push(curr);
					curr = curr.parent;
				}
				return path.reverse();
			}

			// No goal found, continue searching

			// Pop node from openlist
			openList.splice(lowestIndex, 1);
			closedList.push(currentNode);

			var neighbours = this.neighbours(currentNode);
			for (var i = 0; i < neighbours.length; i++) {
				var neighbour = neighbours[i];
				if (closedList.includes(neighbour)) {
					continue;
				}

				var gScore = currentNode.g + 1;
				var gScoreIsBest = false;



				// Neighbour not in openList
				if (!openList.includes(neighbour)) {

					gScoreIsBest = true;
					var pos1 = {
						x: neighbour.x,
						y: neighbour.y
					};
					var pos2 = {
						x: goal.x,
						y: goal.y
					};
					neighbour.h = this.manhattan(pos1, pos2);
					openList.push(neighbour);

				} else if (gScore < neighbour.g) {
					gScoreIsBest = true;
				}

				if (gScoreIsBest) {
					neighbour.parent = currentNode;
					neighbour.g = gScore;
					neighbour.f = neighbour.g + neighbour.h;
					neighbour.debug = "F: " + neighbour.f + "\n" + neighbour.g + "\n" + neighbour.h;
				}
			}
		}

		// No path found
		return [];
	}

	// Return manhattan distance of 2 grids
	manhattan(pos1, pos2) {
		return Math.abs(pos1.x-pos2.x) + Math.abs(pos1.y-pos2.y);
	}

	// Return all neighbours of the current node (only up, down, left & right)
	neighbours(pos) {
		console.log(pos);
		var list = [];

		// Append left column
		if (this.array[pos.y][pos.x-1]) {
			list.push(this.array[pos.y][pos.x-1]);
		}

		// Append right column
		if (this.array[pos.y][pos.x+1]) {
			list.push(this.array[pos.y][pos.x+1]);
		}

		// Append top row
		if (this.array[pos.y-1][pos.x]) {
			list.push(this.array[pos.y-1][pos.x]);
		}

		// Append bottom row
		if (this.array[pos.y+1][pos.x]) {
			list.push(this.array[pos.y+1][pos.x]);
		}

		return list;
	}
}