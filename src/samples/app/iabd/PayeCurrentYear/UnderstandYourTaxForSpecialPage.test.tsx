import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import UnderstandYourTaxForSpecialPage from './UnderstandYourTaxForSpecialPage';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { renderHook } from '@testing-library/react-hooks';
import { AnalyticsConfigProvider } from 'hmrc-odx-features-and-functions';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock hook
jest.mock('../../../../components/helpers/hooks/useServiceShuttered', () => jest.fn());

const mockApiCallback = jest.fn();

describe('UnderstandYourTaxForSpecialPage', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    (useServiceShuttered as jest.Mock).mockReturnValue(false);
    mockGetSdkConfigWithBasepath();
    const { result } = renderHook(() => useHMRCExternalLinks());
    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  const mockGoBack = jest.fn();
  const mockHandleLinkClick = jest.fn();

  const defaultProps = {
    understandYourTaxDetails: {
      StartDate: '',
      EndDate: '',
      EstimatedPayInterruptionFlag: false,
      ActiveOccupationalPension: false,
      AssignedTaxCode: '1257L',
      EmployerName: 'LiDL',
      EmploymentSequenceNumber: 65,
      EmploymentType: 'SECONDARY',
      EstimatedPay: '',
      IntegerSortingHolder: 1,
      NetCodedAllowance: '',
      P45Amount: '',
      PAYENumber: '133/A56789',
      PayRollID: '12345',
      StartingTaxCode: '1257L',
      Status: 'LIVE',
      TESLinks: [
        {
          Content: [
            {
              Language: 'EN',
              Name: 'Understand your tax code',
              pyKeyString: 'TAXCODE',
              pyURLContent: 'NA'
            },
            {
              Language: 'CY',
              Name: 'Deall eich cod treth',
              pyKeyString: 'TAXCODE',
              pyURLContent: 'NA'
            }
          ]
        }
      ]
    },
    onBack: mockGoBack,
    handleLinkClick: mockHandleLinkClick
  };

  const getComponent = () => {
    return (
      <AnalyticsConfigProvider apiCallback={mockApiCallback}>
        <UnderstandYourTaxForSpecialPage {...defaultProps} />
      </AnalyticsConfigProvider>
    );
  };

  test('renders heading with employer name and tax code', () => {
    render(getComponent());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'YOUR_TAX_CODE_FOR LiDL IS 1257L'
    );
  });

  test('calls redirectCurrentYearPage when back button is clicked', () => {
    render(getComponent());
    const backButton = screen.getByText('BACK');
    fireEvent.click(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  test('calls handleLinkClick when income tax estimate link is clicked', () => {
    render(getComponent());
    const link = screen.getByText('VIEW_INCOME_TAX_ESTIMATE');
    fireEvent.click(link);
    expect(mockHandleLinkClick).toHaveBeenCalledWith('/check-income-tax/paye-income-tax-estimate');
  });
});
