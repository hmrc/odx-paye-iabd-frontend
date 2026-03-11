import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryD10() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('THIS_IS_TO_RECOVER_CHB')}</p>
      <p className='govuk-body'>
        {t('YOU_CAN_FIND_MORE_INFO_CHB')}{' '}
        <a
          href='https://www.gov.uk/child-benefit-tax-charge'
          target='_blank'
          rel='noreferrer noopener'
          className='govuk-link'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('THE_GUIDANCE_ON_HIGH_INCOME_CHILD_BENEFIT_CHARGE')} https://www.gov.uk/child-benefit-tax-charge`}
        >
          {t('THE_GUIDANCE_ON_HIGH_INCOME_CHILD_BENEFIT_CHARGE')}
        </a>
        .
      </p>
      <p className='govuk-body'>{t('IF_THIS_CHANGE_TX_AMOUNT_ADJUST_LIABLE_D10')}</p>
      <p className='govuk-body'>{t('IF_WE_NEED_UPDATE_TAX_CODE')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
