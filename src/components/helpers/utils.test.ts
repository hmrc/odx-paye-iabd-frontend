import { act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  formatCurrency,
  generateKey,
  getCurrentLang,
  getHeadingContent,
  triggerLogout,
  truncate
} from './utils';
import { mockGetSdkConfigWithBasepath } from '../../../tests/mocks/getSdkConfigMock';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));
jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn(),
  logout: jest.fn().mockResolvedValue({})
}));
describe('getCurrentLang util function', () => {
  const sessionStorageMock = (() => {
    let sessionStore = {};
    return {
      getItem: key => sessionStore[key] || null,
      setItem: (key, value) => {
        sessionStore[key] = value.toString();
      },
      clear: () => {
        sessionStore = {};
      }
    };
  })();

  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

  afterEach(cleanup);

  beforeEach(async () => {
    window.sessionStorage.clear();
    mockGetSdkConfigWithBasepath();
  });

  test('should test whether language is english', () => {
    window.sessionStorage.setItem('rsdk_locale', 'en');
    const langResult = getCurrentLang();
    expect(langResult).toBe('en');
  });

  test('should test whether language is welsh', () => {
    window.sessionStorage.setItem('rsdk_locale', 'cy');
    const langResult = getCurrentLang();
    expect(langResult).toBe('cy');
  });
});

describe('getHeadingContent util function', () => {
  const mockContent = [
    {
      Description: 'Mock eng content',
      Language: 'En'
    },
    {
      Description: 'Mock welsh content',
      Language: 'Cy'
    }
  ];
  test('should test whether engligh content is returned', () => {
    const Result = getHeadingContent(mockContent, 'en');
    expect(Result).toEqual({
      Description: 'Mock eng content',
      Language: 'En'
    });
  });

  test('should test whether welsh content is returned', () => {
    const Result = getHeadingContent(mockContent, 'cy');
    expect(Result).toEqual({
      Description: 'Mock welsh content',
      Language: 'Cy'
    });
  });
});

describe('truncate util function', () => {
  test('should return truncate value', () => {
    expect(truncate('')).toBe('');
    expect(truncate(undefined)).toBe('');
    expect(truncate('12.a12')).toBe('');
    expect(truncate(12.15)).toBe(12);
    expect(truncate('12.15')).toBe(12);
  });
});

describe('generateKey util function', () => {
  test('should return a concatenation of name, index and employer', () => {
    const name = 'mock name';
    const index = 1;
    const employer = 'mock employer';
    expect(generateKey(name, index, employer)).toBe('mock name_1_mock employer');
  });

  test('should return a concatenation of name and index', () => {
    const name = 'mock name';
    const index = 1;
    const employer = '';
    expect(generateKey(name, index, employer)).toBe('mock name_1_');
  });
});

describe('triggerLogout utils function', () => {
  mockGetSdkConfigWithBasepath();

  (window as any).PCore = {
    getContainerUtils: jest.fn(() => ({
      getActiveContainerItemContext: jest.fn(),
      closeContainerItem: jest.fn(),
      getDataPageUtils: jest.fn()
    })),
    getDataPageUtils: jest.fn(() => ({
      getPageDataAsync: jest.fn().mockResolvedValue({ URLResourcePath2: 'feedback' })
    }))
  };

  Object.defineProperty(window, 'location', {
    value: { href: 'signout' },
    writable: true
  });

  test('verify triggerLogout for signout click', async () => {
    await act(async () => {
      triggerLogout(false);
    });

    expect(PCore.getContainerUtils).toHaveBeenCalled();
    expect(PCore.getDataPageUtils).toHaveBeenCalled();
    expect(window.location.href).toBe('feedback');
  });
});

describe('formatCurrency util function', () => {
  test('should format number to currency with variable decimal places', () => {
    expect(formatCurrency(1234.5)).toBe('£1,234.50');
    expect(formatCurrency(1234)).toBe('£1,234.00');
    expect(formatCurrency(0)).toBe('£0.00');
  });

  test('should format string to currency with variable decimal places', () => {
    expect(formatCurrency('1234.5')).toBe('£1,234.50');
  });

  test('should handle undefined, NaN and null values', () => {
    expect(formatCurrency(undefined)).toBe('');
    expect(formatCurrency(null)).toBe('');
    expect(formatCurrency(NaN)).toBe('£0.00');
    expect(formatCurrency('')).toBe('£0.00');
  });

  test('should truncate to whole number', () => {
    expect(formatCurrency(1234.3278, true)).toBe('£1,234');
    expect(formatCurrency(1234.9999, true)).toBe('£1,235');
  });

  test('should replace - with − for negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('−£1,234.56');
    expect(formatCurrency('-1234.56')).toBe('−£1,234.56');
  });
});
