// Draw grids
function drawGrids() {
	ctx.lineWidth = 1;
	ctx.globalAlpha = 0.2;
	for (var i = 0; i < canvas.height/gridLen; i++) {
		for (var j = 0; j < canvas.width/gridLen; j++) {
			ctx.beginPath();
			ctx.rect(j*gridLen, i*gridLen, gridLen, gridLen);
			ctx.stroke();
		}
	}
	ctx.globalAlpha = 1;
}