var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function () {

    eduk8r.sprites.Arc = function (centre, radius, startAngle, endAngle, obj) {

        var o;
        this.centre = centre;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;

        // in case no object is passed to the constructor, create one and load defaults where arguments not specified
        // clone the object if it exists - this works for plain simple js objects
        o = (obj == null ? {} : JSON.parse(JSON.stringify(obj)));

        this.ccw = (o.ccw == null ? true : o.ccw);

        // arguments for Arrowhead()
        o.arrow = (o.arrow == null ? true : o.arrow);
        o.length = (o.length == null ? p.LENGTH : o.length);
        // disallow arrowhead angle too large or negative
        o.angle = (o.angle == null ? p.ANGLE : Math.abs(o.angle));

        o.style = (o.style == null ? p.STYLE : o.style);
        o.stroke = (o.stroke == null ? p.STROKE : o.stroke);
        o.filled = (o.filled == null ? true : o.filled);
        o.fill = (o.fill == null ? this.stroke : o.fill);

        // make the object accessible
        this.o = o;

        this.initialize();
    };

    var p = eduk8r.sprites.Arc.prototype = new createjs.Container(); // inherit from Container

    // the length of the arc arrowhead
    p.LENGTH = 10;
    // the 'sharpness' of the arrowhead, in degrees
    p.ANGLE = 50;
    p.MAX_ANGLE = 120;
    p.STROKE = "black";
    p.STYLE = 1.5;

    p.Container_initialize = p.initialize; // temporary store for initialization routine for Container

    p.initialize = function () {
        this.Container_initialize();
        this.addChild(this.getSprite());
    };

    p.getSprite = function () {
        var o = this.o,
            s = this.startAngle,
            e = this.endAngle,
            angleBetween,
            c = new createjs.Container(),
            cArrow = new createjs.Container(),
            centreX = this.centre.x,
            centreY = this.centre.y,
            arc = new createjs.Shape();;

        // just the arc
        arc.graphics.s(o.stroke).ss(o.style).arc(centreX, centreY, this.radius, this.startAngle, this.endAngle, this.ccw).endStroke();
        c.addChild(arc);

        // add an arrowhead by default
        if (this.o.arrow) {

            if (this.ccw) {
                if (s > e) {
                    angleBetween = s - e;
                } else {
                    angleBetween = 2 * Math.PI + s - e;
                }
            } else {
                if (e > s) {
                    angleBetween = e - s;
                } else {
                    angleBetween = 2 * Math.PI + e - s;
                }
            }

            // seems to be a (rounding?) problem close to 0
            if (angleBetween === 0) {
                return;
            }

            arcLength = this.radius * angleBetween;

            // only draw the arrow if the arcLength is long enough to accommodate it
            if (arcLength > 0.25 * o.length) {
                // scale the arrow for small arcLengths:
                // the arrow has scale 0 if arcLength is 0.25 x arrowLength
                // the arrow if full-size if arcLength is 1.25 x arrowLength
                if (arcLength < 1.25 * o.length) {
                    cArrow.scaleX = cArrow.scaleY = (arcLength - 0.25 * o.length) / o.length;
                }

                // draw the arrowhead
                cArrow.addChild(new eduk8r.sprites.Arrowhead(o));

                // TO DO: do a better job of calculating fudge - not trivial :(
                // make the ~mid-point of the length of the arrow perpendicular to the centre of the arc
                fudge = 60 * this.o.length / Math.PI / this.radius;
                if (this.ccw === true) {
                    cArrow.rotation = (this.endAngle * 180 / Math.PI + 90 + fudge) % 360;
                } else {
                    cArrow.rotation = (this.endAngle * 180 / Math.PI - 90 - fudge) % 360;
                }

                // translate the arrowhead to the end of the arc
                cArrow.x = centreX + this.radius * Math.cos(this.endAngle);
                cArrow.y = centreY + this.radius * Math.sin(this.endAngle);

                c.addChild(cArrow);
            }
        }

        return c;
    };

}());