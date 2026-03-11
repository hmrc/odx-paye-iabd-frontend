import React from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapperFull from '../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import { formatDate, getCurrentLang } from '../../../components/helpers/utils';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface TaxSummaryListAnnualCoding {
  AnnualCodingAvailable: string;
  TaxYearEndDate: string;
  TaxYearStartDate: string;
  pyTemplateDataField?: string;
}

interface TaxSummaryList {
  TaxSummaryList: TaxSummaryListAnnualCoding[];
}

interface AnnualCodingData {
  Customer: TaxSummaryList;
}
interface LandingPageProps {
  redirectCurrentYearPage: any;
  handleLinkClick: any;
  annualCodingData: AnnualCodingData;
  userFullName?: string;
  redirectAnnualCodingTemplatePage: (params: { templateValue: string; pageName: string }) => void;
}

const LandingPage = (props: LandingPageProps) => {
  const {
    redirectCurrentYearPage,
    handleLinkClick,
    annualCodingData,
    userFullName,
    redirectAnnualCodingTemplatePage
  } = props;

  const { t } = useTranslation();
  const lang = getCurrentLang();

  const isAnnualCodingAvailable: boolean =
    annualCodingData?.Customer?.TaxSummaryList?.[0]?.AnnualCodingAvailable?.toLowerCase() === 'yes';

  const annualCodingTemplateValue =
    annualCodingData?.Customer?.TaxSummaryList?.[0]?.pyTemplateDataField || '';

  const taxYearStartDateAnnualCoding: string = formatDate(
    annualCodingData?.Customer?.TaxSummaryList?.[0]?.TaxYearStartDate
  );

  const annualCodingCIPAttributes =
    annualCodingTemplateValue === ''
      ? {
          'data-tracking-type': 'Outbound',
          'data-tracking-target': `Check if your tax code will change </check-income-tax/income-tax-comparison>`
        }
      : {};

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  const getAnnualCodingCIPPageName = (templateValue: string) => {
    switch (templateValue) {
      case 'CHECKYOURTAXCODE':
        return 'Check your tax code';
      case 'NOTAXCODECHANGE':
        return 'Income tax stays the same';
      default:
        return '';
    }
  };

  const handleAnnualCodingClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    templateValue: string
  ) => {
    e.preventDefault();
    if (templateValue) {
      const pageName = getAnnualCodingCIPPageName(templateValue);
      redirectAnnualCodingTemplatePage({ templateValue, pageName });
    } else {
      handleLinkClick('/check-income-tax/income-tax-comparison');
    }
  };

  return (
    <MainWrapperFull title={t('PAY_AS_YOU_EARN', { lng: 'en' })}>
      <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
          <span className='govuk-caption-xl '>{userFullName}</span>
          <h1 className='govuk-heading-xl govuk-!-margin-bottom-0'>{t('PAY_AS_YOU_EARN')}</h1>
          <div className='govuk-inset-text govuk-!-margin-top-2 govuk-!-margin-bottom-6'>
            <a
              className='govuk-link'
              href='#'
              data-tracking-type='Outbound'
              data-tracking-target={`${t('VIEW_AND_SAVE_YOUR_NATIONAL_INSURANCE_NUMBER')} /save-your-national-insurance-number`}
              onClick={e => handleNavClick(e, '/save-your-national-insurance-number')}
              rel='noopener norefferer noreferrer'
            >
              {t('VIEW_AND_SAVE_YOUR_NATIONAL_INSURANCE_NUMBER')}
            </a>
          </div>
          <h2 className='govuk-heading-m govuk-!-margin-top-4 govuk-!-margin-bottom-1'>
            {t('PAYE_SERVICES')}
          </h2>
          <ul className='hmrc-card__container'>
            {isAnnualCodingAvailable && (
              <li className='hmrc-card'>
                <h3 className='hmrc-card__heading'>
                  <a
                    href='#'
                    {...annualCodingCIPAttributes}
                    onClick={e => handleAnnualCodingClick(e, annualCodingTemplateValue)}
                    className='govuk-link govuk-link--no-underline'
                  >
                    {`${t('CHECK_NEXT_TAX_YEAR')} ${taxYearStartDateAnnualCoding}`}
                    <svg
                      className='govuk-button__start-icon'
                      xmlns='http://www.w3.org/2000/svg'
                      width='13.5'
                      height='14'
                      viewBox='0 0 33 40'
                      aria-hidden='true'
                      focusable='false'
                    >
                      <path fill='currentColor' d='M0 0h13l20 20-20 20H0l20-20z'></path>
                    </svg>
                  </a>
                </h3>
              </li>
            )}
            <li className='hmrc-card'>
              <h3 className='hmrc-card__heading'>
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault();
                    redirectCurrentYearPage();
                  }}
                  className='govuk-link govuk-link--no-underline'
                >
                  {t('CHECK_CURRENT_TAX_YEAR')}
                  <svg
                    className='govuk-button__start-icon'
                    xmlns='http://www.w3.org/2000/svg'
                    width='13.5'
                    height='14'
                    viewBox='0 0 33 40'
                    aria-hidden='true'
                    focusable='false'
                  >
                    <path fill='currentColor' d='M0 0h13l20 20-20 20H0l20-20z'></path>
                  </svg>
                </a>
              </h3>
            </li>
            <li className='hmrc-card'>
              <h3 className='hmrc-card__heading'>
                <a
                  href='#'
                  data-tracking-type='Outbound'
                  data-tracking-target={`${t('VIEW_AND_PRINT_INCOME_TAX_AND_EMPLOYMENT_HISTORY', { lng: 'en' })} /check-income-tax/income-tax-history`}
                  onClick={e => handleNavClick(e, '/check-income-tax/income-tax-history')}
                  className='govuk-link govuk-link--no-underline'
                >
                  {t('VIEW_EMPLOYMENT_PENSION_INCOME_TAX_HISTORY')}
                  <svg
                    className='govuk-button__start-icon'
                    xmlns='http://www.w3.org/2000/svg'
                    width='13.5'
                    height='14'
                    viewBox='0 0 33 40'
                    aria-hidden='true'
                    focusable='false'
                  >
                    <path fill='currentColor' d='M0 0h13l20 20-20 20H0l20-20z'></path>
                  </svg>
                </a>
              </h3>
            </li>
          </ul>
        </div>
      </div>
    </MainWrapperFull>
  );
};

export default withPageTracking(LandingPage);
