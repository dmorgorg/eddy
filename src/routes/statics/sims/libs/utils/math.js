var eduk8r = eduk8r || {};
eduk8r.utils = eduk8r.utils || {};

eduk8r.utils.Math = (function () {
    
     /////////////////////////////////////////////////////////////////////////////////////////////
    
    // amplify initial changes in force, then level out
    function ease(number, m, power) {
        return m * Math.pow(number,  power) | 0;
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////

    // returns the angle of the line from pt1 to pt2, ccw from 0,
    // with increasing y in the downward direction, in radians
    var slopeAngleRad = function (pt1, pt2) {
        var p1x = pt1.x,
            p1y = pt1.y,
            p2x = pt2.x,
            p2y = pt2.y;

        // if not vertical
        if (p1x !== p2x) {
            // going rightwards (positive x direction)
            if (p2x > p1x) {
                return Math.atan((p1y - p2y) / (p2x - p1x));
            }
            // going leftwards
            else {
                return Math.PI - Math.atan((p2y - p1y) / (p2x - p1x));
            }
        }
        // vertical line
        else {
            // going down
            if (p2y > p1y) {
                return -Math.PI / 2;
            }
            // going up
            else {
                return Math.PI / 2;
            }
        }
    }
    
    var slopeAngleDeg = function(pt1, pt2){
        return toDegrees(slopeAngleRad(pt1, pt2));
    }

    // returns the distance between two points, in pixels (rounded down to nearest pixel)
    var distance = function (pt1, pt2) {
        return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2)) | 0;
    }

    var toDegrees = function (radians) {
        return radians * 180 / Math.PI;
    }

    var toRadians = function (degrees) {
        return degrees * Math.PI / 180;
    }

    return {
        slopeAngleRad: slopeAngleRad,
        slopeAngleDeg: slopeAngleDeg,
        distance: distance,
        toRadians: toRadians,
        toDegrees: toDegrees,
        ease: ease
    };
    
}());