import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryD6() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('THIS_IS_AMOUNT_PERSONAL_ALLOWANCE_CIVIL_PARTNER')}</p>
      <p className='govuk-body'>{t('THIS_GIVES_SPOUSE_CIVIL_PARTNER_TAX_CREDIT')}</p>
      <h2 className='govuk-heading-m'>{t('WHAT_HAPPENS_NEXT')}</h2>
      <p className='govuk-body'>{t('WE_WILL_ADJUST_TAX_FREE_ALLOWANCE_MAKE_SURE_CORRECT_TAX')}</p>
      <p className='govuk-body'>{t('YOUR_UPDATE_TAX_CODE_USUALLY_INCLUDE_LETTER_N')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
