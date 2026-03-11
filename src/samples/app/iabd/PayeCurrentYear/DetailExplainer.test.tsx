import React from 'react';
import { act, render, screen } from '@testing-library/react';
import DetailExplainer from './DetailExplainer';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { renderHook } from '@testing-library/react-hooks';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';

const mockUseServiceShuttered = require('../../../../components/helpers/hooks/useServiceShuttered');

jest.mock('../../../../components/helpers/hooks/useServiceShuttered', () => jest.fn());
jest.mock('../../../../components/helpers/setPageTitleHelpers', () => jest.fn());
jest.mock('../../../../components/helpers/utils', () => ({
  scrollToTop: jest.fn()
}));
jest.mock('./CatDPages/DividendTax', () => jest.fn(() => <div>DividendTax Component</div>));
jest.mock('./CatDPages/PersonalPensionPay', () =>
  jest.fn(() => <div>PersonalPensionPay Component</div>)
);
jest.mock('./CatDPages/BenefitKind', () => jest.fn(() => <div>BenefitKind Component</div>));

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));
describe('DetailExplainer', () => {
  const mockRedirectToViewTimelineDetailsPage = jest.fn();

  beforeEach(async () => {
    mockUseServiceShuttered.mockReturnValue(false);
    jest.clearAllMocks();

    mockGetSdkConfigWithBasepath();
    const { result } = renderHook(() => useHMRCExternalLinks());
    await act(async () => {
      result.current.referrerURL = 'https://www.staging.tax.service.gov.uk/';
      result.current.hmrcURL = 'https://www.staging.tax.service.gov.uk/';
    });
  });

  it('renders the correct component based on the componentName prop', () => {
    const { rerender } = render(
      <DetailExplainer
        componentName='DividendTax'
        redirectToViewTimelineDetailsPage={mockRedirectToViewTimelineDetailsPage}
      />
    );

    expect(screen.getByText('DividendTax Component')).toBeInTheDocument();

    rerender(
      <DetailExplainer
        componentName='PersonalPensionPay'
        redirectToViewTimelineDetailsPage={mockRedirectToViewTimelineDetailsPage}
      />
    );

    expect(screen.getByText('PersonalPensionPay Component')).toBeInTheDocument();

    rerender(
      <DetailExplainer
        componentName='BenefitKind'
        redirectToViewTimelineDetailsPage={mockRedirectToViewTimelineDetailsPage}
      />
    );

    expect(screen.getByText('BenefitKind Component')).toBeInTheDocument();
  });
});
