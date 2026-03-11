import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NonCodedIncome() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='govuk-heading-l'>{t('WHAT_IS_NON_CODED_INCOME')}</h1>
      <p className='govuk-body'>{t('NON_CODED_INCOME_EARNINGS_NOT_INCLUDED')}</p>
      <p className='govuk-body'>{t('IT_COULD_BE')}</p>
      <ul className='govuk-list govuk-list--bullet'>
        <li>{t('RENTAL_INCOME_PROPERTY')}</li>
        <li>{t('PROFITS_SELF_EMPLOYMENT')}</li>
        <li>{t('SAVINGS_INTEREST_DIVIDENDS')}</li>
        <li>{t('FOREIGN_INCOME')}</li>
      </ul>
    </>
  );
}
