import chai from 'chai';
import Translation from 'ppr.translation';
import Config from 'ppr.config';

describe('ppr.translation', () => {
  const translations = {
    en: {
      show_more: 'Show more',
      x_months: ':months months',
    },

    fi: {
      show_more: 'Näytä lisää',
    },
  };

  before(() => {
    Config.reset();
    Config.set({
      translations,
    });
  });

  it('should allow getting all translations', () => {
    chai.assert.deepEqual(Translation.getAll(), translations);
  });

  it('should translate with default language', () => {
    chai.assert.equal(Translation.translate('show_more'), 'Show more');
  });

  it('should translate with given language', () => {
    chai.assert.equal(Translation.translate('show_more', {}, 'fi'), 'Näytä lisää');
  });

  it('should translate string with variables', () => {
    chai.assert.equal(Translation.translate('x_months', { months: 3 }), '3 months');
  });
});
