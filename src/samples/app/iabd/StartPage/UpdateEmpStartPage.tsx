import React, { useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { StartButton as GDSStartButton } from 'hmrc-gds-react-components';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';

const UpdateEmpStartPage: React.FC<{
  onStart: () => void;
  onBack?: any;
  EmploymentPeriod?: number;
}> = ({ onStart, onBack, EmploymentPeriod }) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading } = useServiceShuttered();

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
        pageIsLoading={isLoading}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
        <>
          <Button
            variant='backlink'
            onClick={onBack}
            key='StartPageBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull title={t('TELL_US_IF_YOU_HAVE_STOPPED_WORKING', { lng: 'en' })}>
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
                  {`${t('YOU_CAN_ONLY_USE_IF_ATLEAST')} ${EmploymentPeriod} ${t('DAYS_SINCE_EMPLOYMENT_END')}`}
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
                <p className='govuk-body'>{t('FROM_PART_1A_YOU_WILL_NEED_TO_PROVIDE_SOME')}:</p>
                <ul className='govuk-list govuk-list--bullet govuk-!-margin-bottom-6'>
                  <li>{t('THE_DATE_YOU_LEFT')}</li>
                  <li>{t('THE_LEAVING_TAX_CODE')}</li>
                  <li>{t('THE_WEEK_OR_MONTH_NUMBER')}</li>
                  <li>{t('THE_TOTAL_PAY_AND_TAX')}</li>
                </ul>
                <GDSStartButton href='#' onClick={() => onStart()} text={t('START_NOW')} />
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default UpdateEmpStartPage;
