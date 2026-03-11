import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryD2() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('WE_HAVE_ADJUSTED_YOUR_TAX_FREE_ALLOWANCE_D2')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
