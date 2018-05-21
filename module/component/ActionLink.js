"use strict";

var React = require('react'),
    Generate = require('../Url').Generate;

function ActionLink(props) {
    return React.createElement('a', {
        href: Generate(this.props.routeName, this.props.params)
    }, this.props.children);
}

module.exports = ActionLink;