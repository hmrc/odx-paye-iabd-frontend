import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryD1Props {
  handleDetailExplainerLinkClick: (content: string) => void;
}

export default function CategoryD8({ handleDetailExplainerLinkClick }: CategoryD1Props) {
  const { t } = useTranslation();
  const linkName = t('WHAT_IS_BPA_TRANSFERRED');
  const componentName = 'BPATransferred';

  return (
    <>
      <p className='govuk-body'>{t('WE_HAVE_CALCULATE_SURPLUS_BLIND_PERSONS_ALLOWANCE')}</p>
      <p className='govuk-body'>{t('IF_NECESSARY_WILL_UPDATE_INCOME_TAX')}</p>
      <p className='govuk-body'>{t('SO_THAT_YOU_NOT_PAY_TAX')}</p>
      <p className='govuk-body'>{t('YOU_DO_NOT_HAVE_TO_DO_ANYTHING')}</p>
      <p className='govuk-body'>
        <a
          href='#'
          className='govuk-link'
          onClick={() => handleDetailExplainerLinkClick(componentName)}
        >
          {linkName}
        </a>
      </p>
    </>
  );
}
