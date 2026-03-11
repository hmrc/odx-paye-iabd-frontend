import isKnownExplainerPage from './DeductionUtils';

describe('Given a page identifier is provided', () => {
  describe('When the page is a supported explainer page', () => {
    it('then the provided page is recognised as a known explainer page', () => {
      expect(isKnownExplainerPage('untaxedsavingsinterest')).toBe(true);
      expect(isKnownExplainerPage('winterfuelpaymentcharge')).toBe(true);
    });
  });

  describe('When the page is not a supported explainer page', () => {
    it('then the provided page is treated as an unknown explainer page', () => {
      expect(isKnownExplainerPage('someotherpage')).toBe(false);
    });
  });

  describe('When the page identifier is empty', () => {
    it('then the provided page is treated as an unknown explainer page', () => {
      expect(isKnownExplainerPage('')).toBe(false);
    });
  });
});
