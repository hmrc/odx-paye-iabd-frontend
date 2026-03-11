import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryD4() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('WE_DO_NOT_CHARGE_TAX_CODE_CASUAL')}</p>
      <p className='govuk-body'>{t('AFTER_CHECK_YOU_PAID_RIGHT_TAX_WE_SEND_CALCULATION_LETTER')}</p>
      <p className='govuk-body'>{t('IF_YOU_FILE_SA_TAX_RETURN_CASUAL_EARNINGS')}</p>
    </>
  );
}
