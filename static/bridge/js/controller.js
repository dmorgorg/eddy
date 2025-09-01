var eduk8r = eduk8r || {};
eduk8r.simulations = eduk8r.simulations || {};
eduk8r.simulations.bridgeApp = eduk8r.simulations.bridgeApp || {};

(function (window) {
    'use strict';

    var p,
        app = eduk8r.simulations.bridgeApp,
        config = eduk8r.simulations.bridgeApp.config,
        math = eduk8r.utils.Math,

        ease = math.ease,
        m = config.easeParams.m,
        pow = config.easeParams.power,
        utils = eduk8r.utils.Utils;


    // var handle;

    // controller constructor
    app.Controller = function (model, view) {
        var self = this,
            ticks = 10;

        this.model = model;
        this.data = this.model.data;
        this.view = view;
        this.reactions = {};
        this.internalForces = {};
        this.mainContainer = new createjs.Container();
        this.bridgeSupportsContainer = new createjs.Container();
        // put the truck in a container so we can make sure it stays behind the bridge
        this.truckContainer = new createjs.Container();
        this.bridgeContainer = new createjs.Container();
        this.externalContainer = new createjs.Container();
        this.topContainer = new createjs.Container();
        this.reactions = {};
        // this.truck.that is the bitmap
        this.truck;
        this.points = this.getPixelData().points;
        this.$canvas = $('canvas')[0];
        this.stage = new createjs.Stage(this.$canvas);
        this.stage.enableMouseOver();
        this.stage.autoClear = true;

        this.stage.addChild(this.mainContainer);
        this.mainContainer.addChild(this.bridgeSupportsContainer);
        this.mainContainer.addChild(this.truckContainer);
        this.mainContainer.addChild(this.bridgeContainer);
        this.mainContainer.addChild(this.externalContainer);
        this.mainContainer.addChild(this.topContainer);

        this.initMainContainer();
        createjs.Ticker.on("tick", tick, this);
        createjs.Ticker.setFPS(30);
        createjs.Touch.enable(this.stage);

        function tick(event) {
            // only update stage if it has changed
            // if (this.truck.update || ticks > 0) {
                this.redraw();
                this.stage.update(event);
                this.truck.update = false;
                // ticks--;
            // }
        }

        // truck and bridge supports only drawn once
        this.drawBridgeSupports();
        this.drawTruck();

        // showNums is disabled until one of show truck forces or show reactions is checked
        $('#showExteriorNumbers').prop('disabled', true);

        $("body").on('keydown', handleKeyDown);

        $("#theForm").on("change", handleFormChange);

        function handleKeyDown(event) {

            switch (event.which) {
            case 37:
                // left
                self.handleTruckMove("l");
                break;
            case 39:
                // right
                self.handleTruckMove("r");
                break;
            case 38:
                // up
                self.handleHeightChange(event);
                break;
            case 40:
                //down
                self.handleHeightChange(event);
                break;
            }
            self.truck.update = true;
        }



        function handleFormChange(event) {

            if ($('#showTruckForces').prop('checked') || $('#showReactions').prop('checked')) {
                console.log("able")
                $('#showExteriorNumbers').prop('disabled', false);
            } else {
                console.log('neither '+new Date())
                if ($('#showExteriorNumbers').prop('checked')) {
                    console.log("clicked")
                    $('#showExteriorNumbers').click();
                }
                $('#showExteriorNumbers').prop('disabled', true);
            }

            switch (event.target.id) {
            case "showJointLabels":
                if ($('#showJointLabels').is(':checked')) {
                    self.data.showJointLabels = true;
                } else {
                    self.data.showJointLabels = false;
                }
                break;
            case "showAngles":
                if ($('#showAngles').is(':checked')) {
                    self.data.showAngles = true;
                } else {
                    self.data.showAngles = false;
                }
                break;
            case "showTruckForces":
                if ($('#showTruckForces').is(':checked')) {
                    self.data.showTruckForces = true;
                } else {
                    self.data.showTruckForces = false;
                }
                break;
            case "showExteriorNumbers":
                if ($('#showExteriorNumbers').is(':checked')) {
                    self.data.showValues = true;
                } else {
                    self.data.showValues = false;
                }
                break;
            case "showReactions":
                if ($('#showReactions').is(':checked')) {
                    self.data.showReactions = true;
                } else {
                    self.data.showReactions = false;
                }
                break;
            case "vectors":
                if ($('#vectors').is(':checked')) {
                    self.data.showVectors = true;
                } else {
                    self.data.showVectors = false;
                }
                break;
            case "intNums":
                if ($('#intNums').is(':checked')) {
                    self.data.showInternalValues = true;
                } else {
                    self.data.showInternalValues = false;
                }
                break;
            case "showInt":
                if ($('#showInt').is(':checked')) {
                    self.data.showInternal = true;
                } else {
                    self.data.showInternal = false;
                }
                break;
            case "showAll":
                if ($('#showAll').is(':checked')) {
                    self.data.showAll = true;
                } else {
                    self.data.showAll = false;
                }
                break;

            }

            self.truck.update = true;
        };

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    p = app.Controller.prototype;



    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    p.handleHeightChange = function (event) {
        // get current y value
        var i,
            y = this.model.data.points.H[1],
            // these y values are values that give whole degrees in the truss angle
            yArray = [-0.057735027, -0.060086062, -0.062486935, -0.064940759, -0.067450852, -0.070020754, -0.072654253, -0.075355405, -0.078128563,
                      -0.080978403, -0.083909963, -0.086928674, -0.090040404, -0.093251509, -0.096568877, -0.1, -0.103553031,
                      -0.107236871, -0.111061251, -0.115036841, -0.119175359, -0.123489716, -0.127994163, -0.132704482, -0.137638192,
                      -0.142814801, -0.148256097, -0.153986496, -0.160033453, -0.166427948, -0.173205081],
            index = yArray.indexOf(y);
        switch (event.which) {
        case 38:
            index = Math.min(index, yArray.length - 2);
            this.model.data.points.H[1] =
                this.model.data.points.I[1] =
                this.model.data.points.J[1] =
                this.model.data.points.K[1] =
                this.model.data.points.L[1] = yArray[index + 1];
            break;
        case 40:
            index = Math.max(index, 1);
            this.model.data.points.H[1] =
                this.model.data.points.I[1] =
                this.model.data.points.J[1] =
                this.model.data.points.K[1] =
                this.model.data.points.L[1] = yArray[index - 1];
            break;
        }
        this.points = this.getPixelData().points;
        //  console.log(self.getPixelData().points)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    p.redraw = function () {

        // forces are recalculated for each redraw
        // set them to 0 to start so they don't accumulate
        for (var key in this.points) {
            this.points[key].f = 0;
        }

        if (this.truck.bitmap) {
            this.handleTruckMove();
        }

        this.topContainer.removeAllChildren();
        this.externalContainer.removeAllChildren();
        this.bridgeContainer.removeAllChildren();

        //need to set all forces before drawing the bridge
        this.setBridgeExternal();
        this.setReactions();
        this.setBridgeInternal();


        if (this.data.showAll) {
            this.drawBridge("colors");
            this.drawJointLabels();
            this.drawAngles();
            this.drawTruckForces();
            this.drawBridgeExternal();
            this.drawReactions();
            this.drawInternalVectors();
            this.drawInternalValues();
        } else {
            if (this.data.showInternal) {
                this.drawBridge("colors");
            } else {
                this.drawBridge();
            }
            if (this.data.showJointLabels) {
                this.drawJointLabels();
            }
            if (this.data.showAngles) {
                this.drawAngles();
            }
            if (this.data.showTruckForces) {
                this.drawTruckForces();
                this.drawBridgeExternal();
            }
            if (this.data.showReactions) {
                this.drawReactions();
            }
            if (this.data.showVectors) {
                this.drawInternalVectors();
            }
            if (this.data.showInternalValues) {
                this.drawInternalValues();
            }
        }



    };

    /////////////////////////////////////////////////////////////////////////////////////////////////

    p.drawInternalValues = function () {
        this.view.drawInternalValues(this.points, this.internalForces, config.member.THICKNESS, this.bridgeContainer)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    p.drawInternalVectors = function () {
        this.view.drawInternalArrows(this.points, this.internalForces, this.bridgeContainer)
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    p.setReactions = function () {
        var points = this.points,
            reactions = this.reactions;

        reactions.G = (points.B.f + 2 * points.C.f + 3 * points.D.f + 4 * points.E.f + 5 * points.F.f + 6 * points.G.f) / 6;
        reactions.A = (points.F.f + 2 * points.E.f + 3 * points.D.f + 4 * points.C.f + 5 * points.B.f + 6 * points.A.f) / 6;
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////


    p.drawReactions = function () {
        var reactions = this.reactions,
            points = this.points,
            th = config.member.THICKNESS;

        if ("drawReactions") {
            var obj = {
                stroke: "red",
                style: 2.5,
                directed: "->"
            };
            if (reactions.A > 0.1 || reactions.G > 0.1) {
                this.externalContainer.addChild(new eduk8r.sprites.Line(new createjs.Point(points.A.x, -th / 2), new createjs.Point(points.A.x, -ease(reactions.A, m, pow) - th / 2), obj));
                this.externalContainer.addChild(new eduk8r.sprites.Line(new createjs.Point(points.G.x, -th / 2), new createjs.Point(points.G.x, -ease(reactions.G, m, pow) - th / 2), obj));
            }
            if (this.model.data.showValues) {
                if (reactions.A > 0) {
                    this.externalContainer.addChild(label(reactions.A, points.A.x, -ease(reactions.A, m, pow) - 5 * th / 2, "red"));
                }
                if (reactions.G > 0) {
                    this.externalContainer.addChild(label(reactions.G, points.G.x, -ease(reactions.G, m, pow) - 5 * th / 2, "red"));
                }
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    p.setBridgeInternal = function () {

        var self = this,
            pts = this.points,
            int = this.internalForces,
            r = this.reactions,
            theta, comp, tens, max;
        //  note that points contains objects with properties x, y and f and are not really points.
        //  all that matters here is that they have x and y properties.
        theta = math.slopeAngleRad(pts.A, pts.L)
        comp = config.member.COMPRESSION;
        tens = config.member.TENSION;
        max = config.member.ALPHA_1;

        if ("pratt") {
            int.AL = {};
            int.AL.f = (pts.A.f - r.A) / Math.sin(math.slopeAngleRad(pts.A, pts.L));

            int.AB = {};
            int.AB.f = -int.AL.f * Math.cos(theta);

            int.BL = {};
            int.BL.f = pts.B.f;

            int.BC = {};
            int.BC.f = int.AB.f;

            int.CL = {};
            int.CL.f = -(int.AL.f * Math.sin(theta) + int.BL.f) / Math.sin(theta);

            int.KL = {};
            int.KL.f = (int.AL.f - int.CL.f) * Math.cos(theta);

            int.CD = {};
            int.CD.f = int.BC.f + int.CL.f * Math.cos(theta);

            int.CK = {};
            int.CK.f = pts.C.f - int.CL.f * Math.sin(theta);

            int.DK = {};
            int.DK.f = -int.CK.f / Math.sin(theta);

            int.JK = {};
            int.JK.f = int.KL.f - int.DK.f * Math.cos(theta);

            int.DJ = {};
            int.DJ.f = 0;

            int.IJ = {};
            int.IJ.f = int.JK.f;

            int.DI = {};
            int.DI.f = (pts.D.f - int.DK.f * Math.sin(theta)) / Math.sin(theta);

            int.DE = {};
            int.DE.f = (int.DK.f - int.DI.f) * Math.cos(theta) + int.CD.f;

            int.EI = {};
            int.EI.f = -int.DI.f * Math.sin(theta);

            int.EH = {};
            int.EH.f = (pts.E.f - int.EI.f) / Math.sin(theta);

            int.HI = {};
            int.HI.f = int.DI.f * Math.cos(theta) + int.IJ.f;

            int.EF = {};
            int.EF.f = int.DE.f - int.EH.f * Math.cos(theta);

            int.FH = {};
            int.FH.f = pts.F.f;

            int.FG = {};
            int.FG.f = int.EF.f;

            int.GH = {};
            int.GH.f = (int.HI.f + int.EH.f * Math.cos(theta)) / Math.cos(theta);

            // set fill color for bridge members depending upon whether in tension or compression
            // and the magnitude of the force
            for (var key in int) {
                int[key].col = int[key].f >= 0 ? tens : comp;
                var percent = Math.abs(int[key].f) / max > 1 ? 100 : Math.abs(int[key].f) * 100 / max;
                int[key].col = utils.white2colorShader(int[key].col, percent);
            }
        }
    };



    ///////////////////////////////////////////////////////////////////////////////////////////
    p.drawBridgeExternal = function () {
        var points = this.points,
            model = this.model,
            th = config.member.THICKNESS,
            obj = {};

        obj.stroke = "blue";
        obj.style = 2.5;
        obj.directed = "->";

        for (var key in points) {
            if (points[key].f > 0) {
                this.externalContainer.addChild(
                    new eduk8r.sprites.Line(new createjs.Point(points[key].x, th / 2),
                        new createjs.Point(points[key].x, ease(points[key].f, m, pow) + th), obj));
                if (model.data.showValues || model.data.showAll) {
                    this.externalContainer.addChild(new label(points[key].f, points[key].x, ease(points[key].f, m, pow) + 3 * th / 2, "blue"));
                }
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    p.drawTruckForces = function () {

        var truck = this.model.data.truck,
            points = this.points,
            fasp,
            faep,
            rasp,
            raep,
            obj = {},
            faL = truck.frontAxleLoad,
            faX = truck.frontAxleOffset,
            raL = truck.rearAxleLoad,
            raX = truck.rearAxleOffset,
            bitmap,
            // reactions = this.reactions,
            alpha = config.alpha,
            x, fL, rL, fLTxt, rLTxt,
            th = config.member.THICKNESS;

        // don't throw an error first time through before the image has loaded
        if (this.truck.bitmap) {
            bitmap = this.truck.bitmap;
            x = bitmap.x;
        }

        obj.stroke = "blue";
        obj.style = 2.5;
        obj.directed = "->";

        // front axle start point
        fasp = new createjs.Point(x + faX, -th / 2);
        // front axle end point
        faep = new createjs.Point(fasp.x, fasp.y + ease(faL, m, pow) + 3 * th / 2);
        // rear
        rasp = new createjs.Point(x + raX, -config.member.THICKNESS / 2);
        raep = new createjs.Point(rasp.x, rasp.y + ease(raL, m, pow) + 3 * th / 2); // fudging

        fL = new eduk8r.sprites.Line(fasp, faep, obj),
        rL = new eduk8r.sprites.Line(rasp, raep, obj);

        if (fasp.x > points.A.x && fasp.x < points.G.x) {
            fL.alpha = alpha;
        }
        if (rasp.x > points.A.x && rasp.x < points.G.x) {
            rL.alpha = alpha;
        }

        this.externalContainer.addChild(fL);
        this.externalContainer.addChild(rL);

        if (this.data.showValues || this.data.showAll) {
            fLTxt = label(faL, fasp.x, ease(faL, m, pow) + 3 * th / 2, "blue");
            rLTxt = label(raL, rasp.x, ease(raL, m, pow) + 3 * th / 2, "blue");
            if (fasp.x > points.A.x && fasp.x < points.G.x) {
                fLTxt.alpha = alpha;
            }
            if (rasp.x > points.A.x && rasp.x < points.G.x) {
                rLTxt.alpha = alpha;
            }
            this.externalContainer.addChild(fLTxt);
            this.externalContainer.addChild(rLTxt);
        }
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // set the loads points.A.f, points.B.f, etc.
    p.setBridgeExternal = function () {

        var self = this,
            truck = this.model.data.truck,
            points = this.points,
            fasp,
            faep,
            rasp,
            raep,
            obj = {},
            faL = truck.frontAxleLoad,
            faX = truck.frontAxleOffset,
            raL = truck.rearAxleLoad,
            raX = truck.rearAxleOffset,
            bitmap,
            // reactions = this.reactions,
            alpha = config.alpha,
            x, fL, rL, fLTxt, rLTxt,
            th = config.member.THICKNESS;

        // don't throw an error first time through before the image has loaded
        if (self.truck.bitmap) {
            bitmap = self.truck.bitmap;
            x = bitmap.x;
        }

        obj.stroke = "blue";
        obj.style = 2.5;
        obj.directed = "->";

        // front axle start point
        fasp = new createjs.Point(x + faX, -th / 2);
        // rear
        rasp = new createjs.Point(x + raX, -config.member.THICKNESS / 2);


        var fX = fasp.x,
            rX = rasp.x,
            sectionX = points.B.x - points.A.x;
        // loads due to front axle
        if (fX < points.A.x) {
            // no loads on bridge
        } else if (fX < points.B.x) {
            points.A.f += (points.B.x - fX) / sectionX * faL;
            points.B.f += (fX - points.A.x) / sectionX * faL;
        } else if (fX < points.C.x) {
            points.B.f += (points.C.x - fX) / sectionX * faL;
            points.C.f += (fX - points.B.x) / sectionX * faL;
        } else if (fX < points.D.x) {
            points.C.f += (points.D.x - fX) / sectionX * faL;
            points.D.f += (fX - points.C.x) / sectionX * faL;
        } else if (fX < points.E.x) {
            points.D.f += (points.E.x - fX) / sectionX * faL;
            points.E.f += (fX - points.D.x) / sectionX * faL;
        } else if (fX < points.F.x) {
            points.E.f += (points.F.x - fX) / sectionX * faL;
            points.F.f += (fX - points.E.x) / sectionX * faL;
        } else if (fX < points.G.x) {
            points.F.f += (points.G.x - fX) / sectionX * faL;
            points.G.f += (fX - points.F.x) / sectionX * faL;
        }
        // loads due to rear axle
        if (rX < points.A.x) {
            // no loads on bridge
        } else if (rX < points.B.x) {
            points.A.f += (points.B.x - rX) / sectionX * raL;
            points.B.f += (rX - points.A.x) / sectionX * raL;
        } else if (rX < points.C.x) {
            points.B.f += (points.C.x - rX) / sectionX * raL;
            points.C.f += (rX - points.B.x) / sectionX * raL;
        } else if (rX < points.D.x) {
            points.C.f += (points.D.x - rX) / sectionX * raL;
            points.D.f += (rX - points.C.x) / sectionX * raL;
        } else if (rX < points.E.x) {
            points.D.f += (points.E.x - rX) / sectionX * raL;
            points.E.f += (rX - points.D.x) / sectionX * raL;
        } else if (rX < points.F.x) {
            points.E.f += (points.F.x - rX) / sectionX * raL;
            points.F.f += (rX - points.E.x) / sectionX * raL;
        } else if (rX < points.G.x) {
            points.F.f += (points.G.x - rX) / sectionX * raL;
            points.G.f += (rX - points.F.x) / sectionX * raL;
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////

    p.handleTruckMove = function () {

        var bitmap = this.truck.bitmap,
            bitmapWidth = bitmap.image.width,
            bitmapScale = bitmap.scaleX,
            currentWidth = bitmapWidth * bitmapScale,
            canvasWidth = $('canvas')[0].width;

        //constrain truck movement
        bitmap.y = 0;
        if (bitmap.x < 0) {
            bitmap.x = 0;
        }
        if (bitmap.x + currentWidth > canvasWidth) {
            bitmap.x = canvasWidth - currentWidth;
        }
    };



    // convert location data in the model which is in proportions of
    // canvas width to pixel values that can be sent to the view
    // Also, add a field for the forces on each joint (we only need the bottom ones)
    p.getPixelData = function () {
        var i,
            o = {},
            model = this.model.data,
            modelPoints = model.points,
            modelLoads = model.loads,
            pixelPoints = {};

        for (var key in modelPoints) {
            pixelPoints[key] = {
                x: toPixels(modelPoints[key][0]),
                y: toPixels(modelPoints[key][1]),
                f: 0
            };
        }

        o.points = pixelPoints;
        return o;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////

    // Points and vehicle location are stored in the model as proportions of canvas width
    // Here we need to get those values in pixels for drawing on the canvas
    function toPixels(proportion) {
        var $canvas = $('canvas')[0];
        return Math.round($canvas.width * proportion);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    function label(f, x, y, color, rotation) {

        f = f.toPrecision(4);
        var txt = new createjs.Text(f + " kN", "12px Arial", color);
        txt.x = x - txt.getMeasuredWidth() / 2;
        txt.y = y;
        txt.rotation = rotation;
        return txt;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    p.drawBridge = function (str) {
        if (str) {
            this.view.drawBridge(this.getPixelData(), this.internalForces, this.bridgeContainer);
        } else {
            this.view.drawBridge(this.getPixelData(), "white", this.bridgeContainer);
        }


    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    p.drawJointLabels = function () {
        this.view.drawJointLabels(this.getPixelData().points, this.topContainer);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    p.drawAngles = function () {
        if (this.points.H.y === this.points.J.y) {
            //only draw one angle
            var centre = new createjs.Point(this.points.G.x, this.points.G.y),
                rad = 80,
                startAngle = Math.PI,
                endAngle = math.slopeAngleRad(this.points.G, this.points.H);

            // negative endangle for canvas y-direction?
            this.topContainer.addChild(new eduk8r.sprites.Arc(centre, rad, startAngle, -endAngle, {
                ccw: false,
                stroke: "#888",
                fill: "white"
            }));

            //draw background rectangle
            var r = new createjs.Shape(),
                w = 20,
                h = 15,
                halfAngle = (startAngle + endAngle) / 2,
                angleDeg = math.toDegrees(startAngle - endAngle),
                angleDeg = (parseFloat(angleDeg)).toPrecision(2),
                halfDeg = math.toDegrees(halfAngle),
                x = this.points.G.x + ((rad + w / 2) * Math.cos(halfAngle)),
                y = this.points.G.y - ((rad + h) * Math.sin(halfAngle));
            this.topContainer.addChild(r);
            r.graphics.f("linen").r(x, y, w, h);

            var txt = new createjs.Text(angleDeg + "\u00B0", "12px Arial", "#333");
            this.topContainer.addChild(txt);
            txt.x = x;
            txt.y = y + h / 6;

        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////

    p.drawBridgeSupports = function () {

        this.bridgeSupportsContainer.removeAllChildren();
        this.view.drawBridgeSupports(this.getPixelData(), this.bridgeSupportsContainer);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    p.handleTruckMove = function (dir) {

        var bitmap = this.truck.bitmap,
            bitmapWidth = bitmap.image.width,
            bitmapScale = bitmap.scaleX,
            currentWidth = bitmapWidth * bitmapScale,
            canvasWidth = $('canvas')[0].width;

        if (dir) {
            switch (dir) {
            case "r":
                //$(bitmap).animate({right: "+=5"});
                bitmap.x += 3;
                break;
            case "l":
                bitmap.x -= 3;
                break;
            }
        }

        //constrain truck movement
        bitmap.y = 0;
        if (bitmap.x < 0) {
            bitmap.x = 0;
        }
        if (bitmap.x + currentWidth > canvasWidth) {
            bitmap.x = canvasWidth - currentWidth;
        }


    };

    //////////////////////////////////////////////////////////////////////////////////////////

    p.initMainContainer = function () {
        //put everything in a container for easier translation
        // this.mainContainer = new createjs.Container();
        this.stage.addChild(this.mainContainer);
        this.mainContainer.y = 265;
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // this is only drawn once
    p.drawTruck = function () {
        this.truck = new eduk8r.sprites.DraggableImage("assets/tank-truck.png", {
            scale: 0.75,
            y: -config.member.THICKNESS / 2
        });
        this.truckContainer.addChild(this.truck);
    }


}(window));
