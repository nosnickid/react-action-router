'use strict';

var Route = require('./Route'),
    RouteData = require('./RouteData'),
    Browser = require('./Browser'),
    Url = require('./Url'),
    ActionLink = require('./component/ActionLink'),
    State;

function onRouteChange(match) {
    State = match;

    if (match) {
        match.routes.forEach(function(route) {
            if (route.action) {
                route.action.apply(null, match.params.functionParams);
            }
        });
    }
}

module.exports = {
    Route: function(relativePath, routeName, action, children) {
        return new Route.Route(relativePath, routeName, action, children);
    },
    DefaultRoute: function(routeName, action, children) {
        return new Route.DefaultRoute(routeName, action, children);
    },

    Init: function (RootRoute) {
        var routes = new RouteData(RootRoute);
        Browser.Register(routes, onRouteChange);
        Url.Register(routes);
        return routes;
    },

    State: function() {
        return State;
    },

    ActionLink: ActionLink

};
