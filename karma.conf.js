module.exports = function(config) {
    config.set({

        basePath: '',

        files: [
            'test/**/*.test.js'
        ],

        frameworks: ['mocha', 'browserify', 'chai' ],

        browserify: {
            debug: true
        },

        preprocessors: {
            'test/**/*.test.js': ['browserify']
        },

        reporters: ['progress'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
