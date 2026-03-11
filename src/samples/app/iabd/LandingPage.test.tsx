import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';
import { AnalyticsConfigProvider } from 'hmrc-odx-features-and-functions';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn().mockResolvedValue({
    serverConfig: {
      sdkContentServerUrl: 'http://mock-content-server',
      sdkHmrcURL: 'http://mock-hmrc-url'
    }
  })
}));

describe('LandingPage annualCoding CIPAttributes', () => {
  const baseProps = {
    redirectCurrentYearPage: jest.fn(),
    handleLinkClick: jest.fn(),
    redirectAnnualCodingTemplatePage: jest.fn(),
    annualCodingData: {
      Customer: {
        TaxSummaryList: [
          {
            AnnualCodingAvailable: 'yes',
            TaxYearStartDate: '2026-04-06',
            TaxYearEndDate: '2027-04-05',
            pyTemplateDataField: ''
          }
        ]
      }
    },
    userFullName: 'Test User'
  };

  const mockApiCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('includes tracking attributes when templateValue is empty', () => {
    render(
      <AnalyticsConfigProvider apiCallback={mockApiCallback}>
        <LandingPage {...baseProps} />
      </AnalyticsConfigProvider>
    );

    const link = screen.getByRole('link', { name: /CHECK_NEXT_TAX_YEAR/i });
    expect(link).toHaveAttribute('data-tracking-type', 'Outbound');
    expect(link).toHaveAttribute(
      'data-tracking-target',
      expect.stringContaining('/check-income-tax/income-tax-comparison')
    );
  });

  test('does NOT include tracking attributes when templateValue is provided', () => {
    const propsWithTemplate = {
      ...baseProps,
      annualCodingData: {
        Customer: {
          TaxSummaryList: [
            {
              AnnualCodingAvailable: 'yes',
              TaxYearStartDate: '2026-04-06',
              TaxYearEndDate: '2027-04-05',
              pyTemplateDataField: 'CHECKYOURTAXCODE'
            }
          ]
        }
      }
    };

    render(
      <AnalyticsConfigProvider apiCallback={mockApiCallback}>
        <LandingPage {...propsWithTemplate} />
      </AnalyticsConfigProvider>
    );

    const link = screen.getByRole('link', { name: /CHECK_NEXT_TAX_YEAR/i });
    expect(link).not.toHaveAttribute('data-tracking-type');
    expect(link).not.toHaveAttribute('data-tracking-target');
  });

  test('spread operator applies attributes into the DOM', () => {
    render(
      <AnalyticsConfigProvider apiCallback={mockApiCallback}>
        <LandingPage {...baseProps} />
      </AnalyticsConfigProvider>
    );

    const link = screen.getByRole('link', { name: /CHECK_NEXT_TAX_YEAR/i });
    expect(link.getAttributeNames()).toEqual(
      expect.arrayContaining(['data-tracking-type', 'data-tracking-target'])
    );
  });
});
