import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';
import CurrentTimeLineEvent from './CurrentTimeLineEvent';
import { formatDate } from '../../../../components/helpers/utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const handleViewDetailsClick = jest.fn();
describe('Current time line Event component', () => {
  const details = [
    {
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
      EmployerName: 'M&S'
    }
  ];
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

    await act(async () => {
      render(
        <CurrentTimeLineEvent
          latestTimeLineEvents={details}
          eventType='fullEvent'
          handleViewDetailsClick={handleViewDetailsClick}
        />
      );
    });

    expect(screen.getByText('Mock english description')).toBeInTheDocument();
    expect(screen.getByText(formatDate('2020-02-02'))).toBeInTheDocument();
  });

  test('renders content in welsh when the links not available', async () => {
    window.sessionStorage.setItem('rsdk_locale', 'cy');

    await act(async () => {
      render(
        <CurrentTimeLineEvent
          latestTimeLineEvents={details}
          eventType='fullEvent'
          handleViewDetailsClick={handleViewDetailsClick}
        />
      );
    });

    expect(screen.getByText('Mock welsh description')).toBeInTheDocument();
    expect(screen.getByText(formatDate('2020-02-02'))).toBeInTheDocument();
  });
});
