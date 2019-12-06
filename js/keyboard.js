// Stores the state of the keys
var Keys = {
	left: false,
	right: false,
	up: false,
	down: false,
	space: false,

	a: false,
	s: false,
	w: false,
	d: false,
	f: false
}

// Which keys bind to which
var KeyCode = {
	left: 37,
	right: 39,
	up: 38,
	down: 40,
	space: 32,

	a: 65,
	s: 83,
	w: 87,
	d: 68,
	f: 70
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

		// Press shoot
		case KeyCode.space:
			Keys.space = true;
			break;




		// Press a
		case KeyCode.a:
			Keys.a = true;
			break;

		// Press d
		case KeyCode.d:
			Keys.d = true;
			break;

		// Press w
		case KeyCode.w:
			Keys.w = true;
			break;

		// Press s
		case KeyCode.s:
			Keys.s = true;
			break;

		// Press f
		case KeyCode.f:
			Keys.f = true;
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

		// Released shoot
		case KeyCode.space:
			Keys.space = false;
			break;




		// Released a
		case KeyCode.a:
			Keys.a = false;
			break;

		// Released d
		case KeyCode.d:
			Keys.d = false;
			break;

		// Released w
		case KeyCode.w:
			Keys.w = false;
			break;

		// Released s
		case KeyCode.s:
			Keys.s = false;
			break;

		// Released f
		case KeyCode.f:
			Keys.f = false;
			break;
	}
}