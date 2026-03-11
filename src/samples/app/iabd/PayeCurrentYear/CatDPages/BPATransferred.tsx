import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BPATransferred() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_IS_BPA_TRANSFERRED')}</h1>
      <p className='govuk-body'>{t('WHERE_YOU_UNUSED_BPA')}</p>
      <p className='govuk-body'>{t('BECAUSE_YOU_ALWAYS_ENTITLED_BPA')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
