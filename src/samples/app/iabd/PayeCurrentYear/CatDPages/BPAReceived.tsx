import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BPAReceived() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_IS_BPA_RECEIVED')}</h1>
      <p className='govuk-body'>{t('BPA_TRANSFERED_FROM_CLAIMANT')}</p>
      <p className='govuk-body'>{t('WE_HAVE_CALCULATED_BPA_AVAILABLE')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
