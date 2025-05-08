import React, { useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';

const AddEmpStartPage: React.FC<{
  onStart: () => void;
  onBack?: any;
  dynamicEmpPayPeriod: any;
}> = ({ onStart, onBack, dynamicEmpPayPeriod }) => {
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
                <div>
                  <Button onClick={() => onStart()}>{t('START_NOW')}</Button>
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

export default AddEmpStartPage;
