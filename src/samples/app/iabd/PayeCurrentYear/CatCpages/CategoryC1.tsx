import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryC1() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('IF_YOU_ARE_LIABLE_HICBIC')}</p>
      <p className='govuk-body'>{t('IF_WE_NEED_UPDATE_TAX_CODE_CATC1')}</p>
      <p className='govuk-body'>
        {t('YOU_CAN_FIND_MORE_INFO_CATC1')}{' '}
        <a
          href='https://www.gov.uk/child-benefit-tax-charge'
          target='_blank'
          className='govuk-link'
          rel='noreferrer noopener'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('THE_GUIDANCE_HICBIC_CATC1')} https://www.gov.uk/child-benefit-tax-charge`}
        >
          {t('THE_GUIDANCE_HICBIC_CATC1')}
        </a>
        .
      </p>
      <p className='govuk-body'>{t('YOU_DO_NOT_DO_ANYTHING')}</p>
    </>
  );
}
