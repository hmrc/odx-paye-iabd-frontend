import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryC() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('EXPLAINER_CAT_C')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_DO_ANYTHING')}</p>
    </>
  );
}
