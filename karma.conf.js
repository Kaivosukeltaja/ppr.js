var istanbul = require('browserify-istanbul'),
  _ = require('lodash'),
  bulkify = require('bulkify');

module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon', 'browserify'],
    files: [
      { pattern: 'node_modules/jquery/dist/jquery.min.js', included: true },
      { pattern: 'node_modules/lodash/lodash.min.js', included: true },
      'src/**/*.js',
      'tests/**/*.js'
    ],
    reporters: ['coverage', 'progress'],
    plugins: [
      'karma-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-browserify',
      'karma-coverage'
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      'tests/**/*.js': ['browserify'],
      'src/**/*.js': ['browserify']
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'lcov', subdir: 'lcov' }
      ]
    },
    browserify: {
      transform: [
        'bulkify',
        istanbul()
      ]
    }
  });
};
