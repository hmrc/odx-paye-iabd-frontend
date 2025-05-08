import { TESObject } from '../../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';
import { t } from 'i18next';

export const getEmploymentName = (empName: string) => {
  return empName?.toLowerCase() === 'not available' ? t('NOT_AVAILABLE') : empName;
};

export const getContentOnLanguageSelection = (content: TESObject[]) => {
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  return content?.find(contentObj => contentObj.Language.toLowerCase() === lang);
};

export const getKey = (item: { Content: TESObject[] }) => {
  const keyString = item?.Content?.[0]?.pyKeyString || '';
  return keyString + Math.floor(Math.random() * 100);
};
