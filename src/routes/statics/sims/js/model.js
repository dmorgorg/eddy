var eduk8r = eduk8r || {};
eduk8r.simulations = eduk8r.simulations || {};
eduk8r.simulations.bridgeApp = eduk8r.simulations.bridgeApp || {};

(function () {
    'use strict';

    var app = eduk8r.simulations.bridgeApp,
        truck = app.config.truck;

    app.Model = function () {

            this.data = {
                points: app.config.points,
                truck: {
                    frontAxleLoad: truck.F_LOAD,
                    frontAxleOffset: truck.F_OFFSET,
                    rearAxleLoad: truck.R_LOAD,
                    rearAxleOffset: truck.R_OFFSET
                },
                showTruckForces: false,
                showExternalForces: false,
                showReactions: false,
                showInternalValues: false,
                showInternal: false,
                showJointLabels: false,
                showAngles: false,
                showVectors: false,
                showValues: false,
                showAll: false
            };

        } // end Model constructor 

}());