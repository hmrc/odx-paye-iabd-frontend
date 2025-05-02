import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import ViewTimelineDetails from './ViewTimelineDetails';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

jest.mock('./TaxFreeAmountDetails', () => {
  const MockTaxFreeAmountDetails = () => <p>Tax Free Amount Details Mock</p>;
  return MockTaxFreeAmountDetails;
});

jest.mock('././TaxFreeAmountTable', () => {
  const MockTaxFreeAmountDetails = () => <p>Tax Free Amount Table Mock</p>;
  return MockTaxFreeAmountDetails;
});

jest.mock('./TaxCodeExplainer', () => {
  const MockTaxFreeAmountDetails = () => <p>Tax Code Explainer Mock</p>;
  return MockTaxFreeAmountDetails;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const redirectCurrentYearPage = jest.fn();
const redirecLatestEventPage = jest.fn();
const handleLinkClick = jest.fn();
const redirectToAllIABDLandingPage = jest.fn();
describe('ViewTimelineDetails Component', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();
    const { result } = renderHook(() => useHMRCExternalLinks());
    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  const timelineDetails = {
    DisplayDate: '2020-02-02',
    pyNote: 'Mock Py Note',
    Content: [
      {
        pyKeyString: 'mock key',
        Description: 'Mock english description',
        Language: 'EN'
      },
      {
        pyKeyString: 'mock key',
        Description: 'Mock welsh description',
        Language: 'CY'
      }
    ],
    pyTempDate: '2020-02-02',
    StringSortingHolder: 'A',
    issuedtaxCode: 'issued tax code',
    EmployerName: 'M&S',
    pyTemplateDataField: 'c',
    ActiveOccupationalPension: true,
    EmploymentType: 'primary'
  };

  const viewTimelineDetailsProps = {
    timelineDetails,
    redirectCurrentYearPage,
    redirecLatestEventPage,
    eventType: 'event',
    handleLinkClick,
    redirectToAllIABDLandingPage
  };

  test('renders content properly for explainer type c', async () => {
    timelineDetails.pyTemplateDataField = 'c';

    await act(async () => {
      render(<ViewTimelineDetails {...viewTimelineDetailsProps} />);
    });

    expect(screen.getByText('BACK')).toBeInTheDocument();
    expect(screen.getByText('Mock english description')).toBeInTheDocument();
    expect(screen.getByText('2 February 2020')).toBeInTheDocument();
    expect(screen.getByText('EXPLAINER_CAT_C')).toBeInTheDocument();
    expect(screen.getByText('YOU_DO_NOT_DO_ANYTHING')).toBeInTheDocument();
  });

  test('renders content properly for explainer type a-increase', async () => {
    timelineDetails.pyTemplateDataField = 'a-increase';

    await act(async () => {
      render(<ViewTimelineDetails {...viewTimelineDetailsProps} />);
    });

    expect(screen.getByText('BACK')).toBeInTheDocument();
    expect(screen.getByText('Mock english description')).toBeInTheDocument();
    expect(screen.getByText('2 February 2020')).toBeInTheDocument();
    expect(screen.getByText('EXPLAINER_CAT_A_BODY_INC')).toBeInTheDocument();
    expect(screen.getByText('EXPLAINER_CAT_A_BODY')).toBeInTheDocument();
    expect(screen.getByText('YOU_DO_NOT_DO_ANYTHING')).toBeInTheDocument();
  });

  test('renders content properly for explainer type a-decrease', async () => {
    timelineDetails.pyTemplateDataField = 'a-decrease';

    await act(async () => {
      render(<ViewTimelineDetails {...viewTimelineDetailsProps} />);
    });

    expect(screen.getByText('BACK')).toBeInTheDocument();
    expect(screen.getByText('Mock english description')).toBeInTheDocument();
    expect(screen.getByText('2 February 2020')).toBeInTheDocument();
    expect(screen.getByText('EXPLAINER_CAT_A_BODY_DEC')).toBeInTheDocument();
    expect(screen.getByText('EXPLAINER_CAT_A_BODY')).toBeInTheDocument();
    expect(screen.getByText('YOU_DO_NOT_DO_ANYTHING')).toBeInTheDocument();
  });

  test('renders content properly for explainer type taxcode', async () => {
    timelineDetails.pyTemplateDataField = 'taxcode';
    timelineDetails.ActiveOccupationalPension = false;

    await act(async () => {
      render(<ViewTimelineDetails {...viewTimelineDetailsProps} />);
    });

    expect(screen.getByText('BACK')).toBeInTheDocument();
    expect(screen.getByText('Mock english description')).toBeInTheDocument();
    expect(screen.getByText('2 February 2020')).toBeInTheDocument();
    expect(screen.getByText('WHAT_HAPPEN_NEXT')).toBeInTheDocument();
    expect(screen.getByText('THIS_IS_FOR_YOUR_INFO')).toBeInTheDocument();
    expect(screen.getByText('Tax Free Amount Details Mock')).toBeInTheDocument();
    expect(screen.getByText('Tax Free Amount Table Mock')).toBeInTheDocument();
    expect(
      screen.getByText('YOUR_TAX_FREE_AMOUNT_EMPLOYMENT', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('WHAT_HAPPEN_NEXT')).toBeInTheDocument();
    expect(screen.getByText('THIS_IS_FOR_YOUR_INFO')).toBeInTheDocument();

    const link = screen.getByText('UPDATE_REMOVE_INFO_ABOUT_YOU');
    fireEvent.click(link);
    expect(redirectToAllIABDLandingPage).toHaveBeenCalled();
  });
});
