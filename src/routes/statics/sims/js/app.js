/*  
    Bridge is instantiated from the function handling dom ready
    in events.js */
var eduk8r = eduk8r || {};
eduk8r.simulations = eduk8r.simulations || {};
eduk8r.simulations.bridgeApp = eduk8r.simulations.bridgeApp || {};

(function () {
    'use strict';

    var app = eduk8r.simulations.bridgeApp;

    app.Bridge = function (name) {
        
        // model to hold state of app
        this.model = new app.Model(name);
        
        // handles the drawing of the canvas as directed by the controller
        this.view = new app.View();
        
        //  model and view gobetween
        this.controller = new app.Controller(this.model, this.view);
    }

    $(window).load(function () {
        var bridge = new eduk8r.simulations.bridgeApp.Bridge("bridgeApp");        
    });

}());