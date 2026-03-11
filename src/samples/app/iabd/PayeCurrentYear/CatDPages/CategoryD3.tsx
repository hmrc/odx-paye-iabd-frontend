import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CategoryD3() {
  const { t } = useTranslation();

  return (
    <>
      <p className='govuk-body'>{t('THIS_INCOME_TAXABLE_DO_NOT_TAKE_OFF_PAYMENTS')}</p>
      <p className='govuk-body'>{t('TO_ENUSRE_PAYING_CORRECT_AMOUNT_TAX')}</p>
      <p className='govuk-body'>
        {t('FOR_MORE_INFO_ON_HOW_STATE_PENSION')}
        <a
          href='https://www.youtube.com/watch?v=sXVaRnrn2eo'
          data-tracking-type='Outbound'
          data-tracking-target={`${t('WATCH_OUR_VIDEO')} https://www.youtube.com/watch?v=sXVaRnrn2eo`}
          target='_blank'
          rel='noreferrer noopener'
          className='govuk-link'
        >
          {t('WATCH_OUR_VIDEO')}
        </a>
        .
      </p>
      <h2 className='govuk-heading-m'>{t('WHAT_HAPPENS_NEXT')}</h2>
      <p className='govuk-body'>{t('WE_WILL_UPDATE_YOUR_TAX_CODE_SO_YOU_PAY_ENTITLED')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
    </>
  );
}
