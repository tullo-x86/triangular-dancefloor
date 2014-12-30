$(function() {

	var dancefloor = {};
	var _priv = {
		rows: []
	};

	var root3on2 = 0.866025403784;
	var segmentLength = 50;
	var rotate = 0;

	function createTri(y, x) {
		var pointySideUp = (Math.abs(x + y) % 2) == 1;

		// Points are in order of left (xMin) to right (xMax)

		var yLower = -y * root3on2 * segmentLength;
		var yUpper = (-y - 1) * root3on2 * segmentLength;

		var xLeft =  (x - 1) * segmentLength / 2;
		var xCentre = x      * segmentLength / 2;
		var xRight = (x + 1) * segmentLength / 2;

		var point1 = xLeft   + "," + (pointySideUp ? yLower : yUpper);
		var point2 = xCentre + "," + (pointySideUp ? yUpper : yLower);
		var point3 = xRight  + "," + (pointySideUp ? yLower : yUpper);

		var dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		dom.setAttribute('points', point1 + ' ' + point2 + ' ' + point3);
		$('#all').append(dom);
		$(dom).addClass('tri')
			  .addClass('r' + y)
			  .addClass('c' + x);

		$(dom).addClass(String.fromCharCode(97 + rotate));
		rotate++;
		if (rotate > 5) rotate = 0;
	}

	function createCellsForRow(y, xMin, xMax) {
		var row = [];
		for (var x = xMin; x <= xMax; x++) {
			row[x] = createTri(y, x);
			$('#all').append(row[x]);
		};

		return row;
	}

	function createRowAt(y, xMin, xMax) {
		_priv.rows[y] = createCellsForRow(y, xMin, xMax);
	};

	dancefloor.createRowAt = createRowAt;
	dancefloor.createTri = createTri;

	window.dancefloor = dancefloor;

});