var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function () {

    "use strict";

    eduk8r.sprites.Force = function (startPoint, endPoint, obj) {

        // if, for example, a handle is passed in as a point, we don't want to modify the handle if/when extending the line
        this.startPoint = (startPoint == null ? new createjs.Point(0, 0) : startPoint.clone());
        this.endPoint = (endPoint == null ? new createjs.Point(0, 0) : endPoint.clone());
        // clone the object if it exists - this works for plain simple js objects
        this.o = (obj == null ? {} : JSON.parse(JSON.stringify(obj)));

        this.initialize();
    };

    var p = eduk8r.sprites.Force.prototype = new createjs.Container(); // inherit from Container

    p.STROKE = "blue";
    p.STYLE = 1.5;
    p.CAPS = "round";
    p.JOINTS = "round";
    // p.MITER_LIMIT = 10;

    // if scaled, set a 'max' and a min stoke weight and length; these will be automatically adjusted relative to the line length
    p.STYLE_MIN = 2;
    p.STYLE_MAX = 5;

    // default properties for directed line arrow/pointer
    p.LENGTH = .2;
    // the 'sharpness' of the arrowhead, in degrees
    p.ANGLE = 50;

    p.Container_initialize = p.initialize; // temporary store for initialization routine for Container

    p.initialize = function () {

        var o = this.o; // shortcut

        this.Container_initialize();

        o.stroke = (o.stroke == null ? p.STROKE : o.stroke);
        o.style = (o.style == null ? p.STYLE : o.style);
        o.caps = (o.caps == null ? p.CAPS : o.caps);
        o.joints = (o.joints == null ? p.JOINTS : o.joints);
        o.length = (o.length == null ? p.LENGTH : o.length);
        o.scaled = (o.scaled == null ? false : o.scaled);
        o.filled = (o.filled == null ? false : o.filled);
        o.fill = (o.fill == null ? o.stroke : o.fill);

        if (o.scaled) {
            o.styleMax = (o.styleMax == null ? p.STYLE_MAX : o.styleMax);
            o.styleMin = (o.styleMin == null ? p.STYLE_MIN : o.styleMin);

            this.setScaledStyle();
        }

        o.length = (o.length == null ? p.LENGTH : o.length);
        o.angle = (o.angle == null ? p.ANGLE : o.angle);

        if (o.scaled) {
            o.length = this.getArrowLength();
        }

        this.addChild(this.getSprite());
    };


    p.getArrow = function () {

        var arrow = new createjs.Shape(),
            c = new createjs.Container(),
            g = arrow.graphics,
            o = this.o,
            l = Math.round(o.length),
            y;

        // y is half the width of the base of the arrow
        y = Math.round(l * Math.tan(o.angle * Math.PI / 360));

        g.s(o.stroke).ss(o.style, o.caps, o.joints);

        if (o.filled == true) {
            g.beginFill(o.fill).moveTo(l, -y).lineTo(l, y);
        } else {
            g.moveTo(l, y);
        }
        g.lineTo(0, 0).lineTo(l, -y);

        c.rotation = eduk8r.utils.Math.slopeAngleDeg(this.endPoint, this.startPoint);
        c.x = this.endPoint.x;
        c.y = this.endPoint.y;

        c.addChild(arrow);

        return c;
    };

    p.getArrowLength = function () {
        var o = this.o,
            lineLength = eduk8r.utils.Math.distance(this.startPoint, this.endPoint);

        // base arrow length on non-scaled length, scaled style and the average scaled style
        // but don't allow it to be longer than the line length itself


        //eduk8r.utils.sim.debug(o.length+", "+lineLength);

        return o.length * lineLength;



    };

    // set the stroke style and arrow length
    p.setScaledStyle = function () {

        var o = this.o;

        // do length and stroke style calcs here
        var maxStyleLength,
            lineLen = eduk8r.utils.geom.distance(this.startPoint, this.endPoint),
            canvas = document.getElementsByTagName('canvas')[0],
            w = canvas.width,
            h = canvas.height,
            styleRatio, temp;

        // reach maximum style length when line length is half the maximum possible in the canvas
        // it would be better to use container but can't get height/width without too much coupling
        maxStyleLength = Math.sqrt(w * w + h * h) / 3;

        // map minimum line length of 0 to 0, maximum line length to Math.PI/2, n.b. sin(Math.PI/2) = 1
        // with most rapid style change in the mid-range and easing around 0 and Math.PI/2
        styleRatio = lineLen / maxStyleLength;

        // set the scaled style
        // rounding this limits calculated arrowlength to discrete lengths causing jumps in length so Math.round removed)
        o.style = styleRatio * (o.styleMax - o.styleMin) + o.styleMin;

        temp = o.style;
        temp = temp;
    };

    p.getSprite = function () {
        var o = this.o,
            sprite = new createjs.Shape(),
            g = sprite.graphics,
            c = new createjs.Container();

        if (o.filled) {
            g.f(o.fill);
        }

        // draw the line
        g.s(o.stroke).ss(o.style, o.caps, o.joints).mt(this.startPoint.x, this.startPoint.y)
            .lt(this.endPoint.x, this.endPoint.y);

        c.addChild(sprite);
        c.addChild(this.getArrow());

        return c;
    };

}());