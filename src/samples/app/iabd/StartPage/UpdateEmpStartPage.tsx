import React, { useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';

const UpdateEmpStartPage: React.FC<{
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
      {' '}
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
                <h1 className='govuk-heading-l'>{t('TELL_US_IF_YOU_HAVE_STOPPED_WORKING')}</h1>
                <p className='govuk-body'>
                  {t('USE_THIS_SERVICE_TO_TELL_US_ABOUT_A_JOB')},{' '}
                  {t('IF_YOUR_INCOME_TAX_SUMMARY_IS_NOT_SHOWING')}.
                </p>
                <h2 className='govuk-heading-m'>{t('BEFORE_YOU_START')}</h2>
                <p className='govuk-body'>
                  {t('YOU_WILL_NEED_P45_PART_1A_FROM_YOUR_EMPLOYMENT')}.{' '}
                  {t('YOUR_EMPLOYER_SHOULD_HAVE_SENT_THIS_TO_YOU')}.
                </p>
                <p className='govuk-body'>
                  {t('IF_YOU_DO_NOT_KNOW_WHAT_A_P45')}
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a
                    className='govuk-link'
                    href='https://www.gov.uk/paye-forms-p45-p60-p11d'
                    target='_blank'
                    rel='noopener norefferer'
                  >
                    {t('READ_THE_WORKERS_GUIDE_TO_P45')} {t('OPENS_IN_NEW_TAB')}
                  </a>
                  .
                </p>
                <div className='govuk-inset-text'>
                  {t('BY_LAW_YOUR_EMPLOYER_MUST_GIVE_YOU_A_P45')}.{' '}
                  {t('IF_YOU_DO_NOT_HAVE_ONE_CONTACT_THEM')}.
                </div>
                <p className='govuk-body'>{t('FROM_PART_1A_YOU_WILL_NEED_TO_PROVIDE_SOME')}:</p>
                <ul className='govuk-list govuk-list--bullet govuk-!-margin-bottom-6'>
                  <li>{t('THE_DATE_YOU_LEFT')}</li>
                  <li>{t('THE_LEAVING_TAX_CODE')}</li>
                  <li>{t('THE_WEEK_OR_MONTH_NUMBER')}</li>
                  <li>{t('THE_TOTAL_PAY_AND_TAX')}</li>
                </ul>
                <Button variant='start' onClick={() => onStart()}>
                  {t('START_NOW')}
                </Button>
              </div>
            </div>
          </MainWrapperFull>
        </>
      )}
      {serviceShuttered && <ShutterServicePage />}
    </>
  );
};

export default UpdateEmpStartPage;
