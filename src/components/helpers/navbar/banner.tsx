import React from 'react';
import { useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';

const BetaBanner = () => {
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();
  const { t } = useTranslation();

  return (
    <div className='govuk-width-container'>
      <div className='govuk-phase-banner'>
        <p className='govuk-phase-banner__content'>
          <strong className='govuk-tag govuk-phase-banner__content__tag'>{t('BETA')}</strong>
          <span className='govuk-phase-banner__text'>
            {t('THIS_IS_A_NEW_SERVICE')}
            <a
              className='govuk-link'
              target='_blank'
              rel='noreferrer noopener'
              href={`${hmrcURL}contact/beta-feedback?service=422&referrerUrl=${referrerURL}`}
            >
              {t('GIVE_YOUR_FEEDBACK')}
            </a>
            .
          </span>
        </p>
      </div>
      <div className='govuk-!-padding-bottom-6'></div>
    </div>
  );
};

export default BetaBanner;
