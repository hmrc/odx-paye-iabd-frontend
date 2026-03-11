import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PersonalPensionPay() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_ARE_PERSONAL_PENSION_PAYMENTS')}</h1>
      <p className='govuk-body'>{t('WHEN_MAKING_GROSS_PENSIONAL_PAYMENTS')}</p>
      <p className='govuk-body'>{t('CUSTOMERS_LIVING_IN_UK_PAY_TAX')}</p>
      <p className='govuk-body'>{t('CUSTOMERS_LIVING_IN_SCOTLAND_DIFFERENT_LEVELS')}</p>
      <p className='govuk-body'>{t('WE_INCLUDE_TAX_FREE_ADDITIONAL')}</p>
      <p className='govuk-body'>
        {t('YOU_CAN_FIND_MORE_INFO_IN')}
        <a
          href='https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('THE_GUIDANCE_ON_TAX_PRIVATE_PENSION')} https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief`}
          target='_blank'
          rel='noreferrer noopener'
          className='govuk-link'
        >
          {t('THE_GUIDANCE_ON_TAX_PRIVATE_PENSION')}
        </a>
        .
      </p>
    </>
  );
}
