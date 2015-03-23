# React Action Router

[![Build Status](https://travis-ci.org/nosnickid/react-action-router.svg?branch=master)](https://travis-ci.org/nosnickid/react-action-router)

An action based URL router for [React.js](http://facebook.github.io/react/) with
[Flux](https://github.com/facebook/flux)

## Principle

In the Flux architecture, UI state is kept in Stores, and these are modified
by Actions.

Client side routing reflects a part of the applications state, and therefore
should interact with Stores.  Since interaction with Stores is otherwise via
Actions, the router also ought to use this.

Hence, react-action-router.
