/*  version 0.8.0 of easeljs makes inheritance much simpler 
    see http://createjs.com/tutorials/Inheritance/ for details */

var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function () {

    'use strict';

    eduk8r.sprites.Member = function (sp, ep, obj) {
        this.Container_constructor();

        this.sp = sp;
        this.ep = ep;
        // if object passed in, clone it so that the argument 
        // is not inadvertantly modified
        this.obj = (obj == null ? {} : JSON.parse(JSON.stringify(obj)));
        
        this.init();
    };

    // inherit from Container
    var p = createjs.extend(eduk8r.sprites.Member, createjs.Container),
        math = eduk8r.utils.Math;

    // some default values on the prototype
    p.FILL = 'white';
    p.STROKE = 'black';
    p.STROKE_STYLE = 1;
    p.THICKNESS = 40;
    p.RADIUS = p.THICKNESS/2;
    p.PIN = true;
    p.PIN_RADIUS = p.RADIUS/8;

    p.init = function () {
        var o = this.obj; //just a shortcut
        o.fill = (o.fill == null ? p.FILL : o.fill);
        o.stroke = (o.stroke == null ? p.STROKE : o.stroke);
        o.style = (o.style == null ? p.STROKE_STYLE : o.style);
        o.thickness = (o.thickness == null ? p.THICKNESS : o.thickness);
        o.radius = (o.radius == null ? p.RADIUS : o.radius);
        o.pin = (o.pin == null ? p.PIN : o.pin);
        o.pinRadius = (o.pinRadius == null ? p.PIN_RADIUS : o.pinRadius);
        o.pinFill = (o.pinFill == null ? o.stroke : o.pinFill);

       this.setup();
    }

    p.setup = function () {
        var o = this.obj,
            length = math.distance(this.sp, this.ep),
            slope = math.slopeAngleRad(this.sp, this.ep),
            th = o.thickness,
            c = new createjs.Container(),
            s = new createjs.Shape(),
            startPin = new createjs.Shape(),
            endPin = new createjs.Shape();

        s.graphics.beginFill(o.fill)
            .setStrokeStyle(o.style)
            .beginStroke(o.stroke)
            .drawRoundRect(0, 0, length + th, th, o.radius)
            .endFill()
            .endStroke();
        
        if (o.pin) {
            startPin.graphics.beginFill(o.pinFill).drawCircle(th / 2, th / 2, o.pinRadius);
            endPin.graphics.beginFill(o.pinFill).drawCircle(th / 2 + length, th / 2, o.pinRadius);
        }
        
        c.addChild(s, startPin, endPin);
        // Set the registration point for c at the startPoint. This is the point about which it rotates.
        c.regX = th / 2;
        c.regY = th / 2;
        // rotate
        c.rotation = -math.toDegrees(slope);
        // translate the startPoint from (0, 0) to (sp.x, sp.y)
        c.x = this.sp.x;
        c.y = this.sp.y;

        this.addChild(c);
    };

      window.eduk8r.sprites.Member = createjs.promote(eduk8r.sprites.Member, "Container");
}());