(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactActionRouter"] = factory(require("react"));
	else
		root["ReactActionRouter"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Route = __webpack_require__(1),
	    RouteData = __webpack_require__(2),
	    Browser = __webpack_require__(3),
	    Url = __webpack_require__(4),
	    ActionLink = __webpack_require__(5),
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

	    NavigateTo: Browser.NavigateTo,

	    ActionLink: ActionLink

	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var pathToRegexp = __webpack_require__(8),
	    Match = __webpack_require__(7),
	    DefaultRoute = __webpack_require__(1).DefaultRoute;

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



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Url = __webpack_require__(4),
	    Routes, State;

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
	    NavigateTo: function(routeName, params) {
	        var url = Url.Generate(routeName, params);
	        if (url) {
	            window.location.hash = url;
	        } else {
	            throw new Error("Can't find route" + routeName);
	        }
	    },

	    State: State
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(6),
	    Generate = __webpack_require__(4).Generate;

	var ActionLink = React.createClass({
	    render: function() {
	        return React.createElement('a', {
	            href: Generate(this.props.routeName, this.props.params)
	        }, this.props.children);
	    }
	});

	module.exports = ActionLink;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var urllite = __webpack_require__(9);

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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(10);

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp;

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
	  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
	  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
	  // Match regexp special characters that are always escaped.
	  '([.+*?=^!:${}()[\\]|\\/])'
	].join('|'), 'g');

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys;
	  return re;
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i';
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g);

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name:      i,
	        delimiter: null,
	        optional:  false,
	        repeat:    false
	      });
	    }
	  }

	  return attachKeys(path, keys);
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = [];

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source);
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
	  return attachKeys(regexp, keys);
	}

	/**
	 * Replace the specific tags with regexp strings.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @return {String}
	 */
	function replacePath (path, keys) {
	  var index = 0;

	  function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
	    if (escaped) {
	      return escaped;
	    }

	    if (escape) {
	      return '\\' + escape;
	    }

	    var repeat   = suffix === '+' || suffix === '*';
	    var optional = suffix === '?' || suffix === '*';

	    keys.push({
	      name:      key || index++,
	      delimiter: prefix || '/',
	      optional:  optional,
	      repeat:    repeat
	    });

	    prefix = prefix ? ('\\' + prefix) : '';
	    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

	    if (repeat) {
	      capture = capture + '(?:' + prefix + capture + ')*';
	    }

	    if (optional) {
	      return '(?:' + prefix + '(' + capture + '))?';
	    }

	    // Basic parameter support.
	    return prefix + '(' + capture + ')';
	  }

	  return path.replace(PATH_REGEXP, replace);
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || [];

	  if (!isArray(keys)) {
	    options = keys;
	    keys = [];
	  } else if (!options) {
	    options = {};
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options);
	  }

	  if (isArray(path)) {
	    return arrayToRegexp(path, keys, options);
	  }

	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = replacePath(path, keys);
	  var endsWithSlash = path.charAt(path.length - 1) === '/';

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
	  }

	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
	  }

	  return attachKeys(new RegExp('^' + route, flags(options)), keys);
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var URL, URL_PATTERN, defaults, urllite,
	    __hasProp = {}.hasOwnProperty;

	  URL_PATTERN = /^(?:(?:([^:\/?\#]+:)\/+|(\/\/))(?:([a-z0-9-\._~%]+)(?::([a-z0-9-\._~%]+))?@)?(([a-z0-9-\._~%!$&'()*+,;=]+)(?::([0-9]+))?)?)?([^?\#]*?)(\?[^\#]*)?(\#.*)?$/;

	  urllite = function(raw, opts) {
	    return urllite.URL.parse(raw, opts);
	  };

	  urllite.URL = URL = (function() {
	    function URL(props) {
	      var k, v, _ref;
	      for (k in defaults) {
	        if (!__hasProp.call(defaults, k)) continue;
	        v = defaults[k];
	        this[k] = (_ref = props[k]) != null ? _ref : v;
	      }
	      this.host || (this.host = this.hostname && this.port ? "" + this.hostname + ":" + this.port : this.hostname ? this.hostname : '');
	      this.origin || (this.origin = this.protocol ? "" + this.protocol + "//" + this.host : '');
	      this.isAbsolutePathRelative = !this.host && this.pathname.charAt(0) === '/';
	      this.isPathRelative = !this.host && this.pathname.charAt(0) !== '/';
	      this.isRelative = this.isSchemeRelative || this.isAbsolutePathRelative || this.isPathRelative;
	      this.isAbsolute = !this.isRelative;
	    }

	    URL.parse = function(raw) {
	      var m, pathname, protocol;
	      m = raw.toString().match(URL_PATTERN);
	      pathname = m[8] || '';
	      protocol = m[1];
	      return new urllite.URL({
	        protocol: protocol,
	        username: m[3],
	        password: m[4],
	        hostname: m[6],
	        port: m[7],
	        pathname: protocol && pathname.charAt(0) !== '/' ? "/" + pathname : pathname,
	        search: m[9],
	        hash: m[10],
	        isSchemeRelative: m[2] != null
	      });
	    };

	    return URL;

	  })();

	  defaults = {
	    protocol: '',
	    username: '',
	    password: '',
	    host: '',
	    hostname: '',
	    port: '',
	    pathname: '',
	    search: '',
	    hash: '',
	    origin: '',
	    isSchemeRelative: false
	  };

	  module.exports = urllite;

	}).call(this);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ }
/******/ ])
});
;