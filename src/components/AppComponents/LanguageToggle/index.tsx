import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/cy';
import languageToggle from '../../helpers/languageToggleHelper';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  let lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [selectedLang, setSelectedLang] = useState(lang);

  const changeLanguage = async e => {
    e.preventDefault();
    lang = e.currentTarget.getAttribute('lang');
    setSelectedLang(lang);
    setSelectedLang(lang);
    // Bundles specific to IABD
    const dataBundles = [
      '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!WHENWEREYOUPAIDTEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!EMPLOYMENTSTARTDATETEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!WHENWEREYOUPAIDTEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-PERSON!VIEW!PHONENUMBERREADONLY',
      'HMRC-PAYE-WORK-IABD-MISSINGEMP!VIEW!CHECKYOURANSWERSFIELD',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!ENTERPAYROLLNUMBERTEMPMISSINGEMP_EMPLOYMENT',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!PAYROLLIDREADONLY',
      'HMRCCONSTELLATION-DATA-EMPLOYMENT!VIEW!PAYEREFERENCEREADONLY'
    ];
    await languageToggle(lang, i18n, dataBundles);
  };

  useEffect(() => {
    if (!sessionStorage.getItem('rsdk_locale')) {
      sessionStorage.setItem('rsdk_locale', `en_GB`);
      dayjs.locale('en');
    } else {
      const currentLang = sessionStorage.getItem('rsdk_locale').slice(0, 2).toLowerCase();
      dayjs.locale(currentLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = selectedLang;
  }, [selectedLang]);

  return (
    <nav id='hmrc-language-toggle' className='hmrc-language-select' aria-label='Language switcher'>
      <ul className='hmrc-language-select__list'>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'en' ? (
            <span aria-current='true'>English</span>
          ) : (
            <a href='#' onClick={changeLanguage} lang='en' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Change the language to English</span>
              <span aria-hidden='true'>English</span>
            </a>
          )}
        </li>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'cy' ? (
            <span aria-current='true'>Cymraeg</span>
          ) : (
            <a href='#' onClick={changeLanguage} lang='cy' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Newid yr iaith ir Gymraeg</span>
              <span aria-hidden='true'>Cymraeg</span>
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default LanguageToggle;
