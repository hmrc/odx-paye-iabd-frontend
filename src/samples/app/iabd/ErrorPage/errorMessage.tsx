import React from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../../components/BaseComponents/MainWrapper';

const ErrorMessage = () => {
  const { t } = useTranslation();

  return (
    <MainWrapper title={t('SORRY_THE_SERVICE_IS_UNAVAILABLE', { lng: 'en' })}>
      <h1 className='govuk-heading-l'>{t('SORRY_THE_SERVICE_IS_UNAVAILABLE')}</h1>
      <p className='govuk-body'>{t('SHUTTER_USE_SERVICE_LATER_MESSAGE')}</p>
    </MainWrapper>
  );
};

export default ErrorMessage;
