"use strict";

var RoutesData;

function init(Data) {
    RoutesData = {};

    Data.routes.forEach(function(route) {
        RoutesData[route.name] = route;
    });
}

function findRoute(routeName) {
    if (!RoutesData) {
        throw new Error("Can't findRoute with no routes data");
    } else if (!RoutesData[routeName]) {
        throw new Error("Can't findRoute named " + routeName);
    }

    return RoutesData[routeName];
}

function generateUrl(Route, params) {
    var path = [], node;

    node = Route;

    while(node) {
        var nodePath = node.relativePath;
        if (node.params) {
            node.params.forEach(function(param) {
                nodePath = nodePath.replace(":" + param.name, params[param.name]);
            });
        }
        path.unshift(nodePath);
        node = node.parent;
    }

    return '#!' + path.join("/");
}

module.exports = {
    Register: function(Routes) {
        init(Routes);
    },

    Generate: function(routeName, params) {
        return generateUrl(findRoute(routeName), params);
    }
};