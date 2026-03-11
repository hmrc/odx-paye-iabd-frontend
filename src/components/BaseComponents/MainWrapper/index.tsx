import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';
import { useTranslation } from 'react-i18next';
import BetaBanner from '../../helpers/navbar/banner';

export default function MainWrapper({ children, title }) {
  const { t } = useTranslation();
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();
  const requestURI = `contact/report-technical-problem?newTab=true&service=IABD&referrerUrl=${referrerURL}`;

  return (
    <>
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
                href={`${hmrcURL}${requestURI}`}
                data-tracking-type='Outbound'
                data-tracking-target={`Page not working properly <${title}> </${requestURI}>`}
              >
                {t('PAGE_NOT_WORKING_PROPERLY')} {t('OPENS_IN_NEW_TAB')}
              </a>
            </p>
          </div>
        </div>
      </main>
      <BetaBanner title={title} />
    </>
  );
}
