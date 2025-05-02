import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { generateKey, getCurrentLang, getHeadingContent, truncate } from './utils';
import { mockGetSdkConfigWithBasepath } from '../../../tests/mocks/getSdkConfigMock';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));
jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
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
