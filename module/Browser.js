'use strict';

var Routes, State;

State = null;

function handleHashChange(handler) {
    var hash, match;

    hash = window.location.hash.substr(2);
    match = Routes.matchPath(hash);

    if (match) {
        handler(match);
    }
}

module.exports = {
    Register: function(RouteData, handler, autoStart) {
        Routes = RouteData;
        window.addEventListener('hashchange', handleHashChange.bind(null, handler));
        if (autoStart || autoStart === undefined) handleHashChange(handler);
    },
    State: State
};