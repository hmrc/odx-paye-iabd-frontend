import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import Iabd from '../app/iabd/index';
import CookiePage from '../app/iabd/cookiePage/index';
import Accessibility from '../app/iabd/AccessibilityPage';
import ErrorMessage from '../app/iabd/ErrorPage/errorMessage';
import NoP45InfoPage from '../app/iabd/NoP45InfoPage/NoP45InfoPage';
import ProtectedRoute from '../../components/HOC/ProtectedRoute';
import NoP45PensionInfo from '../app/iabd/NoP45InfoPage/NoP45PensionInfo';

const AppSelector = () => {
  const [i18nloaded, seti18nloaded] = useState(false);
  useEffect(() => {
    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',
        backend: {
          /* translation file path */
          loadPath: `assets/i18n/{{lng}}.json`
        },
        fallbackLng: 'en',
        debug: false,
        returnNull: false,
        react: {
          useSuspense: false
        }
      })
      .finally(() => {
        seti18nloaded(true);
      });
  }, []);

  return !i18nloaded ? null : (
    <Routes>
      <Route path='/' element={<ProtectedRoute component={Iabd} />} />
      <Route path='/cookies' element={<CookiePage />} />
      <Route path='/accessibility' element={<Accessibility />} />
      <Route path='/error' element={<ErrorMessage />} />
      <Route path='/no-information' element={<NoP45InfoPage />} />
      <Route path='/no-pension-info' element={<NoP45PensionInfo />} />
    </Routes>
  );
};

export default AppSelector;
