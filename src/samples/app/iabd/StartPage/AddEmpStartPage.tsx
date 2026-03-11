import React, { useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { StartButton as GDSStartButton } from 'hmrc-gds-react-components';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

const AddEmpStartPage: React.FC<{
  onStart: () => void;
  onBack?: any;
  dynamicEmpPayPeriod: any;
}> = ({ onStart, onBack, dynamicEmpPayPeriod }) => {
  const { t } = useTranslation();
  const {serviceShuttered, isLoading} = useServiceShuttered();

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
          <MainWrapperFull title={t('TELL_US_ABOUT_A_MISSING_EMPLOYMENT', { lng: 'en' })}>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-l'>{t('TELL_US_ABOUT_A_MISSING_EMPLOYMENT')}</h1>
                <p className='govuk-body'>{t('USE_THIS_SERVICE_TO_TELL')}</p>

                <p className='govuk-body'>
                  {t('DONOT_USE_THIS_SERVICE_IF')} {dynamicEmpPayPeriod}
                  {t('DAYS_SINCE_YOU_RECEIVED_YOUR_FIRST_PAYMENT')}
                </p>

                <h2 className='govuk-heading-m'>{t('BEFORE_YOU_START')}</h2>
                <p className='govuk-body'>{t('YOU_WILL_NEED_TO_PROVIDE_US')}</p>

                <ul className='govuk-list govuk-list--bullet govuk-!-margin-bottom-6'>
                  <li>{t('NAME_OF_YOUR_EMPLOYER')}</li>
                  <li>{t('DATE_YOU_STARTED')}</li>
                  <li>{t('DATE_YOU_RECEIVED_YOUR_FIRST_PAYMENT')}</li>
                </ul>
                <p className='govuk-body'>{t('PROVIDE_DETAILS_FROM_YOUR_PAYSLIP')}</p>
                <ul className='govuk-list govuk-list--bullet govuk-!-margin-bottom-6'>
                  <li>{t('EMPLOYERS_PAYE_REFERENCE')}</li>
                  <li>{t('PAYROLL_NUMBER_IF_YOU_KNOW_IT')}</li>
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

export default withPageTracking(AddEmpStartPage);
