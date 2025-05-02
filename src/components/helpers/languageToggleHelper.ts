import { i18n } from 'i18next';
import setPageTitle from './setPageTitleHelpers';
import dayjs from 'dayjs';

const languageToggle = async (lang: string, i18nRef: i18n, dataBundles: string[] = []) => {
  sessionStorage.setItem('rsdk_locale', `${lang}_GB`);
  dayjs.locale(lang);
  i18nRef.changeLanguage(lang).then(() => {
    setPageTitle();
  });

  if (typeof PCore !== 'undefined') {
    const { GENERIC_BUNDLE_KEY } = PCore.getLocaleUtils();

    // common bundles for all applications
    const commonBundles = [
      GENERIC_BUNDLE_KEY,
      '@BASECLASS!DATAPAGE!D_NATIONALITYLIST',
      '@BASECLASS!DATAPAGE!D_COUNTRYLISTSORTEDBYCOUNTRY'
    ];

    const resourceBundles = [...commonBundles, ...dataBundles];

    PCore.getEnvironmentInfo().setLocale(`${lang}_GB`);
    PCore.getLocaleUtils().resetLocaleStore();
    await PCore.getLocaleUtils().loadLocaleResources(resourceBundles);

    PCore.getPubSubUtils().publish('languageToggleTriggered', { language: lang, localeRef: [] });
  }
};

// Bundles  for IABD
const loadBundles = async (lang: string) => {
  if (typeof PCore !== 'undefined') {
    const { GENERIC_BUNDLE_KEY } = PCore.getLocaleUtils();

    const bundles = [
      GENERIC_BUNDLE_KEY,
      '@BASECLASS!DATAPAGE!D_AAREFERENCEDATALIST',
      '@BASECLASS!DATAPAGE!D_NATIONALITYLIST',
      '@BASECLASS!DATAPAGE!D_COUNTRYLISTSORTEDBYCOUNTRY',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!WHENWEREYOUPAIDTEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!EMPLOYMENTSTARTDATETEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-PERSON!VIEW!PHONENUMBERREADONLY',
      'HMRC-PAYE-WORK-IABD-MISSINGEMP!VIEW!CHECKYOURANSWERSFIELD',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!ENTERPAYROLLNUMBERTEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!PAYROLLIDREADONLY',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!PAYEREFERENCEREADONLY'
    ];

    const resourceBundles = [...bundles];

    PCore.getEnvironmentInfo().setLocale(lang);
    PCore.getLocaleUtils().resetLocaleStore();
    await PCore.getLocaleUtils().loadLocaleResources(resourceBundles);
  }
};

export default languageToggle;
export { loadBundles };
