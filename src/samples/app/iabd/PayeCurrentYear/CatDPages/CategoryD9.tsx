import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryD9Props {
  handleDetailExplainerLinkClick: (content: string) => void;
}

export default function CategoryD9({ handleDetailExplainerLinkClick }: CategoryD9Props) {
  const { t } = useTranslation();
  const linkName = t('WHAT_IS_BPA_RECEIVED');
  const componentName = 'BPAReceived';

  return (
    <>
      <p className='govuk-body'>{t('IF_THIS_CHANGES_AMOUNT_TAX_LIABLE_PAY')}</p>
      <p className='govuk-body'>{t('IF_WE_NEED_WE_UPDATE_TAX_CODE')}</p>
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
