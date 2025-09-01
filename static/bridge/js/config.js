/* configuration file for bridgeViewCalc */
var eduk8r = eduk8r || {};
eduk8r.simulations = eduk8r.simulations || {};
eduk8r.simulations.bridgeApp = eduk8r.simulations.bridgeApp || {};

eduk8r.simulations.bridgeApp.config = (function () {
    // initial points that define the bridge, expressed as proportion of canvas width
    var points = {
        A: [0.2, 0],
        B: [0.3, 0],
        C: [0.4, 0],
        D: [0.5, 0],
        E: [0.6, 0],
        F: [0.7, 0],
        G: [0.8, 0],
        // higher is negative :(
        H: [0.7, -0.1],
        I: [0.6, -0.1],
        J: [0.5, -0.1],
        K: [0.4, -0.1],
        L: [0.3, -0.1]
    };

    var alpha = 0.25 // set alpha for ghosted forces

    var member = {
        TENSION: "#556b2f",
        //  TENSION: "#00008b",
        COMPRESSION: "#bb860b",
        // kN at which alpha reaches 1
        ALPHA_1: 75,
        // 1 is full length
        //SCALE: 0.75,
        STROKE: "#333",
        THICKNESS: 12,
        RADIUS: 6
    }

    var sides = {
        FILL: "darkkhaki",
        STROKE: "#333"
    }
    
    var easeParams = {
        m: 7,
        power: 0.5,
        m2: 5,
        power2: 0.45
    }

   

    var truck = {
        // location restraints for the truck so it cannot be pulled off the stage
        MIN_X: 0,
        MAX_X: 1000,
        MIN_Y: 0,
        MAX_Y: 0,
        // front and rear loads from the vehicle and their offsets from left edge of bitmap
        F_OFFSET: 138,
        R_OFFSET: 45,
        F_LOAD: 40,
        R_LOAD: 70
    }

    return {
        points: points,
        member: member,
        truck: truck,
        alpha: alpha,
        sides: sides,
        easeParams: easeParams
    }

}());