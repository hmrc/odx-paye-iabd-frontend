import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TotalGiftAid() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_ARE_GIFT_AID_PAYMENTS')}</h1>
      <p className='govuk-body'>{t('WHEN_MAKING_GIFT_AID_PAYMENTS')}</p>
      <p className='govuk-body'>{t('CUSTOMERS_LIVING_IN_UK_WHO_PAY_TAX')}</p>
      <p className='govuk-body'>{t('CUSTOMERS_LIVING_IN_SCOTLAND')}</p>
      <p className='govuk-body'>{t('WE_HAVE_INCLUDED_ADDITIONAL_TAX_FREE_ALLOWANCE')}</p>
      <p className='govuk-body'>
        {t('YOU_CAN_FIND_MORE_INFO_IN')}
        <a
          href='https://www.gov.uk/donating-to-charity/gift-aid'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('GUIDANCE_ON_DONATE_TO_CHARITY')} https://www.gov.uk/donating-to-charity/gift-aid`}
          target='_blank'
          className='govuk-link'
          rel='noreferrer noopener'
        >
          {t('GUIDANCE_ON_DONATE_TO_CHARITY')}
        </a>
        .
      </p>
    </>
  );
}
