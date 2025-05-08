import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../../../components/AppComponents/AppHeader';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import AppFooter from '../../../../components/AppComponents/AppFooter';
import useHMRCExternalLinks from '../../../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import BetaBanner from '../../../../components/helpers/navbar/banner';

const NoP45InfoPage = () => {
  const { t } = useTranslation();
  const { referrerURL } = useHMRCExternalLinks();

  useEffect(() => {
    setPageTitle();
  }, [i18next.language]);

  return (
    <>
      <AppHeader appname={t('PAYE_SERVICE')} noNav hasLanguageToggle isPegaApp={false} />

      <div className='govuk-width-container'>
        <MainWrapperFull>
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-two-thirds'>
              <h1 className='govuk-heading-l'>{t('MY_P45_DOES_NOT_HAVE_THE_INFORMATION')}</h1>

              <p className='govuk-body'>
                {t('IF_THE_INFORMATION_WE_ASKED_FOR_IS_NOT_SHOWING')}
                {t('WE_NEED_CERTAIN_DETAILS_FROM_YOUR_P45')}
              </p>

              <p className='govuk-body'>{t('YOU_CAN_CONTACT_YOUR_EMPLOYER_TO_GET_AN_UPDATED')}</p>

              <p className='govuk-body'>
                {t('IF_YOU_HAVE_LOST_CONTACT_WITH_YOUR_EMPLOYER')}
                {t('WE_WILL_THEN_UPDATE_YOUR_EMPLOYMENT_FOR_YOU')}
              </p>

              <p className='govuk-body'>
                <a className='govuk-link' href={`${referrerURL}`}>
                  {t('RETURN_TO_PAYE_INCOME_TAX_SUMMARY')}
                </a>
                .
              </p>
            </div>
          </div>
        </MainWrapperFull>
      </div>
      <BetaBanner />
      <AppFooter />
    </>
  );
};

export default NoP45InfoPage;
