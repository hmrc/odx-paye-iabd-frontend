import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withPageTracking } from 'hmrc-odx-features-and-functions';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import Button from '../../../../components/BaseComponents/Button/Button';
import { formatDate } from '../../../../components/helpers/utils';

interface AnnualCodingTemplateProps {
  onBack?: () => void;
  annualCodingTemplateValue: string;
  taxYearStartDate: string;
  handleLinkClick: (link: string) => void;
}

const AnnualCodingTemplate: React.FC<AnnualCodingTemplateProps> = ({
  onBack,
  annualCodingTemplateValue,
  taxYearStartDate,
  handleLinkClick
}) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading } = useServiceShuttered();

  useEffect(() => {
    setPageTitle();
  }, []);

  const handleCheckYourDetailsLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    handleLinkClick('/check-income-tax/income-tax-comparison');
  };

  const getAnnualCondingTemplateContent = (templateValue: string) => {
    switch (templateValue) {
      case 'CHECKYOURTAXCODE':
        return (
          <>
            <h1 className='govuk-heading-xl'>{t('CHECK_YOUR_TAX_CODE')}</h1>
            <p className='govuk-body'>{`${t('YOU_CAN_NOW_SEE_HOW_MUCH_TAX_YOU_WILL_PAY_FROM')} ${formatDate(taxYearStartDate)} ${t('AND_COMPARE_IT_WITH_WHAT_YOU_PAY_THIS_YEAR')}`}</p>
            <p className='govuk-body'>{t('KEEPING_YOUR_PAY_AND_PENSION_DETAILS_UP_TO_DATE')}</p>
            <h2 className='govuk-heading-m govuk-!-padding-top-2'>
              {t('CHECK_THE_FIGURES_WE_HOLD_FOR_YOU')}
            </h2>
            <p className='govuk-body'>{t('YOU_SHOULD')}</p>
            <ul className='govuk-list govuk-list--bullet'>
              <li>{t('CHECK_THE_FIGURES_LOOK_RIGHT')}</li>
              <li>{t('UPDATE_YOUR_ESTIMATED_INCOME_IF_IT_HAS_CHANGED')}</li>
              <li>{t('TELL_US_ABOUT_CHANGES_TO_COMPANY_BENEFITS')}</li>
            </ul>
            <p className='govuk-body'>
              <a
                className='govuk-link'
                data-tracking-type='Outbound'
                data-tracking-target='Check your details </check-income-tax/income-tax-comparison>'
                data-module='govuk-button'
                href='#'
                onClick={handleCheckYourDetailsLinkClick}
              >
                {t('CHECK_YOUR_DETAILS')}
              </a>
            </p>
          </>
        );
      case 'NOTAXCODECHANGE':
        return (
          <>
            <h1>{t('NO_TAX_CODE_CHANGE_INFO')}</h1>
            <p className='govuk-body'>Sample text</p>
          </>
        );
      default:
        return null;
    }
  };

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
                {getAnnualCondingTemplateContent(annualCodingTemplateValue)}
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(AnnualCodingTemplate);
