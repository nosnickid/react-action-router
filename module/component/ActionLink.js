"use strict";

var React = require('react'),
    Generate = require('../Url').Generate;

function ActionLink(props) {
    return React.createElement('a', {
        href: Generate(props.routeName, props.params)
    }, props.children);
}

module.exports = ActionLink;