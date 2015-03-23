'use strict';

var pathToRegexp = require('path-to-regexp/index'),
    Match = require('./Match'),
    DefaultRoute = require('./Route').DefaultRoute;

function initFrom(RouteData, RootRoute) {
    var pending = [], item;

    pending.push([
        [''],
        RootRoute,
        null
    ]);

    while (item = pending.shift()) {
        var path, route, parent, pattern, keys, pathStr, nextPath;

        path = item[0];
        route = item[1];
        parent = item[2];

        keys = [];
        pathStr = path.join("/");
        if (pathStr == '') pathStr = '/';
        pattern = pathToRegexp(pathStr, keys);

        route.path = pathStr;
        route.pattern = pattern;
        route.params = keys;
        route.parent = parent;

        if (parent && route instanceof DefaultRoute) {
            parent.defaultRoute = route;
        }

        route.children.forEach(function (child) {
            nextPath = path.slice(0);
            nextPath.push(child.relativePath);
            pending.push([nextPath, child, route]);
        });

        RouteData.routes.push(route);
    }

    return RouteData;
}

var RouteData = function(RootRoute) {
    this.routes = [];
    this.root = RootRoute;
    initFrom(this, RootRoute);
};

RouteData.prototype.matchPath = function(path) {
    return Match.findMatch(path, this.root);
};

module.exports = RouteData;

