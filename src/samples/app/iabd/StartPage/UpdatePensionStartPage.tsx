import React, { useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';

const UpdatePensionStartPage: React.FC<{
  onStart: () => void;
  onBack?: any;
}> = ({ onStart, onBack }) => {
  const { t } = useTranslation();
  const serviceShuttered = useServiceShuttered();

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <>
      {!serviceShuttered && (
        <>
          <Button
            variant='backlink'
            onClick={onBack}
            key='StartPageBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-l'>
                  {t('TELL_US_IF_YOU_HAVE_STOPPED_RECEIVING_PENSION_PAYMENTS')}
                </h1>
                <p className='govuk-body'>
                  {t('USE_THIS_SERVICE_TO_TELL_US_ABOUT_PENSION_YOU_HAVE_STOPPED_RECEIVING')}
                </p>
                <h2 className='govuk-heading-m'>{t('BEFORE_YOU_START')}</h2>
                <p className='govuk-body'>
                  {t('YOU_WILL_NEED_P45_PART_1A_FROM_YOUR_PENSION_PROVIDER')}
                </p>
                <p className='govuk-body'>
                  {t('IF_YOU_DO_NOT_KNOW_WHAT_A_P45_IS')}
                  <a
                    lang='en'
                    className='govuk-link hmrc-report-technical-issue '
                    rel='noreferrer noopener'
                    target='_blank'
                    href='https://www.gov.uk/paye-forms-p45-p60-p11d'
                  >
                    {t('READ_THE_WORKERS_GUILD_TO_P45')}
                  </a>
                </p>
                <p className='govuk-body'>
                  {t('FROM_PART_1A_YOU_WILL_NEED_TO_PROVIDE_SOME_DETAILS')}
                </p>

                <ul className='govuk-list govuk-list--bullet govuk-!-margin-bottom-6'>
                  <li>{t('THE_LEAVING_DATE')}</li>
                  <li>{t('THE_LEAVING_TAX_CODE')}</li>
                  <li>{t('THE_WEEK_OR_MONTH_NUMBER')}</li>
                  <li>{t('THE_TOTAL_PAY_AND_TAX')}</li>
                </ul>
                <div>
                  <Button variant='start' onClick={() => onStart()}>
                    {t('START_NOW')}
                  </Button>
                </div>
              </div>
            </div>
          </MainWrapperFull>
        </>
      )}
      {serviceShuttered && <ShutterServicePage />}
    </>
  );
};

export default UpdatePensionStartPage;
