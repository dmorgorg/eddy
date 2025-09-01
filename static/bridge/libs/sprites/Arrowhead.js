var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function() {

	eduk8r.sprites.Arrowhead = function(obj) {

		var o = obj || {};
		this.length = (o.length == null ? p.LENGTH : o.length);
		// disallow arrowhead angle too large or negative
		this.angle = (o.angle == null ? p.ANGLE : Math.min(p.MAX_ANGLE, Math.abs(o.angle)));
		this.style = (o.style == null ? p.STYLE : o.style);
		this.stroke = (o.stroke == null ? p.STROKE : o.stroke);
		this.filled = (o.filled == null ? true : o.filled);
		this.fill = (o.fill == null ? this.stroke : o.fill);

		this.initialize();
	};

	var p = eduk8r.sprites.Arrowhead.prototype = new createjs.Container(); // inherit from Container

	// the length of the arc arrowhead
	p.LENGTH = 10;
	// the 'sharpness' of the arrowhead, in degrees
	p.ANGLE = 50;
	p.MAX_ANGLE = 120;
	p.STROKE = "black";
	p.STYLE = 1.5;

	p.Container_initialize = p.initialize; // temporary store for initialization routine for Container

	p.initialize = function() {
		this.Container_initialize();
		this.addChild(this.getSprite());
	};

	p.getSprite = function() {
		
		var sprite = new createjs.Shape();
		var c = new createjs.Container();
		var g, y;

		g = sprite.graphics;

		// draw the arrowhead
		y = Math.round(this.length * Math.tan(this.angle / 360 * Math.PI));
		g.beginStroke(this.stroke).setStrokeStyle(this.style, "round", "round");
		if (this.filled === true) {
			g.beginFill(this.fill).moveTo(this.length, -y).lineTo(this.length, y).lineTo(0, 0).closePath();
		} else {
			g.moveTo(this.length, y);
		}
		g.lineTo(0, 0).lineTo(this.length, -y);
		c.addChild(sprite);
		
		return c;
	};

}());