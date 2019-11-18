// Stores the state of the keys
var Keys = {
	left: false,
	right: false,
	up: false,
	down: false
}

// Which keys bind to which
var KeyCode = {
	left: 65,
	right: 68,
	up: 87,
	down: 83
}


// Pressing keys
document.onkeydown = function(event) {
	switch (event.keyCode) {

		// Press left
		case KeyCode.left:
			Keys.left = true;
			break;

		// Press right
		case KeyCode.right:
			Keys.right = true;
			break;

		// Press up
		case KeyCode.up:
			Keys.up = true;
			break;

		// Press down
		case KeyCode.down:
			Keys.down = true;
			break;
	}
}

// Releasing keys
document.onkeyup = function(event) {
	switch (event.keyCode) {

		// Released left
		case KeyCode.left:
			Keys.left = false;
			break;

		// Released right
		case KeyCode.right:
			Keys.right = false;
			break;

		// Released up
		case KeyCode.up:
			Keys.up = false;
			break;

		// Released down
		case KeyCode.down:
			Keys.down = false;
			break;
	}
}