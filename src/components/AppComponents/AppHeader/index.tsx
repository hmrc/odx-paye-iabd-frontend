import React from 'react';
import { useTranslation } from 'react-i18next';
import { GOVUKHeader } from 'hmrc-gds-react-components';

export default function AppHeader() {
  const { t } = useTranslation();

  return (
    <>
      <a href='#main-content' className='govuk-skip-link' data-module='govuk-skip-link'>
        {t('SKIP_TO_MAIN')}
      </a>
      <GOVUKHeader
        govUkLogo={{ brandRefresh: true }}
        serviceName={{ label: t('PAYE_SERVICE'), href: '' }}
      />
    </>
  );
}
