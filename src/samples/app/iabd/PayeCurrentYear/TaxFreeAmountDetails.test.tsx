import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxFreeAmountDetails from './TaxFreeAmountDetails';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('Tax free amount details component', () => {
  const handleLinkClick = jest.fn();

  afterEach(cleanup);

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();

    // clearing the mock session storage
    window.sessionStorage.clear();
  });

  test('Should render the heading how tax code is caluculated', async () => {
    const allowances = [];
    const personalAllowances = [];
    const deductions = [];
    await act(async () => {
      render(
        <TaxFreeAmountDetails
          allowances={allowances}
          personalAllowances={personalAllowances}
          deductions={deductions}
          handleLinkClick={handleLinkClick}
        />
      );
    });

    expect(screen.getByText('How your tax-free amount is calculated')).toBeInTheDocument();
  });

  test('Should render the personal allowances section', async () => {
    const allowances = [];
    const personalAllowances = [
      {
        Content: [
          {
            pyKeyString: 'personal allowance014',
            Language: 'EN',
            Name: 'Personal Allowance'
          },
          {
            pyKeyString: 'personal allowance014',
            Language: 'CY',
            Name: 'Personal Allowance - Welsh'
          }
        ],
        AdjustedAmount: '12570'
      }
    ];
    const deductions = [];
    await act(async () => {
      render(
        <TaxFreeAmountDetails
          allowances={allowances}
          personalAllowances={personalAllowances}
          deductions={deductions}
          handleLinkClick={handleLinkClick}
        />
      );
    });

    expect(screen.getByText('Personal Allowance')).toBeInTheDocument();
    expect(screen.getByText('£12,570')).toBeInTheDocument();
  });

  test('Should render the current allowances section', async () => {
    const allowances = [
      {
        Content: [
          {
            pyKeyString: 'GiftAidpayments006',
            Language: 'EN',
            Name: 'Gift Aid payments'
          },
          {
            pyKeyString: 'GiftAidpayments006',
            Language: 'CY',
            Name: 'Gift Aid payments - Welsh'
          }
        ],
        AdjustedAmount: '800'
      }
    ];
    const personalAllowances = [];
    const deductions = [];
    await act(async () => {
      render(
        <TaxFreeAmountDetails
          allowances={allowances}
          personalAllowances={personalAllowances}
          deductions={deductions}
          handleLinkClick={handleLinkClick}
        />
      );
    });

    expect(screen.getByText('Gift Aid payments')).toBeInTheDocument();
    expect(screen.getByText('£800')).toBeInTheDocument();
  });

  test('Should render the current deductions section', async () => {
    const allowances = [];
    const personalAllowances = [];
    const deductions = [
      {
        Content: [
          {
            pyKeyString: 'ForcesPension003',
            Language: 'EN',
            Name: 'Forces Pension'
          },
          {
            pyKeyString: 'ForcesPension003',
            Language: 'CY',
            Name: 'Forces Pension- Welsh'
          }
        ],
        AdjustedAmount: '500'
      },
      {
        TESLinks: [
          {
            Content: [
              {
                pyKeyString: 'Underpayment',
                Language: 'EN',
                pyURLContent: '/check-income-tax/previous-underpayment',
                Name: 'Underpayment of £3,000.00 from previous year'
              },
              {
                pyKeyString: 'Underpayment',
                Language: 'CY',
                pyURLContent: '/check-income-tax/previous-underpayment',
                Name: 'Underpayment of  £3,000.00 from previous year'
              }
            ]
          }
        ],
        Content: [
          {
            pyKeyString: 'Underpaymentamount035',
            Language: 'EN',
            Name: 'Underpayment amount'
          },
          {
            pyKeyString: 'Underpaymentamount035',
            Language: 'CY',
            Name: 'Underpayment amount- Welsh'
          }
        ],
        AdjustedAmount: '600'
      }
    ];
    await act(async () => {
      render(
        <TaxFreeAmountDetails
          allowances={allowances}
          personalAllowances={personalAllowances}
          deductions={deductions}
          handleLinkClick={handleLinkClick}
        />
      );
    });

    expect(screen.getByText('Forces Pension')).toBeInTheDocument();
    expect(screen.getByText('£500')).toBeInTheDocument();
    expect(screen.getByText('Underpayment of £3,000.00 from previous year')).toBeInTheDocument();
    expect(screen.getByText('£600')).toBeInTheDocument();
    const link = screen.getByText('Underpayment of £3,000.00 from previous year');
    fireEvent.click(link);
    expect(handleLinkClick).toHaveBeenCalledWith('/check-income-tax/previous-underpayment');
  });
});
