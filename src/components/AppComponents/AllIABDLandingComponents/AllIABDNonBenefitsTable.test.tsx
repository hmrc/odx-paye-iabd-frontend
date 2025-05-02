import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { CurrentListOBJ } from '../../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';
import AllIABDNonBenefitsTable from './AllIABDNonBenefitsTable';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const handleLinkClick = jest.fn();

describe('ALL IABD Non Benefits component', () => {
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

  test('renders income section', async () => {
    const mockData: CurrentListOBJ[] = [
      {
        EmploymentName: 'EmploymentName mock',
        Amount: 10.56,
        Content: [
          {
            pyKeyString: 'Income019',
            Language: 'EN',
            Name: 'Income'
          },
          {
            pyKeyString: 'Income019',
            Language: 'CY',
            Name: 'Income welsh'
          }
        ],
        TESLinks: [
          {
            Content: [
              {
                pyKeyString: 'MockString',
                Language: 'EN',
                pyURLContent: '/mock',
                Name: 'mock name'
              },
              {
                pyKeyString: 'MockString',
                Language: 'CY',
                pyURLContent: '/mock',
                Name: 'mock name'
              }
            ]
          }
        ]
      }
    ];

    await act(async () => {
      t.result.current.i18n?.changeLanguage('EN');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDNonBenefitsTable
            nonBenefitList={mockData}
            nonBenefitType='income'
            handleLinkClick={handleLinkClick}
          />
        </I18nextProvider>
      );
    });
    const spanElementWel = screen.getByText('mock name Income');
    expect(spanElementWel).toBeInTheDocument();
    expect(spanElementWel).toHaveClass('govuk-visually-hidden');
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('mock name')).toBeInTheDocument();
    expect(screen.getByText('£10.56')).toBeInTheDocument();
    const link = screen.getByText('mock name');
    fireEvent.click(link);
    expect(handleLinkClick).toHaveBeenCalledWith('/mock');
  });

  test('renders allowance section', async () => {
    const mockData: CurrentListOBJ[] = [
      {
        EmploymentName: 'Mock Emp',
        Amount: 10.56,
        Content: [
          {
            pyKeyString: 'Allowance019',
            Language: 'EN',
            Name: 'allowance'
          },
          {
            pyKeyString: 'Allowance019',
            Language: 'CY',
            Name: 'allowance welsh'
          }
        ],
        TESLinks: [
          {
            Content: [
              {
                pyKeyString: 'MockString',
                Language: 'EN',
                pyURLContent: '/mock',
                Name: 'mock name'
              },
              {
                pyKeyString: 'MockString',
                Language: 'CY',
                pyURLContent: '/mock',
                Name: 'mock name'
              }
            ]
          }
        ]
      }
    ];

    await act(async () => {
      t.result.current.i18n?.changeLanguage('EN');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDNonBenefitsTable
            nonBenefitList={mockData}
            nonBenefitType='allowance'
            handleLinkClick={handleLinkClick}
          />
        </I18nextProvider>
      );
    });
    const spanElementWel = screen.getByText('mock name allowance');
    expect(spanElementWel).toBeInTheDocument();
    expect(spanElementWel).toHaveClass('govuk-visually-hidden');
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('allowance')).toBeInTheDocument();
    expect(screen.getByText('mock name')).toBeInTheDocument();
    expect(screen.getByText('£10.56')).toBeInTheDocument();
    const link = screen.getByText('mock name');
    fireEvent.click(link);
    expect(handleLinkClick).toHaveBeenCalledWith('/mock');
  });

  test('renders deductions section', async () => {
    const mockData: CurrentListOBJ[] = [
      {
        Amount: 10.56,
        Content: [
          {
            pyKeyString: 'Deductions019',
            Language: 'EN',
            Name: 'deductions'
          },
          {
            pyKeyString: 'Deductions019',
            Language: 'CY',
            Name: 'deductions welsh'
          }
        ],
        TESLinks: [
          {
            Content: [
              {
                pyKeyString: 'MockString',
                Language: 'EN',
                pyURLContent: '/mock',
                Name: 'mock name'
              },
              {
                pyKeyString: 'MockString',
                Language: 'CY',
                pyURLContent: '/mock',
                Name: 'mock name'
              }
            ]
          }
        ]
      }
    ];

    await act(async () => {
      t.result.current.i18n?.changeLanguage('EN');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDNonBenefitsTable
            nonBenefitList={mockData}
            nonBenefitType='deductions'
            handleLinkClick={handleLinkClick}
          />
        </I18nextProvider>
      );
    });
    const spanElementWel = screen.getByText('mock name deductions');
    expect(spanElementWel).toBeInTheDocument();
    expect(spanElementWel).toHaveClass('govuk-visually-hidden');
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('deductions')).toBeInTheDocument();
    expect(screen.getByText('mock name')).toBeInTheDocument();
    expect(screen.getByText('£10.56')).toBeInTheDocument();
    const link = screen.getByText('mock name');
    fireEvent.click(link);
    expect(handleLinkClick).toHaveBeenCalledWith('/mock');
  });

  test('renders no deduction present when no deductions', async () => {
    const mockData = [];

    await act(async () => {
      t.result.current.i18n?.changeLanguage('EN');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDNonBenefitsTable
            nonBenefitList={mockData}
            nonBenefitType='deductions'
            handleLinkClick={handleLinkClick}
          />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('You have no deductions.')).toBeInTheDocument();
  });

  test('renders no income present when there are no incomes', async () => {
    const mockData = [];

    await act(async () => {
      t.result.current.i18n?.changeLanguage('EN');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <AllIABDNonBenefitsTable
            nonBenefitList={mockData}
            nonBenefitType='incomes'
            handleLinkClick={handleLinkClick}
          />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('You have no income from other sources.')).toBeInTheDocument();
  });
});
