import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryD5() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>
        {t('THIS_IS_LUMP_SUM_PAID_WHEN_YOU_DECIDE_TAKE_OFF_YOUR_STATE_PENSION')}
      </p>
      <p className='govuk-body'>{t('SPECIAL_RULES_APPLIED_WHEN_CALCULATE_LUMP_SUM')}</p>
      <p className='govuk-body'>{t('YOU_WILL_BE_TAXED_YOUR_HIGHEST_RATE_LIABLE')}</p>
      <p className='govuk-body'>{t('IF_INCOME_EXCEEDS_PERSONAL_ALLOWANCE_LUMP_SUM')}</p>
      <p className='govuk-body'>{t('DIFFERENT_RATES_APPLY_IF_SCOTTISH')}</p>
      <p className='govuk-body'>{t('WE_ALSO_TAKE_ACCOUNT_DWP')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
