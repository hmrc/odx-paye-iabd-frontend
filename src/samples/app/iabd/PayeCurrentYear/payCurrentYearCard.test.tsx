import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryCard from './payCurrentYearCard';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('payCurrentYearCard Component', () => {
  const details = {
    Status: 'LIVE',
    ActiveOccupationalPension: true,
    EmployerName: 'Aldi',
    StartDate: '1/2/2020',
    EndDate: '2/2/2022',
    P45Amount: '1021',
    EstimatedPay: '202',
    AssignedTaxCode: '123',
    PayRollID: '1234',
    TESLinks: [
      {
        Content: [
          {
            pyKeyString: 'PAYMENT',
            Language: 'EN',
            Name: 'View payments mock',
            pyURLContent: '/mock'
          },
          {
            pyKeyString: 'PAYMENT',
            Language: 'CY',
            Name: 'View payments mock - welsh',
            pyURLContent: '/mock'
          }
        ]
      },
      {
        Content: [
          {
            pyKeyString: 'COMPBENEFIT',
            Language: 'EN',
            Name: 'Update Company Benefits mock',
            pyURLContent: '/mock'
          },
          {
            pyKeyString: 'COMPBENEFIT',
            Language: 'CY',
            Name: 'Update Company Benefits mock - welsh',
            pyURLContent: '/mock'
          }
        ]
      },
      {
        Content: [
          {
            pyKeyString: 'ESTPAY',
            Language: 'EN',
            Name: 'Update Estimated taxable income',
            pyURLContent: '/mockincome'
          },
          {
            pyKeyString: 'ESTPAY',
            Language: 'CY',
            Name: 'Update Estimated taxable income - welsh',
            pyURLContent: '/mockincome'
          }
        ]
      },
      {
        Content: [
          {
            pyKeyString: 'TAXCODE',
            Language: 'EN',
            Name: 'understand tax code mock',
            pyURLContent: '/mocktaxcode'
          },
          {
            pyKeyString: 'TAXCODE',
            Language: 'CY',
            Name: 'understand tax code mock - welsh',
            pyURLContent: '/mocktaxcode'
          }
        ]
      }
    ],
    PAYENumber: '12345',
    EmploymentSequenceNumber: '1',
    EstimatedPayInterruptionFlag: false
  };
  const type = 'currentEmp';
  let t;
  const beginIntrruptionPage = jest.fn();
  const handleNavClick = jest.fn();
  const handleViewAllDetailsClick = jest.fn();
  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();
  });

  test('renders content in english when all the links available', async () => {
    const viewAllDetailsProps = {
      details,
      type,
      handleNavClick,
      handleViewAllDetailsClick,
      beginIntrruptionPage
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <SummaryCard {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('View payments mock')).toBeInTheDocument();
    expect(screen.getByText('Update Estimated taxable income')).toBeInTheDocument();
    expect(screen.getByText('understand tax code mock')).toBeInTheDocument();
  });

  test('renders content in english when all the links not available', async () => {
    details.TESLinks = [];
    const viewAllDetailsProps = {
      details,
      type,
      handleNavClick,
      handleViewAllDetailsClick,
      beginIntrruptionPage
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <SummaryCard {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.queryByText('View payments mock')).toBeNull();
    expect(screen.queryByText('understand tax code mock')).toBeNull();
    expect(screen.queryByText('Update Estimated taxable income')).toBeNull();
  });

  test('renders content in welsh when all the links not available', async () => {
    // Mocking session storage rsdk_locale val and assigning 'cy' welsh value.

    const sessionStorageMock = (() => {
      let store = {};
      return {
        getItem: key => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
        removeItem: key => {
          delete store[key];
        }
      };
    })();

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock
    });
    window.sessionStorage.setItem('rsdk_locale', 'cy');
    details.TESLinks = [
      {
        Content: [
          {
            pyKeyString: 'PAYMENT',
            Language: 'EN',
            Name: 'View payments mock',
            pyURLContent: '/mock'
          },
          {
            pyKeyString: 'PAYMENT',
            Language: 'CY',
            Name: 'View payments mock - welsh',
            pyURLContent: '/mock'
          }
        ]
      }
    ];
    const viewAllDetailsProps = {
      details,
      type,
      handleNavClick,
      handleViewAllDetailsClick,
      beginIntrruptionPage
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <SummaryCard {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('View payments mock - welsh')).toBeInTheDocument();
    expect(screen.queryByText('understand tax code mock - welsh')).toBeNull();
    expect(screen.queryByText('Update Estimated taxable income - welsh')).toBeNull();
  });
});
