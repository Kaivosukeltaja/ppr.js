var Translation = require('../src/ppr.translation'),
  Config = require('../src/ppr.config');

'use strict';

describe('ppr.translation', function() {

  var translations = {
    en: {
      show_more: 'Show more',
      x_months: ':months months'
    },

    fi: {
      show_more: 'Näytä lisää'
    }
  };

  before(function() {
    Config.reset();
    Config.set({
      translations: translations
    });
  });

  it('should allow getting all translations', function() {
    chai.assert.deepEqual(Translation.getAll(), translations);
  });

  it('should translate with default language', function() {
    chai.assert.equal(Translation.translate('show_more'), 'Show more');
  });

  it('should translate with given language', function() {
    chai.assert.equal(Translation.translate('show_more', {}, 'fi'), 'Näytä lisää');
  });

  it('should translate string with variables', function() {
    chai.assert.equal(Translation.translate('x_months', { months: 3 }), '3 months');
  });
});
