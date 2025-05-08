import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxCodeExplainer from './TaxCodeExplainer';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import ExplainerComponent from './ExplainerComponent';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

jest.mock('./ExplainerComponent', () => jest.fn(() => <div>Mock Explainer Component</div>));

describe('Tax Code explainer component', () => {
  let t;

  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();
  });

  test('renders the component to display explanation of provided tax code', async () => {
    const taxCode = ['S', '1000', 'C'];
    const netCodedAllowance = '1000';
    const isActivePension = true;
    const issuedTaxCode = 'S1000C';

    const taxCodeExplainerComponentProps = {
      taxCode,
      netCodedAllowance,
      isActivePension,
      issuedTaxCode
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <TaxCodeExplainer {...taxCodeExplainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('What S1000C means')).toBeInTheDocument();
    expect(ExplainerComponent).toHaveBeenCalled();
  });

  test('renders the component to display explanation of provided tax code in welsh', async () => {
    const taxCode = ['S', '1000', 'C'];
    const netCodedAllowance = '1000';
    const isActivePension = true;
    const issuedTaxCode = 'S1000C';

    const taxCodeExplainerComponentProps = {
      taxCode,
      netCodedAllowance,
      isActivePension,
      issuedTaxCode
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <TaxCodeExplainer {...taxCodeExplainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Beth mae S1000C yn golygu')).toBeInTheDocument();
    expect(ExplainerComponent).toHaveBeenCalled();
  });

  test('renders the component in english to display coded allowance text if no tax code is coming', async () => {
    const taxCode = [];
    const netCodedAllowance = '1000';
    const isActivePension = true;
    const issuedTaxCode = 'S1000C';

    const taxCodeExplainerComponentProps = {
      taxCode,
      netCodedAllowance,
      isActivePension,
      issuedTaxCode
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <TaxCodeExplainer {...taxCodeExplainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('What S1000C means')).toBeInTheDocument();
    expect(
      screen.getByText(`Your tax-free amount for this employment or pension is £1,000.`)
    ).toBeInTheDocument();
  });

  test('renders the component in welsh to display coded allowance text if no tax code is coming', async () => {
    const taxCode = [];
    const netCodedAllowance = '1000';
    const isActivePension = true;
    const issuedTaxCode = 'S1000C';

    const taxCodeExplainerComponentProps = {
      taxCode,
      netCodedAllowance,
      isActivePension,
      issuedTaxCode
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <TaxCodeExplainer {...taxCodeExplainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(screen.getByText('Beth mae S1000C yn golygu')).toBeInTheDocument();
    expect(
      screen.getByText(
        `Eich swm sy'n rhydd o dreth ar gyfer y gyflogaeth neu'r pensiwn hwn yw £1,000.`
      )
    ).toBeInTheDocument();
  });
});
