import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BenefitKind() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_IS_BENEFIT_IN_KIND')}</h1>
      <p className='govuk-body'>{t('AS_EMPLOYEE_COMPANY_BENEFITS_ACOMMODATION')}</p>
      <p className='govuk-body'>{t('THE_AMOUNT_PAY_DEPENDS_KIND_BENEFITS')}</p>
      <p className='govuk-body'>
        {t('YOU_CAN_FIND_MORE_INFO_BENEFIT_KIND')}{' '}
        <a
          href='https://www.gov.uk/tax-company-benefits'
          target='_blank'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('THE_GUIDANCE_ON_TAX_COMPANY_BENEFITS')} https://www.gov.uk/tax-company-benefits`}
          className='govuk-link'
          rel='noreferrer noopener'
        >
          {t('THE_GUIDANCE_ON_TAX_COMPANY_BENEFITS')}
        </a>
        .
      </p>
    </>
  );
}
