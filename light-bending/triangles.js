//$(function() {

function Dancefloor() {
	this._priv = {
		rows: []
	};
}

function TriRow(xMin) {
	this.xMin = xMin;
}

TriRow.prototype = new Array();

TriRow.prototype.getTri = function getTri(x) {
	return (x >= this.xMin) ? this[x - this.xMin] : undefined;
};

TriRow.prototype.getTris = function getTris(xLeft, xRight) {
	var xLeftmost = Math.max(0, xLeft - this.xMin);
	var xRightmost = Math.max(0, xRight - this.xMin + 1);
	return this.slice(xLeftmost, xRightmost);
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

Dancefloor.prototype.createCellsForRow = function createCellsForRow(y, xMin, xMax) {
	var row = new TriRow(xMin);

	for (var x = xMin; x <= xMax; x++) {
		row.push(this.createTri(y, x));
	};

	$('#all').append(row);

	return row;
}

Dancefloor.prototype.createTri = function createTri(y, x) {
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

Dancefloor.prototype.createRowAt = function createRowAt(y, xMin, xMax) {
	this._priv.rows[y] = this.createCellsForRow(y, xMin, xMax);
};

Dancefloor.prototype.getHollowTri = function getHollowTri(y, xLeft, xRight, pointySideUp) {
	// Start by getting the row `y`
	var tris = this._priv.rows[y].getTris(xLeft, xRight);

	var edgeLength = tris.length;

	var yIncrememt = pointySideUp ? 1 : -1;

	var xNextLeft  = xLeft;
	var xNextRight = xRight;
	var yNext	   = y;
	for (var i = 0; i < edgeLength - 1; i++) {
		if (i % 2 == 0) {
			xNextLeft++;
			xNextRight--;
		}
		else {
			yNext += yIncrememt;
		}

		tris.push(this._priv.rows[yNext].getTri(xNextLeft));
		tris.push(this._priv.rows[yNext].getTri(xNextRight));
	}

	return $(tris);
};


//});