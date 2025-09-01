var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function () {

    "use strict";

    eduk8r.sprites.RollerSupport = function (point, obj) {

        // if, for example, a handle is passed in as a point, we don't want to modify the handle
        this.point = (point == null ? new createjs.Point(0, 0) : point.clone());
        // clone the object if it exists - this works for plain simple js objects
        this.o = (obj == null ? {} : JSON.parse(JSON.stringify(obj)));

        this.initialize();
    };

    var p = eduk8r.sprites.RollerSupport.prototype = new createjs.Container(); // inherit from Container

    p.HEIGHT = 100; // distance from centre of pin to the 'floor'
    p.ARC_RADIUS = 30;
    p.THETA = 15;

    p.STROKE = "#8b7e66";
    p.FILL = "#ffe7ba";
    p.STYLE = 1.5;
    p.EXTENSION = 0;
    p.PIN_RADIUS = 0;
    p.PIN_FILL = "#8b7e66";

    p.Container_initialize = p.initialize; // temporary store for initialization routine for Container

    p.initialize = function () {
        var o = this.o; // shortcut

        this.Container_initialize();

        // distance from pin to 'floor'
        o.height = (o.height == null ? p.HEIGHT : o.height);
        o.arcRadius = (o.arcRadius == null ? p.ARC_RADIUS : o.arcRadius);

        o.stroke = (o.stroke == null ? p.STROKE : o.stroke);
        o.fill = (o.fill == null ? p.FILL : o.fill);
        o.style = (o.style == null ? p.STYLE : o.style);
        o.theta = (o.theta == null ? p.THETA : o.theta);
        o.extension = (o.extension == null ? p.EXTENSION : o.extension);
        o.pinRadius = (o.pinRadius == null ? p.PIN_RADIUS : o.pinRadius);
        o.pinFill = (o.pinFill == null ? p.PIN_FILL : o.pinFill);

        this.addChild(this.getSprite());
    };

    p.getSprite = function () {

        var o = this.o,
            sprite = new createjs.Shape(),
            c = new createjs.Container(),
            g = sprite.graphics,
            R = o.arcRadius,
            style = o.style,
            stroke = o.stroke,
            rr,
            h2,
            t = 3 * style,
            x2,
            plateX,
            h = o.height,
            thetaRad = o.theta * Math.PI / 180,
            ext = o.extension,
            r = o.pinRadius,
            dx = R * Math.cos(thetaRad),
            dy = R * Math.sin(thetaRad),
            x = dx + (dy + Number(h)) * Math.tan(thetaRad),
            // differences from pinned support
            rr = x / 3.75,
            h2 = h - t - 2 * rr,
            t = Math.max(t, rr / 2),
            x2 = dx + (dy + Number(h2)) * Math.tan(thetaRad),
            plateX = Math.max(x2, 1.25 * x),
            extX = plateX * (1 + 2 * ext);

        g.beginFill(o.fill).beginStroke(o.stroke).setStrokeStyle(style).moveTo(-x2, h2).lineTo(-dx, -dy).arc(0, 0, R, Math.PI + thetaRad, -thetaRad, false).lineTo(x2, h2).endStroke();
        //draw ground support
        g.beginFill(o.fill).beginStroke(o.stroke).setStrokeStyle(style).moveTo(-extX, h).lineTo(extX, h).endStroke();
        // wheels
        g.beginFill(o.fill).beginStroke(o.stroke).setStrokeStyle(style).drawCircle(0, h - rr, rr);
        g.beginFill(o.fill).beginStroke(o.stroke).setStrokeStyle(style).drawCircle(-2.25 * rr, h - rr, rr);
        g.beginFill(o.fill).beginStroke(o.stroke).setStrokeStyle(style).drawCircle(2.25 * rr, h - rr, rr);
        g.beginFill(o.stroke).drawCircle(0, h - rr, rr / 5);
        g.beginFill(o.stroke).drawCircle(-2.25 * rr, h - rr, rr / 5);
        g.beginFill(o.stroke).drawCircle(2.25 * rr, h - rr, rr / 5);
        //plate
        g.beginFill(o.fill).beginStroke(o.stroke).setStrokeStyle(style).drawRoundRect(-4 * rr, h2, 8 * rr, 1.5 * t, rr / 4);

        if (r > 0) {
            g.beginFill(o.pinFill).beginStroke(o.stroke).setStrokeStyle(style).drawCircle(0, 0, r);
        }

        c.addChild(sprite);
        c.x = this.point.x;
        c.y = this.point.y;
        c.rotation = o.rotation;

        return c;
    };

}());