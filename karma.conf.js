import _ from 'lodash';

export default (config) => {
  const sourceList = config.sourceList.map(pattern => `src/${pattern}`);

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      { pattern: 'node_modules/jquery/dist/jquery.min.js', included: true },
      { pattern: 'node_modules/lodash/lodash.js', included: true },
      'node_modules/babel-polyfill/dist/polyfill.js',
      ...sourceList,
      'tests/helper/*.js',
      'tests/**/*.test.js',
    ],
    reporters: ['coverage', 'progress'],
    plugins: [
      'karma-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-coverage',
      'karma-babel-preprocessor',
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      'tests/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage'],
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: [
          'add-module-exports',
        ],
      },
      moduleId: (moduleName) => {
        let realModuleName = moduleName.path.slice(__dirname.length);

        realModuleName = _.trim(realModuleName.replace('/src', '').split('/').join('.').slice(0, -3), '.');

        if (_.endsWith(realModuleName, '.index')) {
          realModuleName = realModuleName.slice(0, -6);
        }

        if (realModuleName !== 'ppr') {
          realModuleName = `ppr.${realModuleName}`;
        }

        return realModuleName;
      },
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'lcov', subdir: 'lcov' },
      ],
    },
  });
};
