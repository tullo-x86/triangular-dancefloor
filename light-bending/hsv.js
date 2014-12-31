
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function defineHsvStyles(sheet)
{	
    for (var h = 0; h < 6; h++) {
        var hue = h / 6;

        for (var s = 0; s < 4; s++) {
            var sat = s / 3;

            for (var v = 0; v < 8; v++) {
                var val = v / 7;

                var rgb = HSVtoRGB(hue, sat, val);

                var hueSelector = '.h' + h;
                var satSelector = '.s' + s;
                var valSelector = '.v' + v;

                var properties = 'fill: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + '); '
                         + 'background: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + '); ';

                
                sheet.insertRule(hueSelector + satSelector + valSelector
                                + ' { ' + properties + ' }', 0)
            };
        };
    };
}

(function($) {
$.fn.extend({
	setH: function(h) {
		return this.removeClass('h0 h1 h2 h3 h4 h5')
				   .addClass('h'+h);
	},
	setS: function(s) {
		return this.removeClass('s0 s1 s2 s3')
				   .addClass('s'+s);
	},
	setV: function(v) {
		return this.removeClass('v0 v1 v2 v3 v4 v5 v6 v7')
				   .addClass('v'+v);
	}
});
})(jQuery);