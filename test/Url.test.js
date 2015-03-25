var assert = require('assert'),
    expect = require('chai').expect;

describe('RouteData', function() {
    var RouteData = require('../module/RouteData'),
        Route = require('../module/Route').Route,
        Url = require('../module/Url');

    it('builds simple named paths', function() {
        var routes = new RouteData(
            new Route('', 'Root', undefined, [
                new Route('child', 'Child'),
                new Route('child2', 'Child2')
            ])
        );

        Url.Register(routes);

        expect(Url.Generate('Root')).to.equal('#!');
        expect(Url.Generate('Child')).to.equal('#!/child');
        expect(Url.Generate('Child2')).to.equal('#!/child2');
    });

    it('builds paths with parameters', function() {
        var routes, params;

        routes = new RouteData(
            new Route('', 'Root', undefined, [
                new Route(':someValue', 'Child', undefined, [
                    new Route('more', 'Child2', undefined,[
                        new Route('again', 'Child3', undefined, [
                            new Route(':deeperValue', 'Deep')
                        ])
                    ])
                ])
            ])
        );
        params = {
            someValue: 99,
            deeperValue: 100
        };

        Url.Register(routes);

        expect(Url.Generate('Root')).to.equal('#!');
        expect(Url.Generate('Child', params)).to.equal('#!/99');
        expect(Url.Generate('Deep', params)).to.equal('#!/99/more/again/100');
    });

});