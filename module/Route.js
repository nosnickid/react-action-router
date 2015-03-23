'use strict';

var Route, DefaultRoute;

Route = function(relativePath, routeName, action, children) {
    this.relativePath = relativePath;
    this.name = routeName;
    this.action = action;

    this.children = children ? [].concat(children) : [];
};

DefaultRoute = function(routeName, action, children) {
    Route.call(this, '', routeName, action, children);
    this.isDefault = true;
};

module.exports = {
    Route:        Route,
    DefaultRoute: DefaultRoute
};
