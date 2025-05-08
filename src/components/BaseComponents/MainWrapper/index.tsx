import React from 'react';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';
import { useTranslation } from 'react-i18next';

export default function MainWrapper({ children }) {
  const { t } = useTranslation();
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();

  return (
    <main className='govuk-main-wrapper' id='main-content' role='main'>
      <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
          {children}
          <p className='govuk-body'>
            <a
              lang='en'
              className='govuk-link hmrc-report-technical-issue '
              rel='noreferrer noopener'
              target='_blank'
              href={`${hmrcURL}contact/report-technical-problem?newTab=true&service=422&referrerUrl=${referrerURL}`}
            >
              {t('PAGE_NOT_WORKING_PROPERLY')} {t('OPENS_IN_NEW_TAB')}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
