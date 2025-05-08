import { getContentOnLanguageSelection, getEmploymentName, getKey } from './AllIABDLandingUtils';
import { TESObject } from '../../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';
import { t } from 'i18next';

describe('getContentOnLanguageSelection', () => {
  const mockContent: TESObject[] = [
    { pyKeyString: 'KeyString1', Language: 'en', Name: 'English Content' },
    { pyKeyString: 'KeyString2', Language: 'cy', Name: 'Welsh Content' }
  ];

  beforeEach(() => {
    sessionStorage.clear();
  });

  test('should return the correct content for a given language', () => {
    sessionStorage.setItem('rsdk_locale', 'cy');
    const result = getContentOnLanguageSelection(mockContent);
    expect(result).toEqual(mockContent[1]);
  });

  test('should return English content as default', () => {
    const result = getContentOnLanguageSelection(mockContent);
    expect(result).toEqual(mockContent[0]);
  });
});

describe('getEmploymentName', () => {
  test('should return the employment name if it is available', () => {
    expect(getEmploymentName('EmploymentName')).toBe('EmploymentName');
  });

  test('should return "Not Available" if employment name is not available', () => {
    expect(getEmploymentName('not available')).toBe(t('NOT_AVAILABLE'));
  });
});

describe('getKey', () => {
  const mockData = {
    Content: [{ pyKeyString: 'abc123', Language: 'en', Name: 'English Content' }]
  };

  test('should return a string containing the pyKeyString', () => {
    const key = getKey(mockData);
    expect(key).toMatch(/^abc123\d+$/);
  });

  test('should generate a unique key every time', () => {
    const key1 = getKey(mockData);
    const key2 = getKey(mockData);

    expect(key1).not.toBe(key2);
  });
});
