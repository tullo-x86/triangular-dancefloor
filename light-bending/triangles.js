$(function() {

	var dancefloor = {};
	var _priv = {
		rows: []
	};

	var root3on2 = 0.866025403784;
	var segmentLength = 50;
	var rotate = 0;

	var triCount = 0;
	function updateTriCount() {
		$('#tricount').text(triCount + ' triangles');
	}

	function isPointySideUp(y, x) {
		return (Math.abs(x + y) % 2) == 1;
	}

	function createTri(y, x) {
		var pointySideUp = isPointySideUp(y, x);

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

		$(dom).addClass('h2 s3 v3');

		triCount++
		updateTriCount();

		return dom;
	}

	function getTri(x) {
		return this[x - this.xMin];
	}

	function getTris(xLeft, xRight) {
		return this.slice(xLeft - this.xMin, xRight - this.xMin + 1);
	}

	function createCellsForRow(y, xMin, xMax) {
		var row = [];
		row.getTri = getTri;
		row.getTris = getTris;
		row.xMin = xMin;

		for (var x = xMin; x <= xMax; x++) {
			row.push(createTri(y, x));
		};

		$('#all').append(row);

		return row;
	}

	function createRowAt(y, xMin, xMax) {
		_priv.rows[y] = createCellsForRow(y, xMin, xMax);
	};

	dancefloor.createRowAt = createRowAt;
	dancefloor.createTri = createTri;

	function getHollowTri(y, xLeft, xRight, pointySideUp) {
		// Start by getting the row `y`
		var tris = _priv.rows[y].getTris(xLeft, xRight);

		var edgeLength = tris.length;

		if (pointySideUp) {
			var xNextLeft  = xLeft;
			var xNextRight = xRight;
			var yNext	   = y;
			for (var i = 0; i < edgeLength - 1; i++) {
				if (i % 2 == 0) {
					xNextLeft++;
					xNextRight--;
				}
				else {
					yNext++;
				}

				tris.push(_priv.rows[yNext].getTri(xNextLeft));
				tris.push(_priv.rows[yNext].getTri(xNextRight));
			}
		}
		else {

		}

		return $(tris);
	}

	dancefloor.getHollowTri = getHollowTri;

	window.dancefloor = dancefloor;
});