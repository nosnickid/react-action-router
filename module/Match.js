"use strict";

var urllite = require('urllite/lib/core');

var Match = function(route, params) {
    this.routes = [route];
    this.params = params;
};

var Params = function(fnParams, paramsMap) {
    this.functionParams = fnParams;
    this.values = paramsMap;
};

Match.findMatch = function(path, route) {
    return deepMatch(path, route);
};

function extractParams(paramValues, paramSpec) {
    var fnParams, valueMap = {};

    fnParams = paramValues.slice(1, paramSpec.length + 1);

    for(var i = 0; i < paramSpec.length; i++) {
        valueMap[paramSpec[i].name] = fnParams[i];
    }

    return new Params(fnParams, valueMap);
}

function deepMatch(path, route) {
    var values;

    for(var i = 0, len = route.children.length; i < len; i++) {
        var childMatch;

        childMatch = deepMatch(path, route.children[i]);
        if (childMatch) {
            childMatch.routes.unshift(route);
            return childMatch;
        }
    }

    if (route.defaultRoute) {
        values = route.defaultRoute.pattern.exec(path);
        if (values) {
            return new Match(route.defaultRoute, extractParams(values, route.params));
        }
    }

    values = route.pattern.exec(path);
    if (values) {
        return new Match(route, extractParams(values, route.params));
    }

    return null;
}

module.exports = Match;