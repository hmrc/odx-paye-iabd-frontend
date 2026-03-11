import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UntaxedSavingsInterestPage from './UntaxedSavingsInterestPage';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { renderHook } from '@testing-library/react-hooks';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import { AnalyticsConfigProvider } from 'hmrc-odx-features-and-functions';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock the service shutter hook
jest.mock('../../../../components/helpers/hooks/useServiceShuttered', () => () => false);

const mockApiCallback = jest.fn();

describe('UntaxedSavingsInterestPage', () => {
  const mockRedirectToUnderstandYourTaxPage = jest.fn();
  const mockRedirectToViewTimelineDetailsPage = jest.fn();

  afterEach(cleanup);

  beforeEach(async () => {
    mockRedirectToUnderstandYourTaxPage.mockClear();
    mockGetSdkConfigWithBasepath();
    const { result } = renderHook(() => useHMRCExternalLinks());
    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  const props = {
    redirectToUnderstandYourTaxPage: mockRedirectToUnderstandYourTaxPage,
    redirectToViewTimelineDetailsPage: mockRedirectToViewTimelineDetailsPage,
    comingFromPage: 'UnderstandYourTaxCodePage'
  };

  const getComponent = () => {
    return (
      <AnalyticsConfigProvider apiCallback={mockApiCallback}>
        <UntaxedSavingsInterestPage {...props} />
      </AnalyticsConfigProvider>
    );
  };

  it('renders the page title and content', async () => {
    act(() => {
      render(getComponent());
    });

    // Check if the title is rendered
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_TITLE'
    );

    // Check if some body content is rendered
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.DESCRIPTION_1')).toBeInTheDocument();
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.DESCRIPTION_2')).toBeInTheDocument();
  });

  it('renders the backlink button and handles click event', async () => {
    act(() => {
      render(getComponent());
    });

    // Check if the backlink button is rendered
    const backButton = screen.getByRole('link', { name: 'BACK' });
    expect(backButton).toBeInTheDocument();

    // Simulate a click event
    fireEvent.click(backButton);

    // Check if the redirect function is called
    expect(mockRedirectToUnderstandYourTaxPage).toHaveBeenCalledTimes(1);
  });

  it('renders all sections and headings', async () => {
    act(() => {
      render(getComponent());
    });

    // Check if all headings are rendered
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.WHY_IN_TAX_CODE')).toBeInTheDocument();
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.SELF_ASSESSMENT')).toBeInTheDocument();
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.NO_SELF_ASSESSMENT')).toBeInTheDocument();
    expect(
      screen.getByText('UNTAXED_SAVINGS_INTEREST.PERSONAL_SAVINGS_ALLOWANCE')
    ).toBeInTheDocument();
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.FIGURE_MISMATCH')).toBeInTheDocument();
    expect(screen.getByText('UNTAXED_SAVINGS_INTEREST.MORE_HELP')).toBeInTheDocument();
  });

  it('renders the external link with correct aria-label', async () => {
    act(() => {
      render(getComponent());
    });

    // Check if the external link is rendered
    const externalLink = screen.getByRole('link', {
      name: 'UNTAXED_SAVINGS_INTEREST.MORE_HELP_LINK_TEXT'
    });
    expect(externalLink).toBeInTheDocument();
    expect(externalLink).toHaveAttribute(
      'href',
      'https://www.gov.uk/apply-tax-free-interest-on-savings'
    );
  });
});
