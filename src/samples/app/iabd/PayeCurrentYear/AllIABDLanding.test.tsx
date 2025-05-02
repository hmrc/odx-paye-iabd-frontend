import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import AllIABDLanding from './AllIABDLanding';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const goBack = jest.fn();
const handleLinkClick = jest.fn();

describe('AllIABDLanding Component', () => {
  const mockGetPageDataAsync = jest.fn();
  const PCoreMock = {
    getDataPageUtils: () => ({
      getPageDataAsync: mockGetPageDataAsync
    })
  };

  let t;

  afterEach(() => {
    jest.resetAllMocks();

    delete (global as any).PCore;
  });

  beforeEach(async () => {
    (global as any).PCore = PCoreMock;

    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();

    const { result } = renderHook(() => useHMRCExternalLinks());

    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  const AllIABDLandingProps = {
    goBack,
    handleLinkClick
  };

  const mockData = {
    Customer: {
      TaxSummaryList: [
        {
          CurrentBenefitsList: [
            {
              EmploymentName: 'Not available',

              Amount: 10.54,
              Content: [
                {
                  pyKeyString: 'CarFuelBenefit029',
                  Language: 'EN',
                  Name: 'Car Fuel Benefit'
                },
                {
                  pyKeyString: 'CarFuelBenefit029',
                  Language: 'CY',
                  Name: 'Car Fuel Benefit1'
                }
              ]
            }
          ],
          CurrentIncomeList: [
            {
              Amount: 10.56,
              Content: [
                {
                  pyKeyString: 'NonCodedIncome019',
                  Language: 'EN',
                  Name: 'Non-Coded Income'
                },
                {
                  pyKeyString: 'NonCodedIncome019',
                  Language: 'CY',
                  Name: 'Incwm Heb ei Godio'
                }
              ],
              TESLinks: [
                {
                  Content: [
                    {
                      Language: 'EN',
                      pyURLContent: '/mock',
                      Name: 'mock name'
                    },
                    {
                      Language: 'CY',
                      pyURLContent: '/mock',
                      Name: 'mock name'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  };

  test('renders content properly', async () => {
    mockGetPageDataAsync.mockResolvedValue(mockData);

    await act(async () => {
      t.result.current.i18n?.changeLanguage('EN');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDLanding {...AllIABDLandingProps} />
        </I18nextProvider>
      );
    });
    const spanElementWel = screen.getByText('mock name Non-Coded Income');
    expect(spanElementWel).toBeInTheDocument();
    expect(spanElementWel).toHaveClass('govuk-visually-hidden');

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('View and update information HMRC has about you')).toBeInTheDocument();
    expect(screen.getAllByText('Income')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Item')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Amount')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Actions')[0]).toBeInTheDocument();
    expect(screen.getByText('Non-Coded Income')).toBeInTheDocument();
    expect(screen.getByText('£10.56')).toBeInTheDocument();
    expect(screen.getByText('No actions')[0]).toBeInTheDocument();
    expect(screen.getByText('Allowances')).toBeInTheDocument();
    expect(screen.getByText('You have no allowances.')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Employment')).toBeInTheDocument();
    expect(screen.getByText('Car Fuel Benefit')).toBeInTheDocument();
    expect(screen.getByText('Deductions')).toBeInTheDocument();
    expect(screen.getByText('You have no deductions.')).toBeInTheDocument();
  });

  test('renders error content properly for english when pyErrors came in API response', async () => {
    mockGetPageDataAsync.mockResolvedValue({
      pyErrors: {
        pyMessages: [
          {
            pyErrorMessage: [
              {
                msg: 'error'
              }
            ]
          }
        ]
      }
    });

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDLanding {...AllIABDLandingProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Sorry, the service is unavailable')).toBeInTheDocument();
    expect(screen.getByText('You will be able to use the service later.')).toBeInTheDocument();
  });

  test('renders error content properly for welsh when pyErrors came in API response', async () => {
    mockGetPageDataAsync.mockResolvedValue({
      pyErrors: {
        pyMessages: [
          {
            pyErrorMessage: [
              {
                msg: 'error'
              }
            ]
          }
        ]
      }
    });

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDLanding {...AllIABDLandingProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Yn ôl')).toBeInTheDocument();
    expect(
      screen.getByText('Mae’n ddrwg gennym, ond nid yw’r gwasanaeth ar gael')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Byddwch yn gallu defnyddio’r gwasanaeth yn nes ymlaen.')
    ).toBeInTheDocument();
  });
});
