requirejs.config({
  baseUrl: '../../',

  paths: {
    jquery: 'bower_components/jquery/dist/jquery.min',
    lodash: 'bower_components/lodash/dist/lodash.min',
    ppr: 'dist/ppr',
    'ppr.component/test_component': 'example/requirejs/test_component',
    'ppr.module/test_module': 'example/requirejs/test_module'
  }
});

require(['ppr'], function(PPR) {
  PPR.loadConfig('../config.json').then(function() {
    PPR.build();
  });
});
