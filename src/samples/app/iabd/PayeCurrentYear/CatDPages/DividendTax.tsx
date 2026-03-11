import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DividendTax() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_IS_DIVIDEND_TAX')}</h1>
      <p className='govuk-body'>{t('YOU_MAY_GET_A_DIVIDEND_PAYMENT_SHARES_IN_COMPANY')}</p>
      <p className='govuk-body'>{t('YOU_ALSO_GET_DIVIDEND_ALLOWANCE_EACH_YEAR_PAY_TAX')}</p>
      <p className='govuk-body'>{t('WE_HAVE_INCLUDED_AN_ADJUSTMENT_TAX_CODE_BASIC_RATE')}</p>
      <p className='govuk-body'>
        {t('YOUC_CAN_FIND_MORE_INFO_DIVIDENDS')}
        <a
          href='https://www.gov.uk/tax-on-dividends'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('THE_GUIDANCE_ON_TAX_DIVIDENDS')} https://www.gov.uk/tax-on-dividends`}
          target='_blank'
          rel='noreferrer noopener'
          className='govuk-link'
        >
          {t('THE_GUIDANCE_ON_TAX_DIVIDENDS')}
        </a>
        .
      </p>
    </>
  );
}
