/*  version 0.8.0 of easeljs makes inheritance much simpler 
    see http://createjs.com/tutorials/Inheritance/ for details. 
    Requires eduk8r.utils.math 
    June 5, 2015 */

var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function () {

    'use strict';

    eduk8r.sprites.Line = function (sp, ep, obj) {
        this.Container_constructor();

        this.sp = sp;
        this.ep = ep;
        // if object passed in, clone it so that the argument 
        // is not inadvertantly modified
        this.obj = (obj == null ? {} : JSON.parse(JSON.stringify(obj)));

        this.init();
    };

    // inherit from Container
    var p = createjs.extend(eduk8r.sprites.Line, createjs.Container),
        math = eduk8r.utils.Math;

    // some default values on the prototype
    p.STYLE = 1;
    p.STROKE = 'black';
    p.STROKE_STYLE = 1;
    p.CAPS = "round";
    p.JOINTS = "round";
    // if scaled, set a max and a min stoke weight and arrow length; these will be automatically adjusted relative to the line length
    p.STYLE_MIN = 1;
    p.STYLE_MAX = 4;
    // default properties for directed line arrow/pointer
    p.LENGTH = 10;
    // the 'sharpness' of the arrowhead, in degrees
    p.ANGLE = 50;


    p.init = function () {
        var o = this.obj; //just a shortcut

        o.stroke = (o.stroke == null ? p.STROKE : o.stroke);
        o.style = (o.style == null ? p.STYLE : o.style);
        o.caps = (o.caps == null ? p.CAPS : o.caps);
        o.joints = (o.joints == null ? p.JOINTS : o.joints);
        // if not scaled, length is the length of the arrow in pixels, 
        //otherwise it is a percentage of the line length
        o.length = (o.length == null ? (o.style * 5) : o.length);
        o.scaled = (o.scaled == null ? false : o.scaled);
        // directed = false | "->" | "<-" | "<->"
        o.directed = (o.directed == null ? false : o.directed);
        o.filled = (o.filled == null ? false : o.filled);
        o.fill = (o.fill == null ? o.stroke : o.fill);
        o.length = (o.length == null ? p.LENGTH : o.length);
        o.angle = (o.angle == null ? p.ANGLE : o.angle);

        if (o.scaled) {
            o.styleMax = (o.styleMax == null ? p.STYLE_MAX : o.styleMax);
            o.styleMin = (o.styleMin == null ? p.STYLE_MIN : o.styleMin);

            //this.setScaledStyle();
            o.scale = this.getScaledStyle();
            o.length = this.getArrowLength();
        }

        if (o.directed !== false) {
            switch (o.directed) {
            case "->":
            case "<-":
            case "<->":
                break;
            default:
                alert('directed = false | "->" | "<-" | "<->"');
            }
        }

        this.getSprite();
    }

    p.getSprite = function () {

        var o = this.obj,
            lineLength = math.distance(this.sp, this.ep),
            slope = math.slopeAngleRad(this.sp, this.ep),
            c = new createjs.Container(),
            s = new createjs.Shape(),
            x, y, length;

        s.graphics
            .ss(o.style)
            .s(o.stroke)
            .mt(0, 0)
            .lt(lineLength, 0);

        if (o.directed) {
            length = Math.min(o.length, lineLength);
            x = length * Math.cos(math.toRadians(o.angle / 2));
            y = length * Math.sin(math.toRadians(o.angle / 2));
            if (o.directed === "->" || o.directed === "<->") {
                if (o.filled) {
                    s.graphics.f(o.fill);
                }
                s.graphics.mt(lineLength - x, y).lt(lineLength, 0).lt(lineLength - x, -y);
            }
            if (o.directed === "<-" || o.directed === "<->") {
                if (o.filled) {
                    s.graphics.f(o.fill);
                }
                s.graphics.mt(x, y).lt(0, 0).lt(x, -y);
            }
        }

        // Set the registration point for c at the startPoint. This is the point about which it rotates.
        c.regX = 0;
        c.regY = 0;
        // rotate
        c.rotation = -math.toDegrees(slope);
        // translate the startPoint from (0, 0) to (sp.x, sp.y)
        c.x = this.sp.x;
        c.y = this.sp.y;
        c.addChild(s)
        this.addChild(c);
    };

    window.eduk8r.sprites.Line = createjs.promote(eduk8r.sprites.Line, "Container");
}());