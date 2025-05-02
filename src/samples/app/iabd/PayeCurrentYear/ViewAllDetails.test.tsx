import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewAllDetails from './ViewAllDetails';
import { I18nextProvider, useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const redirectCurrentYearPage = jest.fn();
const handleLinkClick = jest.fn();

describe('ViewAllDetails Component', () => {
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

  let t;
  const beginIntrruptionPage = jest.fn();
  const handleNavClick = jest.fn();
  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();

    const { result } = renderHook(() => useHMRCExternalLinks());

    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  test('renders content properly for pension with ceased status', async () => {
    details.Status = 'CEASED';
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Pension details for Aldi')).toBeInTheDocument();
    expect(screen.getByText('2 February 2022')).toBeInTheDocument();
    expect(screen.getByText('£1,021.00')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('End date')).toBeInTheDocument();
    expect(screen.getByText('P45 amount')).toBeInTheDocument();
    expect(screen.getByText('Tax code')).toBeInTheDocument();
    expect(screen.getByText('Payroll number')).toBeInTheDocument();
    expect(screen.getByText('Employer PAYE reference')).toBeInTheDocument();
  });

  test('renders content properly for pension with live status', async () => {
    details.Status = 'LIVE';
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Pension details for Aldi')).toBeInTheDocument();
    expect(screen.getByText('2 January 2020')).toBeInTheDocument();
    expect(screen.getByText('£202.00')).toBeInTheDocument();
    expect(screen.getByText('Update Estimated taxable income')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Tax code')).toBeInTheDocument();
    expect(screen.getByText('Payroll number')).toBeInTheDocument();
    expect(screen.getByText('Employer PAYE reference')).toBeInTheDocument();
    expect(screen.getByText('Other actions')).toBeInTheDocument();
    expect(screen.getByText('View payments mock')).toBeInTheDocument();
    expect(screen.getByText('Update Company Benefits mock')).toBeInTheDocument();
    expect(screen.getByText('understand tax code mock')).toBeInTheDocument();
  });

  test('renders content properly for employment with live status', async () => {
    details.Status = 'LIVE';
    details.ActiveOccupationalPension = false;
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Employment details for Aldi')).toBeInTheDocument();
    expect(screen.getByText('2 January 2020')).toBeInTheDocument();
    expect(screen.getByText('£202.00')).toBeInTheDocument();
    expect(screen.getByText('Update Estimated taxable income')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Tax code')).toBeInTheDocument();
    expect(screen.getByText('Payroll number')).toBeInTheDocument();
    expect(screen.getByText('Employer PAYE reference')).toBeInTheDocument();
  });

  test('renders content properly for employment with ceased status', async () => {
    details.Status = 'CEASED';
    details.ActiveOccupationalPension = false;
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Employment details for Aldi')).toBeInTheDocument();
    expect(screen.getByText('2 February 2022')).toBeInTheDocument();
    expect(screen.getByText('£1,021.00')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('End date')).toBeInTheDocument();
    expect(screen.getByText('P45 amount')).toBeInTheDocument();
    expect(screen.getByText('Tax code')).toBeInTheDocument();
    expect(screen.getByText('Payroll number')).toBeInTheDocument();
    expect(screen.getByText('Employer PAYE reference')).toBeInTheDocument();
  });

  test('renders content properly for employment for welsh', async () => {
    details.Status = 'CEASED';
    details.ActiveOccupationalPension = false;
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Yn ôl')).toBeInTheDocument();
    expect(screen.getByText('Manylion cyflogaeth ar gyfer Aldi')).toBeInTheDocument();
    expect(screen.getByText('2 February 2022')).toBeInTheDocument();
    expect(screen.getByText('£1,021.00')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Dyddiad dod i ben')).toBeInTheDocument();
    expect(screen.getByText('Swm o’r P45')).toBeInTheDocument();
    expect(screen.getByText('Cod treth')).toBeInTheDocument();
    expect(screen.getByText('Rhif cyflogres')).toBeInTheDocument();
    expect(screen.getByText('Cyfeirnod TWE y Cyflogwr')).toBeInTheDocument();
  });

  test('renders content properly for pension for welsh', async () => {
    details.Status = 'CEASED';
    details.ActiveOccupationalPension = true;
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Yn ôl')).toBeInTheDocument();
    expect(screen.getByText('Manylion pensiwn ar gyfer Aldi')).toBeInTheDocument();
    expect(screen.getByText('2 February 2022')).toBeInTheDocument();
    expect(screen.getByText('£1,021.00')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Dyddiad dod i ben')).toBeInTheDocument();
    expect(screen.getByText('Swm o’r P45')).toBeInTheDocument();
    expect(screen.getByText('Cod treth')).toBeInTheDocument();
    expect(screen.getByText('Rhif cyflogres')).toBeInTheDocument();
    expect(screen.getByText('Cyfeirnod TWE y Cyflogwr')).toBeInTheDocument();
  });

  test('should check view payments rendered and not render update company benefits, understand tax code', async () => {
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
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('View payments mock')).toBeInTheDocument();
    expect(screen.queryByText('Update Company Benefits mock')).toBeNull();
    expect(screen.queryByText('understand tax code mock')).toBeNull();
  });

  test('should check view payments,update income not rendered and render update company benefits', async () => {
    details.TESLinks = [
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
      }
    ];
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.queryByText('View payments mock')).toBeNull();
    expect(screen.getByText('Update Company Benefits mock')).toBeInTheDocument();
    expect(screen.queryByText('Update Estimated taxable income')).toBeNull();
  });

  test('should check other actions section not rendered', async () => {
    details.TESLinks = [];
    const viewAllDetailsProps = {
      details,
      redirectCurrentYearPage,
      handleLinkClick,
      beginIntrruptionPage,
      handleNavClick
    };
    await act(async () => {
      t.result.current.i18n.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ViewAllDetails {...viewAllDetailsProps} />
        </I18nextProvider>
      );
    });

    expect(screen.queryByText('Other actions')).toBeNull();
  });
});
