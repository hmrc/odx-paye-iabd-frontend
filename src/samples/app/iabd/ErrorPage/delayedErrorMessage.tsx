import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../../components/BaseComponents/MainWrapper';

interface DelayedErrorMessageProps {
  showInstantly: boolean;
  accessGroupMsg: boolean;
}

const DelayedErrorMessage = ({ showInstantly, accessGroupMsg }: DelayedErrorMessageProps) => {
  const { t } = useTranslation();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (!showInstantly || !accessGroupMsg) {
      const timer = setTimeout(() => {
        setShowErrorMessage(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowErrorMessage(true);
    }
  }, [showInstantly, accessGroupMsg]);

  const TBCredirectUrl = 'https://tax.service.gov.uk/personal-account';
  if (!accessGroupMsg) {
    return (
      <>
        {showErrorMessage && (
          <MainWrapper>
            <h1 className='govuk-heading-l'>{t('SORRY_THE_SERVICE_IS_UNAVAILABLE')}</h1>
            <p className='govuk-body govuk-!-font-weight-regular'>
              {t('SHUTTER_USE_SERVICE_LATER_MESSAGE')}
            </p>
          </MainWrapper>
        )}
      </>
    );
  } else {
    return (
      <>
        {showErrorMessage && (
          <>
            <p className='govuk-body govuk-!-font-weight-regular'>
              {t('YOU_DO_NOT_HAVE_ACCESS')}
              <span className='govuk-body govuk-!-font-weight-bold'>{t('PAYE')}</span>
              {t('PORTAL')}
            </p>
            <p className='govuk-body govuk-!-font-weight-regular'>
              {t('PLEASE_USE_YOUR')}
              <span className='govuk-body govuk-!-font-weight-bold'>
                <a href={TBCredirectUrl} className='govuk-link' rel='noreferrer noopener'>
                  {t('PERSONAL_TAX_ACCOUNT')}
                </a>
              </span>
            </p>
          </>
        )}
      </>
    );
  }
};

export default DelayedErrorMessage;
