import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxCodeExplainerWFP from './TaxCodeExplainerWFP';

const tMock = jest.fn(k => k);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock })
}));

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn().mockResolvedValue({
    serverConfig: {
      sdkContentServerUrl: 'http://mock-content-server',
      sdkHmrcURL: 'http://mock-hmrc-url'
    }
  })
}));

const setPageTitleMock = jest.fn();
jest.mock('../../../../../components/helpers/setPageTitleHelpers', () => ({
  __esModule: true,
  default: () => setPageTitleMock()
}));

const scrollToTopMock = jest.fn();
const formatCurrencyMock = jest.fn((value, truncate) =>
  truncate ? `£${value}-trunc` : `£${value}`
);

jest.mock('../../../../../components/helpers/utils', () => ({
  scrollToTop: () => scrollToTopMock(),
  formatCurrency: (value, truncate) => formatCurrencyMock(value, truncate)
}));

jest.mock('../../../../../components/helpers/hooks/useServiceShuttered', () => ({
  __esModule: true,
  default: () => ({
    serviceShuttered: false,
    isLoading: false
  })
}));

jest.mock('hmrc-odx-features-and-functions', () => ({
  withPageTracking: Component => Component
}));

const renderWFP = (props = {}) => {
  return render(
    <TaxCodeExplainerWFP
      taxCodeSourceAmount='600'
      incomeThreshold={2000}
      nextTaxStartYear={2025}
      comingFromPage='UnderstandYourTaxCodePage'
      redirectToUnderstandYourTaxPage={jest.fn()}
      redirectToViewTimelineDetailsPage={jest.fn()}
      {...props}
    />
  );
};

describe('TaxCodeExplainerWFP behaviour', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the explainer page loads', () => {
    it('Then it sets the page title and scrolls to the top', () => {
      renderWFP();

      expect(setPageTitleMock).toHaveBeenCalledTimes(1);
      expect(scrollToTopMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Given the user clicks the back link', () => {
    it('When coming from UnderstandYourTaxCodePage Then it redirects to the understand page', () => {
      const redirectMock = jest.fn();

      renderWFP({
        comingFromPage: 'UnderstandYourTaxCodePage',
        redirectToUnderstandYourTaxPage: redirectMock
      });

      const backLink = screen.getByRole('link', { name: 'BACK' });
      fireEvent.click(backLink);

      fireEvent.click(backLink);

      expect(redirectMock).toHaveBeenCalled();
    });

    it('When coming from other pages Then it redirects to the timeline page', () => {
      const redirectTimeline = jest.fn();

      renderWFP({
        comingFromPage: 'OtherPage',
        redirectToViewTimelineDetailsPage: redirectTimeline
      });

      const backLink = screen.getByRole('link', { name: 'BACK' });
      fireEvent.click(backLink);

      fireEvent.click(backLink);

      expect(redirectTimeline).toHaveBeenCalled();
    });
  });

  describe('Given winter fuel payment details are displayed', () => {
    it('Then key translation strings are used', () => {
      renderWFP();

      const expectedKeys = [
        'YOU_AUTOMATICALLY_RECEIVED',
        'PAYMENT_TO_HELP_WHC',
        'THIS_IS_WFP_BRITAIN_PENSION_SCOTLAND',
        'IT_PAID_BY_DWP',
        'IF_INCOME_OVER',
        'YOU_NEED_PAY_THIS_TAX_CODE',
        'HOW_WE_COLLECT_PAYMENT',
        'TO_COLLECT_OWE_ADJUSTED_YOUR_TAX_CODE'
      ];

      expectedKeys.forEach(key => {
        expect(tMock).toHaveBeenCalledWith(key);
      });
    });

    it('Then numeric values are formatted correctly', () => {
      renderWFP({
        taxCodeSourceAmount: '600',
        incomeThreshold: 2000
      });

      expect(formatCurrencyMock).toHaveBeenCalledWith('600', undefined);
      expect(formatCurrencyMock).toHaveBeenCalledWith(2000, true);
    });
  });
});
