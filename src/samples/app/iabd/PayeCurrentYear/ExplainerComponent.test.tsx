import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExplainerComponent from './ExplainerComponent';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('Tax Code actual explainer component', () => {
  const netCodedAllowance = '100C';
  const isActivePension = true;

  let t;

  afterEach(cleanup);

  beforeEach(async () => {
    t = renderHook(() => useTranslation());
    mockGetSdkConfigWithBasepath();
  });

  test('renders the component to display tax code explanation of S', async () => {
    const code = 'S';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('en');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ExplainerComponent {...explainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(
      screen.getByText('Your income or pension is taxed using the rates in Scotland')
    ).toBeInTheDocument();
  });
  test('renders the component to display tax code explanation of C', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'en_GB');
    const code = 'C';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      render(<ExplainerComponent {...explainerComponentProps} />);
    });

    expect(
      screen.getByText('Your income or pension is taxed using the rates in Wales')
    ).toBeInTheDocument();
  });

  test('renders the component to display tax code explanation of K', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'en_GB');
    const code = 'K';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      render(<ExplainerComponent {...explainerComponentProps} />);
    });

    expect(
      screen.getByText(
        'You have income that is not being taxed another way and it’s worth more than your tax-free allowance'
      )
    ).toBeInTheDocument();
  });

  test('renders the component to display tax code explanation of L', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'en_GB');
    const code = 'L';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      render(<ExplainerComponent {...explainerComponentProps} />);
    });

    expect(
      screen.getByText("You're entitled to the standard tax-free Personal Allowance")
    ).toBeInTheDocument();
  });

  test('renders the component to display tax code explanation of Week1/Month1', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'en_GB');
    const code = 'Week1/Month1';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      render(<ExplainerComponent {...explainerComponentProps} />);
    });

    expect(
      screen.getByText(
        'Your tax is based on your pay in each pay period, not the whole year. This stops you paying too much tax in one go. Your pension statement could show this as W1/M1 or week1/month1.'
      )
    ).toBeInTheDocument();
  });

  test('renders the component to display tax code explanation of L in welsh', async () => {
    const code = 'L';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ExplainerComponent {...explainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(
      screen.getByText('Roedd gennych hawl i’r Lwfans Personol safonol rhydd o dreth')
    ).toBeInTheDocument();
  });

  test('renders the component to display tax code explanation of S in welsh', async () => {
    const code = 'S';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ExplainerComponent {...explainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(
      screen.getByText('Trethir eich incwm neu’ch pensiwn gan ddefnyddio’r cyfraddau yn yr Alban')
    ).toBeInTheDocument();
  });

  test('renders the component to display tax code explanation of C in welsh', async () => {
    const code = 'C';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      t.result.current.i18n?.changeLanguage('cy');
      render(
        <I18nextProvider i18n={t.result.current.i18n}>
          <ExplainerComponent {...explainerComponentProps} />
        </I18nextProvider>
      );
    });

    expect(
      screen.getByText('Trethir eich incwm neu’ch pensiwn gan ddefnyddio’r cyfraddau yng Nghymru')
    ).toBeInTheDocument();
  });

  test('renders the component to display default tax code explanation when nothing was sent from pega', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'en_GB');
    const code = '';

    const explainerComponentProps = {
      code,
      netCodedAllowance,
      isActivePension
    };

    await act(async () => {
      render(<ExplainerComponent {...explainerComponentProps} />);
    });

    expect(
      screen.getByText('Your tax-free amount for this employment or pension is .')
    ).toBeInTheDocument();
  });
});
