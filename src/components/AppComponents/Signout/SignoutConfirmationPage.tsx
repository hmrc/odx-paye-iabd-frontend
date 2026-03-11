import React, { useEffect } from 'react';

import Button from '../../BaseComponents/Button/Button';

import { useTranslation } from 'react-i18next';
import MainWrapper from '../../BaseComponents/MainWrapper';
import AppHeader from '../AppHeader';
import AppFooter from '../AppFooter';
import setPageTitle from '../../helpers/setPageTitleHelpers';

const SignoutConfirmationPage = () => {
  const { t } = useTranslation();

  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  useEffect(() => {
    setPageTitle();
  }, [lang]);

  const handleSignIn = e => {
    e.target.blur();
    window.location.href = '/paye/iabd/';
  };

  return (
    <>
      <AppHeader />
      <div className='govuk-width-container'>
        <MainWrapper title={t('FOR_SECURITY_WE_SIGNED_YOU_OUT', { lng: 'en' })}>
          <h1 className='govuk-heading-xl'>{t('FOR_SECURITY_WE_SIGNED_YOU_OUT')}</h1>

          <div className='govuk-form-group'>
            <Button
              variant='primary'
              onClick={handleSignIn}
              attributes={{
                type: 'button',
                className: 'govuk-button govuk-!-margin-bottom-0'
              }}
            >
              {t('SIGN_IN')}
            </Button>
          </div>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
};

export default SignoutConfirmationPage;
