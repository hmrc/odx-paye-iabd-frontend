import { render, screen, fireEvent, act } from '@testing-library/react';
import ViewTimelineDetailsP2 from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../../../../../components/helpers/hooks/useServiceShuttered', () => ({
  __esModule: true,
  default: () => ({
    serviceShuttered: false,
    isLoading: false
  })
}));

jest.mock('../../../../../components/helpers/LoadingSpinner/LoadingWrapper', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid='loading-wrapper'>{children}</div>
}));

jest.mock('../../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid='shutter-wrapper'>{children}</div>
}));

jest.mock('../../../../../components/BaseComponents/Button/Button', () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    // eslint-disable-next-line react/button-has-type
    <button data-testid='back-btn' onClick={onClick}>
      Back
    </button>
  )
}));

jest.mock('../../../../../components/BaseComponents/MainWrapper/MainWrapperFull', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid='main-wrapper'>{children}</div>
}));

jest.mock('../../../../../components/helpers/utils', () => ({
  formatDate: (d: any) => `formatted-${d}`,
  getHeadingContent: () => ({ Description: 'Mock Heading' })
}));

jest.mock('./WhyExplainer', () => ({
  __esModule: true,
  default: ({ items }: any) => <div data-testid='why-explainer'>{JSON.stringify(items)}</div>
}));

jest.mock('./WhatExplainer', () => ({
  __esModule: true,
  default: ({ monthlyEarnings }: any) => <div data-testid='what-explainer'>{monthlyEarnings}</div>
}));

jest.mock('./HowExplainer', () => ({
  __esModule: true,
  default: ({ employerName }: any) => <div data-testid='how-explainer'>{employerName}</div>
}));

const mockGetDataAsync = jest.fn();

(global as any).PCore = {
  getDataPageUtils: () => ({
    getDataAsync: mockGetDataAsync
  })
};

describe('ViewTimelineDetailsP2', () => {
  const baseTimeline = {
    EmploymentType: 'FULL',
    EmploymentSequenceNumber: 123,
    NetCodedAllowance: '100',
    ActiveOccupationalPension: true,
    EmployerName: 'Tesco',
    IntegerSortingHolder: 999,
    issuedtaxCode: 'AA111',
    Content: [{ Description: 'heading' }],
    DisplayDate: '2025-10-01'
  };

  describe('Given the component mounts', () => {
    describe('When the API returns successful data', () => {
      const mockData = {
        MonthlyEarnings: '500',
        WhyExplainer: [{ a: 1 }],
        TaxDetails: [{ x: 1 }]
      };

      beforeEach(async () => {
        mockGetDataAsync.mockResolvedValue({
          data: [
            {
              Customer: {
                TaxSummaryList: [mockData]
              }
            }
          ]
        });
      });

      it('Then it renders heading, summaries and snapshot', async () => {
        let container;
        await act(async () => {
          const rendered = render(
            <ViewTimelineDetailsP2
              redirectCurrentYearPage={jest.fn()}
              timelineDetails={baseTimeline}
              eventType='event'
            />
          );
          container = rendered.container;
        });

        expect(await screen.findByText('Tesco')).toBeInTheDocument();
        expect(screen.getByText('[{"a":1}]')).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
      });
    });

    describe('When the API returns MonthlyEarnings as zero', () => {
      const mockData = {
        MonthlyEarnings: '0',
        WhyExplainer: [],
        TaxDetails: []
      };

      beforeEach(async () => {
        mockGetDataAsync.mockResolvedValue({
          data: [
            {
              Customer: {
                TaxSummaryList: [mockData]
              }
            }
          ]
        });
      });

      it('Then it renders Why and What but not How', async () => {
        await act(async () => {
          render(
            <ViewTimelineDetailsP2
              redirectCurrentYearPage={jest.fn()}
              timelineDetails={baseTimeline}
              eventType='event'
            />
          );
        });

        expect(screen.queryByTestId('how-explainer')).toBeNull();
      });
    });

    describe('When the API throws an error', () => {
      beforeEach(() => {
        mockGetDataAsync.mockRejectedValue(new Error('fetch error'));
      });

      it('Then it renders page without How/Why/What and matches snapshot', async () => {
        let container;
        await act(async () => {
          const rendered = render(
            <ViewTimelineDetailsP2
              redirectCurrentYearPage={jest.fn()}
              timelineDetails={baseTimeline}
              eventType='event'
            />
          );
          container = rendered.container;
        });

        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('Given the user clicks the back button', () => {
    describe('When eventType is event', () => {
      it('Then it triggers redirectCurrentYearPage', async () => {
        mockGetDataAsync.mockResolvedValue({
          data: [
            {
              Customer: {
                TaxSummaryList: [{ MonthlyEarnings: '0', WhyExplainer: [], TaxDetails: [] }]
              }
            }
          ]
        });

        const redirectMock = jest.fn();

        await act(async () => {
          render(
            <ViewTimelineDetailsP2
              redirectCurrentYearPage={redirectMock}
              timelineDetails={baseTimeline}
              eventType='event'
            />
          );
        });

        fireEvent.click(screen.getByText('Back'));
        expect(redirectMock).toHaveBeenCalled();
      });
    });

    describe('When eventType is not event', () => {
      it('Then redirectCurrentYearPage is not called', async () => {
        mockGetDataAsync.mockResolvedValue({
          data: [
            {
              Customer: {
                TaxSummaryList: [{ MonthlyEarnings: '0', WhyExplainer: [], TaxDetails: [] }]
              }
            }
          ]
        });

        const redirectMock = jest.fn();

        await act(async () => {
          render(
            <ViewTimelineDetailsP2
              redirectCurrentYearPage={redirectMock}
              timelineDetails={baseTimeline}
              eventType='other'
            />
          );
        });

        fireEvent.click(screen.getByText('Back'));
        expect(redirectMock).not.toHaveBeenCalled();
      });
    });
  });
});
