var eduk8r = eduk8r || {};
eduk8r.simulations = eduk8r.simulations || {};
eduk8r.simulations.bridgeApp = eduk8r.simulations.bridgeApp || {};

(function () {
    'use strict';

    var app = eduk8r.simulations.bridgeApp,
        config = eduk8r.simulations.bridgeApp.config,
        math = eduk8r.utils.Math,
        ease = math.ease,
        m = config.easeParams.m2,
        pow = config.easeParams.power2,
        utils = eduk8r.utils.Utils,
        line = eduk8r.sprites.Line,
        p, points, startPoint, endPoint;

    app.View = function () {

        } // end of View constructor

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    p = app.View.prototype;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    p.drawInternalArrows = function (points, internal, container) {
        var tens = config.member.TENSION,
            comp = config.member.COMPRESSION,
            scale = config.member.SCALE,
            color, line, line2, force,
            top, bottom, angle,
            arrow, obj = {},
            th = config.member.THICKNESS;

        for (var member in internal) {
            startPoint = points[member.toString().charAt(0)];
            endPoint = points[member.toString().charAt(1)];
            force = Math.min(internal[member].f, 100);
            // color code for tension and compression
            if (internal[member].f > 0) {
                color = tens;
            } else if (internal[member].f < 0) {
                color = comp;
            } else {
                color = "#888888";
            }
            // darken the color as required, proportional to the force to stay visible over background
            color = utils.color2blackShader(color, Math.abs(force));
            arrow = (force > 0) ? '->' : (force < 0 ? '<-' : undefined);
            obj.style = 2;
            obj.directed = arrow;
            obj.stroke = color;
            // horizontal
            if (startPoint.y === endPoint.y) {
                if (force > 0) {
                    line = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(force, m, pow), 0), obj);
                    line.x = startPoint.x + th / 2;
                    line.y = startPoint.y
                    container.addChild(line);
                    line2 = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(-ease(force, m, pow), 0), obj);
                    line2.x = endPoint.x - th / 2;
                    line2.y = endPoint.y;
                    container.addChild(line2);
                } else {
                    line = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(-ease(-force, m, pow), 0), obj);
                    line.x = startPoint.x - th / 2;
                    line.y = startPoint.y
                    container.addChild(line);
                    line2 = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(-force, m, pow), 0), obj);
                    line2.x = endPoint.x + th / 2;
                    line2.y = endPoint.y;
                    container.addChild(line2);
                }
            } else if (startPoint.x === endPoint.x) {
                if (startPoint.y > endPoint.y) {
                    bottom = startPoint;
                    top = endPoint;
                } else {
                    bottom = endPoint;
                    top = startPoint;
                }
                if (force > 0) {
                    line = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(force, m, pow), 0), obj);
                    line.x = bottom.x;
                    line.y = bottom.y - th / 2;
                    line.rotation = -90;
                    container.addChild(line);
                    line2 = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(-ease(force, m, pow), 0), obj);
                    line2.x = top.x;
                    line2.y = top.y + th / 2;
                    line2.rotation = -90;
                    container.addChild(line2);
                } else {
                    line = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(-force, m, pow), 0), obj);
                    line.x = bottom.x;
                    line.y = bottom.y - th / 2;
                    line.rotation = -90;
                    container.addChild(line);
                    line2 = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(-force, m, pow), 0), obj);
                    line2.x = top.x;
                    line2.y = top.y + th / 2;
                    line2.rotation = 90;
                    container.addChild(line2);
                }
            } else {
                // must be a diagonal
                if (startPoint.y > endPoint.y) {
                    bottom = startPoint;
                    top = endPoint;
                } else {
                    bottom = endPoint;
                    top = startPoint;
                }
                angle = math.slopeAngleDeg(bottom, top);
                // tension
                if (force > 0) {
                    line = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(force, m, pow), 0), obj);
                    line.x = bottom.x + th / 2 * Math.cos(math.toRadians(angle));
                    line.y = bottom.y - th / 2 * Math.sin(math.toRadians(angle));
                    line.rotation = -angle;
                    container.addChild(line);
                    line2 = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(-ease(force, m, pow), 0), obj);
                    line2.x = top.x - th / 2 * Math.cos(math.toRadians(angle));
                    line2.y = top.y + th / 2 * Math.sin(math.toRadians(angle));
                    line2.rotation = -angle;
                    container.addChild(line2);
                    //compression
                } else {
                    line = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(ease(-force, m, pow), 0), obj);
                    line.x = bottom.x + th / 2 * Math.cos(math.toRadians(angle));
                    line.y = bottom.y - th / 2 * Math.sin(math.toRadians(angle));
                    line.rotation = -angle;
                    container.addChild(line);
                    line2 = new eduk8r.sprites.Line(new createjs.Point(0, 0), new createjs.Point(-ease(-force, m, pow), 0), obj);
                    line2.x = top.x - th / 2 * Math.cos(math.toRadians(angle));
                    line2.y = top.y + th / 2 * Math.sin(math.toRadians(angle));
                    line2.rotation = -angle;
                    container.addChild(line2);
                }
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    p.drawInternalValues = function (points, internal, offset, container) {
        var tens = config.member.TENSION,
            comp = config.member.COMPRESSION,
            color, lab;

        for (var member in internal) {
            startPoint = points[member.toString().charAt(0)];
            endPoint = points[member.toString().charAt(1)];
            // color code for tension and compression
            if (internal[member].f > 0) {
                color = tens;
            } else if (internal[member].f < 0) {
                color = comp;
            } else {
                color = "gray";
            }
            // check for horizontal and lower
            if (startPoint.y === endPoint.y && points.A.y === endPoint.y) {
                container.addChild(label(internal[member].f, (startPoint.x + endPoint.x) / 2, startPoint.y + .75 * offset, color));
            } else if (startPoint.y === endPoint.y) {
                container.addChild(label(internal[member].f, (startPoint.x + endPoint.x) / 2, startPoint.y - 2 * offset, color));
            } else if (startPoint.x === endPoint.x) {

                lab = label(internal[member].f, startPoint.x + 3.5 * offset, (startPoint.y + endPoint.y) / 1.9, color);
                lab.shadow = new createjs.Shadow("#fff", 0, 0, 3)
                lab.rotation = 90;
                lab.regX = lab.getMeasuredWidth() / 2;
                // resetting this here seems to subdue the wobbling when string length changes
                lab.x = startPoint.x + 1.75 * offset;
                container.addChild(lab);
            } else if (math.slopeAngleDeg(startPoint, endPoint) > 0 && math.slopeAngleDeg(startPoint, endPoint) < 90) {
                lab = label(internal[member].f, 0, 0, color);
                lab.regX = lab.getMeasuredWidth() / 2;
                lab.regY = lab.getMeasuredHeight() / 2;

                lab.x = (startPoint.x + endPoint.x) / 2 - offset
                lab.y = (startPoint.y + endPoint.y) / 2 - offset
                lab.shadow = new createjs.Shadow("#fff", 0, 0, 3)
               // lab.rotation = -45;
                lab.rotation = -math.slopeAngleDeg(startPoint, endPoint);
                container.addChild(lab);
            } else {
                lab = label(internal[member].f, 0, 0, color);
                lab.regX = lab.getMeasuredWidth() / 2;
                lab.regY = lab.getMeasuredHeight() / 2;
                lab.x = (startPoint.x + endPoint.x) / 2 + offset
                lab.y = (startPoint.y + endPoint.y) / 2 - offset
                lab.shadow = new createjs.Shadow("#fff", 0, 0, 3)
                lab.rotation = 180-math.slopeAngleDeg(startPoint, endPoint);
                container.addChild(lab);
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    p.drawJointLabels = function (points, container) {
        var xOffset = config.member.THICKNESS,
            yOffset = config.member.THICKNESS;

        for (var key in points) {
            switch (key) {
            case "A":
                container.addChild(alphaLabel(key, points[key].x - 1 * xOffset, points[key].y - 2.5 * yOffset, "#888"));
                break;
            case "B":
            case "C":
            case "D":
            case "E":
            case "F":
                container.addChild(alphaLabel(key, points[key].x - 1 * xOffset, points[key].y + .75 * yOffset, "#888"));
                break;
            case "G":
                container.addChild(alphaLabel(key, points[key].x + 1 * xOffset, points[key].y - 2.5 * yOffset, "#888"));
                break;
            case "H":
            case "I":
            case "J":
            case "K":
            case "L":
                container.addChild(alphaLabel(key, points[key].x, points[key].y - 2.5 * yOffset, "#888"));
                break;
            }
            
        }
    }

    function alphaLabel(str, x, y, color, rotation) {
        var txt = new createjs.Text(str, "italic 20px Arial ", color);
        txt.x = x - txt.getMeasuredWidth() / 2;
        txt.y = y;
        txt.rotation = rotation;
        return txt;
    }

    function label(f, x, y, color, rotation) {

        var f = f.toPrecision(3);
        var txt = new createjs.Text(f + " kN", "12px Arial", color);
        txt.x = x - txt.getMeasuredWidth() / 2;
        txt.y = y;
        txt.rotation = rotation;
        return txt;
    }



    p.drawBridgeSupports = function (model, container, internals) {

        var c = container;

        // draw bridge approach rectangles
        var fill = new createjs.Shape(),
            stroke = new createjs.Shape(),
            fill2 = new createjs.Shape(),
            stroke2 = new createjs.Shape(),
            member = app.config.member,
            thick = member.THICKNESS,
            points = model.points,
            ax = points.A.x,
            gx = points.G.x,
            stroke3 = new createjs.Shape(),
            sides = app.config.sides;


        var obj = {
            extension: 0,
            fill: app.config.sides.FILL,
            stroke: app.config.member.STROKE,
            style: 6
        }

        var ps = new eduk8r.sprites.PinnedSupport(new createjs.Point(0, 0), obj);
        ps.scaleX = 0.2;
        ps.scaleY = 0.2;
        ps.x = ax;
        var rs = new eduk8r.sprites.RollerSupport(new createjs.Point(0, 0), obj);
        rs.scaleX = 0.2;
        rs.scaleY = 0.2;
        rs.x = gx - 1;
        rs.y = 1;

        fill.graphics.f(sides.FILL)
            .mt(0, -thick / 2)
            .lt(ax - thick, -thick / 2)
            .lt(ax - thick, thick)
            .lt(ax + thick, thick)
            .lt(ax + thick, 12 * thick)
            .lt(0, 12 * thick);
        stroke.graphics.s(sides.STROKE)
            .mt(0, -thick / 2)
            .lt(ax - thick, -thick / 2)
            .lt(ax - thick, thick)
            .lt(ax + thick, thick)
            .lt(ax + thick, 12 * thick);
        fill2.graphics.f(sides.FILL)
            .mt(gx + ax, -thick / 2)
            .lt(gx + thick + 2, -thick / 2)
            .lt(gx + thick + 2, 1.7 * thick)
            .lt(gx - 1.5 * thick, 1.7 * thick)
            .lt(gx - 1.5 * thick, 12 * thick)
            .lt(gx + ax, 12 * thick);
        stroke2.graphics.s(sides.STROKE)
            .mt(gx + ax, -thick / 2)
            .lt(gx + thick + 2, -thick / 2)
            .lt(gx + thick + 2, 1.7 * thick)
            .lt(gx - 1.5 * thick, 1.7 * thick)
            .lt(gx - 1.5 * thick, 12 * thick)

        c.addChild(rs);
        c.addChild(ps);
        c.addChild(fill);
        c.addChild(stroke);
        c.addChild(fill2);
        c.addChild(stroke2);

    }

    p.drawBridge = function (model, internals, container) {

        var c = container,
            int = internals,
            points = model.points;

        if (internals !== "white") {
            this.drawMember(points.A, points.B, int.AB.col, c);
            this.drawMember(points.B, points.C, int.BC.col, c);
            this.drawMember(points.C, points.D, int.CD.col, c);
            this.drawMember(points.D, points.E, int.DE.col, c);
            this.drawMember(points.E, points.F, int.EF.col, c);
            this.drawMember(points.F, points.G, int.FG.col, c);
            this.drawMember(points.G, points.H, int.GH.col, c);
            this.drawMember(points.H, points.I, int.HI.col, c);
            this.drawMember(points.I, points.J, int.IJ.col, c);
            this.drawMember(points.J, points.K, int.JK.col, c);
            this.drawMember(points.K, points.L, int.KL.col, c);
            this.drawMember(points.L, points.A, int.AL.col, c);
            // for future development, consider howe and bowstring truss
            // bridges in addition to pratt
            if ("pratt") {
                this.drawMember(points.L, points.C, int.CL.col, c);
                this.drawMember(points.K, points.D, int.DK.col, c);
                this.drawMember(points.I, points.D, int.DI.col, c);
                this.drawMember(points.E, points.H, int.EH.col, c);
            }
            this.drawMember(points.L, points.B, int.BL.col, c);
            this.drawMember(points.K, points.C, int.CK.col, c);
            this.drawMember(points.J, points.D, int.DJ.col, c);
            this.drawMember(points.E, points.I, int.EI.col, c);
            this.drawMember(points.F, points.H, int.FH.col, c);
        } else {
            this.drawMember(points.A, points.B, "white", c);
            this.drawMember(points.B, points.C, "white", c);
            this.drawMember(points.C, points.D, "white", c);
            this.drawMember(points.D, points.E, "white", c);
            this.drawMember(points.E, points.F, "white", c);
            this.drawMember(points.F, points.G, "white", c);
            this.drawMember(points.G, points.H, "white", c);
            this.drawMember(points.H, points.I, "white", c);
            this.drawMember(points.I, points.J, "white", c);
            this.drawMember(points.J, points.K, "white", c);
            this.drawMember(points.K, points.L, "white", c);
            this.drawMember(points.L, points.A, "white", c);
            // for future development, consider howe and bowstring truss
            // bridges in addition to pratt
            if ("pratt") {
                this.drawMember(points.L, points.C, "white", c);
                this.drawMember(points.K, points.D, "white", c);
                this.drawMember(points.I, points.D, "white", c);
                this.drawMember(points.E, points.H, "white", c);
            }
            this.drawMember(points.L, points.B, "white", c);
            this.drawMember(points.K, points.C, "white", c);
            this.drawMember(points.J, points.D, "white", c);
            this.drawMember(points.E, points.I, "white", c);
            this.drawMember(points.F, points.H, "white", c);
        }


    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    p.drawMember = function (sp, ep, fill, c) {
        var member = app.config.member,
            m,
            obj = {
                fill: fill,
                stroke: member.STROKE,
                thickness: member.THICKNESS,
                radius: member.RADIUS
            };
        m = new eduk8r.sprites.Member(sp, ep, obj);
        c.addChild(m);
    }


}());