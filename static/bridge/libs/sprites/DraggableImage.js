/*  version 0.8.0 of easeljs makes inheritance much simpler 
    see http://createjs.com/tutorials/Inheritance/ for details */

var eduk8r = eduk8r || {};
eduk8r.sprites = eduk8r.sprites || {};

(function () {

    'use strict';

    eduk8r.sprites.DraggableImage = function (img, obj) {
        this.Container_constructor();

        this.img = img;
        // if object passed in, clone it so that the argument 
        // is not inadvertantly modified
        this.obj = (obj == null ? {} : JSON.parse(JSON.stringify(obj)));
        this.x = (obj.x == null ? 0 : obj.x);
        this.y = (obj.y == null ? 0 : obj.y);
        this.obj.scale = (obj.scale == null ? 1 : obj.scale);
        this.update = true;
        this.bitmap;
        this.over = false;
        this.active = false;
        this._x = 0;
        this.setup();
    };

    // inherit from Container
    var p = createjs.extend(eduk8r.sprites.DraggableImage, createjs.Container);

    p.setup = function () {
        var self = this;
        var image = new Image();
        image.src = this.img;
        image.onload = handleImageLoad;

        function handleImageLoad(event) {

            var img = event.target,
                b = new createjs.Bitmap(img);
            
            b.cursor = "pointer";
            b.scaleX = b.scaleY = self.obj.scale;
            // make registration point bottom left of image 
            b.regX = 0;
            b.regY = b.image.height;
            // make bitmap accessible from outside this class
            self.bitmap = b;
            self.addChild(b);

            // using "on" binds the listener to the scope of the currentTarget by default
            // in this case that means it executes in the scope of the shape.
            b.on("mousedown", function (evt) {
                b.parent.addChild(b);
                b.offset = {
                    x: b.x - evt.stageX,
                    y: b.y - evt.stageY
                };
                self.active = true;
                b.alpha = 0.75;
            });

            // the pressmove event is dispatched when the mouse moves after 
            // a mousedown on the target until the mouse is released.
            b.on("pressmove", function (evt) {
                b.x = evt.stageX + b.offset.x;
                b.y = evt.stageY + b.offset.y;
                // a reference to the bitmap that can be accessed externally
                self.bitmap = this;
                // indicate that the stage should be updated on the next tick:
                self.update = true;
            });

            b.on("mouseover", function (evt) {
                self.over = true;
                if (!self.active) {
                    self.update = true;
                    b.alpha = 0.75;
                }
            });

            b.on("mouseout", function (evt) {
                self.over = false;
                if (!self.active) {
                    b.alpha = 1;
                    self.update = true;
                }
            });

            b.on("pressup", function (evt) {
                // if the mouse is released and the mouse is not over
                // the image, nor the image is active, set alpha back
                // to 1 to indicate inactive status
                if (self.active && !self.over) {
                    b.alpha = 1;
                }
                self.active = false;
                self.update = true;
            });

        }
    }
    window.eduk8r.sprites.DraggableImage = createjs.promote(eduk8r.sprites.DraggableImage, "Container");
}());