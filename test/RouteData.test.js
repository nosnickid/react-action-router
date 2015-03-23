var assert = require('assert'),
    expect = require('chai').expect;

describe('RouteData', function() {
    var RouteData = require('../module/RouteData'),
        Route = require('../module/Route').Route,
        DefaultRoute = require('../module/Route').DefaultRoute;

    it('starts with a simple route list', function() {
        var routes = new RouteData(new Route('', 'SimpleRoute'));
        expect(routes.routes).to.be.a('array');
        expect(routes.routes.length).to.equal(1);
        expect(routes.routes[0].name).to.equal('SimpleRoute');
        expect(routes.routes[0].path).to.equal('/');
    });

    it('creates children routes', function() {
        var routes = new RouteData(
            new Route('', 'SimpleRoute', null, [
                new Route('child1', 'child1', null),
                new Route('child2', 'child2', null),
            ])
        );
        expect(routes.routes).to.be.a('array');
        expect(routes.routes.length).to.equal(3);
        expect(routes.routes[0].name).to.equal('SimpleRoute');
        expect(routes.routes[0].path).to.equal('/');

        expect(routes.routes[1].name).to.equal('child1');
        expect(routes.routes[1].path).to.equal('/child1');

        expect(routes.routes[2].name).to.equal('child2');
        expect(routes.routes[2].path).to.equal('/child2');
    });

    it('stores child routes in correct order', function() {
        var routes = new RouteData(
            new Route('', 'SimpleRoute', 'a', [
                new Route('', 'directChild1', 'b'),
                new Route('', 'directChild2', 'c'),
                new Route('', 'directChild3', 'd',
                    new Route('', 'multiChild', 'e', [
                        new Route('', 'multiChild1', 'f'),
                        new Route('', 'multiChild2', 'g')
                    ])
                )
            ])
        );

        expect(routes.routes).to.be.a('array');
        expect(routes.routes.length).to.equal(7);

        expect(routes.routes.map(function(x) { return x.name })).to.eql([
            'SimpleRoute','directChild1','directChild2','directChild3',
            'multiChild','multiChild1', 'multiChild2'
        ]);

    });

    it('maps string paths to routes', function() {
        var routes = new RouteData(
            new Route('', 'SimpleRoute', 'a', [
                new Route('dc1', 'directChild1', 'b'),
                new Route('dc2', 'directChild2', 'c'),
                new Route('dc3', 'directChild3', 'd',
                    new Route('mc', 'multiChild', 'e', [
                        new Route('mc1', 'multiChild1', 'f'),
                        new Route('mc2', 'multiChild2', 'g')
                    ])
                )
            ])
        );

        expect(routes.routes.map(function(x) { return x.path })).to.eql([
            '/', '/dc1', '/dc2', '/dc3', '/dc3/mc',
            '/dc3/mc/mc1', '/dc3/mc/mc2'
        ]);

        expect(routes.matchPath('').routes.map(function(x) { return x.name })).to.eql(["SimpleRoute"]);
        expect(routes.matchPath('/').routes.map(function(x) { return x.name })).to.eql(["SimpleRoute"]);
        expect(routes.matchPath('/dc1').routes.map(function(x) { return x.name })).to.eql(["SimpleRoute", "directChild1"]);
        expect(routes.matchPath('/dc3').routes.map(function(x) { return x.name })).to.eql(["SimpleRoute", "directChild3"]);
        expect(routes.matchPath('/dc3/mc').routes.map(function(x) { return x.name })).to.eql(["SimpleRoute", "directChild3", "multiChild"]);
        expect(routes.matchPath('/dc3/mc/mc1').routes.map(function(x) { return x.name })).to.eql(["SimpleRoute", "directChild3", "multiChild", "multiChild1"]);
    });

    it('finds default routes', function() {
        var routes = new RouteData(
                new Route('', 'TopRoute', 'a', [
                    new DefaultRoute('DefaultTop', 'b'),
                    new Route('child', 'Child', 'c')
                ])
        );

        expect(routes.routes.map(function(x) { return x.path })).to.eql([
            '/', '/', '/child'
        ]);

        expect(routes.matchPath('').routes.map(function(x) { return x.name })).to.eql(["TopRoute", "DefaultTop"]);
        expect(routes.matchPath('/').routes.map(function(x) { return x.name })).to.eql(["TopRoute", "DefaultTop"]);
        expect(routes.matchPath('/child').routes.map(function(x) { return x.name })).to.eql(["TopRoute", "Child"]);
    });

    it('passes parameters', function() {
        var match, routes = new RouteData(
            new Route('', 'TopRoute', 'a', [
                new DefaultRoute('DefaultTop', 'b'),
                new Route('child/:childId', 'Child', 'c')
            ])
        );

        expect(routes.routes.map(function(x) { return x.path })).to.eql([
            '/', '/', '/child/:childId'
        ]);

        match = routes.matchPath('/child/1234');
        expect(match.routes.map(function(x) { return x.name })).to.eql(["TopRoute", "Child"]);
        expect(match.params.functionParams).to.eql(['1234']);

    });

});