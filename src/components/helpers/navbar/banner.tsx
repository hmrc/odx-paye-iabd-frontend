import { useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';

const BetaBanner = ({ title }) => {
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();
  const { t } = useTranslation();
  const requestURI = `contact/beta-feedback?service=IABD&referrerUrl=${referrerURL}`;

  return (
    <>
      <div className='govuk-phase-banner'>
        <p className='govuk-phase-banner__content'>
          <strong className='govuk-tag govuk-phase-banner__content__tag'>{t('BETA')}</strong>
          <span className='govuk-phase-banner__text'>
            {t('THIS_IS_A_NEW_SERVICE')}
            <a
              className='govuk-link'
              target='_blank'
              rel='noreferrer noopener'
              href={`${hmrcURL}${requestURI}`}
              data-tracking-type='Outbound'
              data-tracking-target={`Feedback <${title}> </${requestURI}>`}
            >
              {t('GIVE_YOUR_FEEDBACK')}
            </a>
            .
          </span>
        </p>
      </div>
      <div className='govuk-!-padding-bottom-6'></div>
    </>
  );
};

export default BetaBanner;
