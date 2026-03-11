import { act, cleanup, render, screen } from '@testing-library/react';
import UnderstandYourTaxCodePage from './UnderstandYourTaxCodePage';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { renderHook } from '@testing-library/react-hooks';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { AnalyticsConfigProvider } from 'hmrc-odx-features-and-functions';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

jest.mock('./TaxFreeAmountDetails', () => {
  const MockTaxFreeAmountDetails = () => <p>This is Tax free Amount</p>;
  return MockTaxFreeAmountDetails;
});

jest.mock('./TaxCodeExplainer', () => {
  const MockTaxCodeExplainer = () => <p>This is Tax code explainer</p>;
  return MockTaxCodeExplainer;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockApiCallback = jest.fn();

const onBack = jest.fn();
const handleLinkClick = jest.fn();
const redirectToAllIABDLandingPage = jest.fn();
const redirectToDeductionExplainerpage = jest.fn();

describe('Understand your tax code component', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();
    const { result } = renderHook(() => useHMRCExternalLinks());
    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  const understandYourTaxDetails = {
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
  };

  const understandYourTaxCodeProps = {
    understandYourTaxDetails,
    onBack,
    handleLinkClick,
    redirectToAllIABDLandingPage,
    redirectToDeductionExplainerpage
  };

  test('render content properly', async () => {
    await act(async () => {
      render(
        <AnalyticsConfigProvider apiCallback={mockApiCallback}>
          <UnderstandYourTaxCodePage {...understandYourTaxCodeProps} />
        </AnalyticsConfigProvider>
      );
    });
    expect(screen.getByText('BACK')).toBeInTheDocument();
    expect(screen.getByText('YOUR_TAX_CODE_FOR LiDL IS 1257L')).toBeInTheDocument();
    expect(screen.getByText('This is Tax free Amount')).toBeInTheDocument();
    expect(
      screen.getByText('YOUR_TAX_FREE_AMOUNT_EMPLOYMENT', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('PAGE_NOT_WORKING_PROPERLY', { exact: false })).toBeInTheDocument();
  });
});
