import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import AnnualCodingTemplate from './AnnualCodingTemplate';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { AnalyticsConfigProvider } from 'hmrc-odx-features-and-functions';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const mockApiCallback = jest.fn();

describe('AnnualCodingTemplate component', () => {
  let t;
  afterEach(cleanup);

  const annualCodingTemplateProps = {
    onBack: () => {},
    annualCodingTemplateValue: 'CHECKYOURTAXCODE',
    taxYearStartDate: '06/11/2025',
    handleLinkClick: (link: string) => {}
  };

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();
    t = renderHook(() => useTranslation());
    const { result } = renderHook(() => useHMRCExternalLinks());

    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  describe('When current language is set as English', () => {
    it('Then render AnnualCodingTemplate content in English.', async () => {
      let asFragment;

      await act(async () => {
        const component = render(
          <I18nextProvider i18n={t.result.current.i18n}>
            <AnalyticsConfigProvider apiCallback={mockApiCallback}>
              <AnnualCodingTemplate {...annualCodingTemplateProps} />
            </AnalyticsConfigProvider>
          </I18nextProvider>
        );
        asFragment = component.asFragment;
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('When current language is set as Welsh', () => {
    it('Then render AnnualCodingTemplate content in Welsh.', async () => {
      let asFragment;

      await act(async () => {
        t.result.current.i18n.changeLanguage('cy');

        const component = render(
          <I18nextProvider i18n={t.result.current.i18n}>
            <AnalyticsConfigProvider apiCallback={mockApiCallback}>
              <AnnualCodingTemplate {...annualCodingTemplateProps} />
            </AnalyticsConfigProvider>
          </I18nextProvider>
        );
        asFragment = component.asFragment;
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('When an onBack handler is provided', () => {
    it('Then be called on onBack', async () => {
      const mockOnBack = jest.fn();

      const props = {
        ...annualCodingTemplateProps,
        onBack: mockOnBack
      };

      await act(async () => {
        const onBack = render(
          <I18nextProvider i18n={t.result.current.i18n}>
            <AnalyticsConfigProvider apiCallback={mockApiCallback}>
              <AnnualCodingTemplate {...props} />
            </AnalyticsConfigProvider>
          </I18nextProvider>
        ).getByRole('link', { name: 'Back' });

        fireEvent.click(onBack);
      });

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('When an handleLinkClick handler is provided', () => {
    it('Then be called on handleLinkClick', async () => {
      const mockHandleLinkClick = jest.fn();

      const props = {
        ...annualCodingTemplateProps,
        handleLinkClick: mockHandleLinkClick
      };

      await act(async () => {
        const component = render(
          <I18nextProvider i18n={t.result.current.i18n}>
            <AnalyticsConfigProvider apiCallback={mockApiCallback}>
              <AnnualCodingTemplate {...props} />
            </AnalyticsConfigProvider>
          </I18nextProvider>
        ).getByRole('link', { name: 'Check your details' });

        fireEvent.click(component);
      });

      expect(mockHandleLinkClick).toHaveBeenCalledTimes(1);
    });
  });
});
