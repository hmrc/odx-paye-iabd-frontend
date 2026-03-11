import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import ViewTimelineDetails from './ViewTimelineDetails';
import { AnalyticsConfigProvider } from 'hmrc-odx-features-and-functions';

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

jest.mock('./CatDPages/CategoryD2', () => {
  const MockCategoryD2 = () => <p>Category D2 Mock</p>;
  return MockCategoryD2;
});

jest.mock('./CatDPages/CategoryD3', () => {
  const MockCategoryD3 = () => <p>Category D3 Mock</p>;
  return MockCategoryD3;
});

jest.mock('./CatDPages/CategoryD4', () => {
  const MockCategoryD4 = () => <p>Category D4 Mock</p>;
  return MockCategoryD4;
});

jest.mock('./CatDPages/CategoryD5', () => {
  const MockCategoryD5 = () => <p>Category D5 Mock</p>;
  return MockCategoryD5;
});

jest.mock('./CatDPages/CategoryD6', () => {
  const MockCategoryD6 = () => <p>Category D6 Mock</p>;
  return MockCategoryD6;
});

jest.mock('./CatDPages/CategoryD7', () => {
  const MockCategoryD7 = () => <p>Category D7 Mock</p>;
  return MockCategoryD7;
});

jest.mock('./CatDPages/CategoryD1', () => {
  const MockCategoryD1 = () => <p>Category D1 Mock</p>;
  return MockCategoryD1;
});

jest.mock('./CatDPages/CategoryD10', () => {
  const MockCategoryD10 = () => <p>Category D10 Mock</p>;
  return MockCategoryD10;
});

jest.mock('./CatCpages/CategoryC1', () => {
  const MockCategoryC1 = () => <p>Category C1 Mock</p>;
  return MockCategoryC1;
});

jest.mock('./CatCpages/CategoryC', () => {
  const MockCategoryC = () => <p>Category C Mock</p>;
  return MockCategoryC;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockApiCallback = jest.fn();
const mockGetPageDataAsync = jest.fn();

const redirectCurrentYearPage = jest.fn();
const redirecLatestEventPage = jest.fn();
const handleLinkClick = jest.fn();
const redirectToAllIABDLandingPage = jest.fn();
const handleDetailExplainerLinkClick = jest.fn();
const redirectToDeductionExplainerpage = jest.fn();
describe('ViewTimelineDetails Component', () => {
  afterEach(cleanup);

  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();
    const { result } = renderHook(() => useHMRCExternalLinks());
    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });

    (window as any).PCore = {
      getDataPageUtils: jest.fn(() => ({
        getDataAsync: mockGetPageDataAsync
      })),
      getRestClient: jest.fn(() => ({
        invokeCustomRestApi: jest.fn().mockResolvedValue({ data: 'mocked data' })
      }))
    };
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
    redirectToAllIABDLandingPage,
    handleDetailExplainerLinkClick,
    redirectToDeductionExplainerpage
  };

  const getComponent = () => {
    return (
      <AnalyticsConfigProvider apiCallback={mockApiCallback}>
        <ViewTimelineDetails {...viewTimelineDetailsProps} />
      </AnalyticsConfigProvider>
    );
  };

  test('renders content properly for explainer type c1', async () => {
    timelineDetails.pyTemplateDataField = 'c1';
    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category C1 Mock')).toBeInTheDocument();
  });

  test('renders content properly for explainer type c', async () => {
    timelineDetails.pyTemplateDataField = 'c';
    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category C Mock')).toBeInTheDocument();
  });

  test('renders content properly for explainer type a-increase', async () => {
    timelineDetails.pyTemplateDataField = 'a-increase';

    await act(async () => {
      render(getComponent());
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
      render(getComponent());
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
      render(getComponent());
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

  test('should render d2 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd2';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D2 Mock')).toBeInTheDocument();
  });

  test('should render d3 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd3';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D3 Mock')).toBeInTheDocument();
  });
  test('should render d4 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd4';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D4 Mock')).toBeInTheDocument();
  });
  test('should render d5 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd5';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D5 Mock')).toBeInTheDocument();
  });
  test('should render d6 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd6';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D6 Mock')).toBeInTheDocument();
  });
  test('should render d7 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd7';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D7 Mock')).toBeInTheDocument();
  });

  test('should render d1 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd1';

    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D1 Mock')).toBeInTheDocument();
  });

  test('should render d10 category component', async () => {
    timelineDetails.pyTemplateDataField = 'd10';
    await act(async () => {
      render(getComponent());
    });

    expect(screen.getByText('Category D10 Mock')).toBeInTheDocument();
  });
});
