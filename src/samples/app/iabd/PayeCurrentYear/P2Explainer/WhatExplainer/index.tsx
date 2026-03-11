import { useTranslation } from 'react-i18next';

interface Props {
  monthlyEarnings: string | null;
}

const WhatExplainer: React.FC<Props> = ({ monthlyEarnings }) => {
  const { t } = useTranslation();

  if (!monthlyEarnings) {
    return null;
  }

  return (
    <>
      <p className='govuk-body'>
        {t('BASED_ON_CURRENT_INCOME')} £{monthlyEarnings}{' '}
        {parseFloat(monthlyEarnings) > 0 ? t('MORE') : t('LESS')} {t('EVERY_MONTH')}
      </p>

      <p className='govuk-body'>{t('THIS_AMOUNT_IS_AN_ESTIMATE')}</p>
    </>
  );
};

export default WhatExplainer;
