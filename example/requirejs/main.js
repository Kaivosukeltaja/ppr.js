requirejs.config({
  baseUrl: '../../',

  paths: {
    jquery: 'bower_components/jquery/dist/jquery.min',
    lodash: 'bower_components/lodash/dist/lodash.min',
    ppr: 'dist/ppr',
    'ppr.component/test-component': 'example/requirejs/test-component'
  }
});

require(['ppr'], function(PPR) {
  PPR.loadConfig('../config.json').then(function() {
    PPR.build();
  });
});
