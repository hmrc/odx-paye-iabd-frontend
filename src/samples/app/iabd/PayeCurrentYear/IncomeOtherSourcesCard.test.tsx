import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummaryCardIncomeOtherSources from './IncomeOtherSourcesCard';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('Summary Card Income from other sources Component', () => {
  const details = {
    AnnualAmount: 100,
    IntegerSortingHolder: 1,
    TESLinks: [
      {
        Content: [
          {
            pyKeyString: 'Updateorremove',
            Language: 'CY',
            pyURLContent: '/mock',
            Name: 'update or remove - welsh'
          },
          {
            pyKeyString: 'Updateorremove',
            Language: 'EN',
            pyURLContent: '/mock',
            Name: 'Update or remove'
          }
        ]
      }
    ],
    Content: [
      {
        pyKeyString: 'MOCKEMP',
        Description: 'Mock Employer name - welsh',
        Language: 'CY'
      },
      {
        pyKeyString: 'MOCKEMP',
        Description: 'Mock Employer name',
        Language: 'EN'
      }
    ],
    StringSortingHolder: 'A',
    EmployerName: 'Tips'
  };

  const handleNavClick = jest.fn();

  const sessionStorageMock = (() => {
    let store = {};
    return {
      getItem: key => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      }
    };
  })();

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  });

  afterEach(cleanup);

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();

    // clearing the mock session storage
    window.sessionStorage.clear();
  });

  test('renders content in english when the links not available', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'en');

    const viewAllDetailsProps = {
      details,
      handleNavClick
    };

    await act(async () => {
      render(<SummaryCardIncomeOtherSources {...viewAllDetailsProps} />);
    });

    expect(screen.getByText('Mock Employer name')).toBeInTheDocument();
    expect(screen.getByText('Update or remove')).toBeInTheDocument();
    expect(screen.getByText('Update or remove')).toBeInTheDocument();
    const spanElementEng = screen.getByText('Update or remove Mock Employer name');
    expect(spanElementEng).toBeInTheDocument();
    expect(spanElementEng).toHaveClass('govuk-visually-hidden');
    const link = screen.getByText('Update or remove');
    fireEvent.click(link);
    expect(handleNavClick).toHaveBeenCalled();
  });

  test('renders content in welsh when the links not available', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'cy');

    const viewAllDetailsProps = {
      details,
      handleNavClick
    };

    await act(async () => {
      render(<SummaryCardIncomeOtherSources {...viewAllDetailsProps} />);
    });

    expect(screen.getByText('Mock Employer name - welsh')).toBeInTheDocument();
    expect(screen.getByText('update or remove - welsh')).toBeInTheDocument();
    const spanElementWel = screen.getByText('update or remove - welsh Mock Employer name - welsh');
    expect(spanElementWel).toBeInTheDocument();
    expect(spanElementWel).toHaveClass('govuk-visually-hidden');
    const link = screen.getByText('update or remove - welsh');
    fireEvent.click(link);
    expect(handleNavClick).toHaveBeenCalled();
  });

  test('should not render links if TES links object is empty', async () => {
    details.TESLinks = [];
    const viewAllDetailsProps = {
      details,
      handleNavClick
    };

    await act(async () => {
      render(<SummaryCardIncomeOtherSources {...viewAllDetailsProps} />);
    });

    expect(screen.getByText('Mock Employer name')).toBeInTheDocument();
    expect(screen.queryByText('Update or remove - welsh')).toBeNull();
  });
});
