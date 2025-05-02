import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';
import MainWrapperFull from '../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import {
  formatDate,
  getCurrentLang,
  getTaxCodeForTimeline,
  getHeadingContent
} from '../../../components/helpers/utils';
import i18next from 'i18next';

interface TaxSummaryListAnnualCoding {
  AnnualCodingAvailable: string;
  TaxYearEndDate: string;
  TaxYearStartDate: string;
}

interface TaxSummaryList {
  TaxSummaryList: TaxSummaryListAnnualCoding[];
}

interface AnnualCodingData {
  Customer: TaxSummaryList;
}
interface LandingPageProps {
  employmentTaxData: any;
  redirectCurrentYearPage: any;
  handleLinkClick: any;
  redirecLatestEventPage: any;
  annualCodingData: AnnualCodingData;
}

const LandingPage = (props: LandingPageProps) => {
  const {
    employmentTaxData,
    redirectCurrentYearPage,
    handleLinkClick,
    redirecLatestEventPage,
    annualCodingData
  } = props;

  const { t } = useTranslation();
  const [fullName, setFullName] = useState<string>('');
  const [latestTimeLineEvents, setLatestTimeLineEvents] = useState<any>(null);
  const lang = getCurrentLang();

  const isAnnualCodingAvailable: boolean =
    annualCodingData?.Customer?.TaxSummaryList?.[0]?.AnnualCodingAvailable?.toLowerCase() === 'yes';
  const taxYearEndDateAnnualCoding: string = formatDate(
    annualCodingData?.Customer?.TaxSummaryList?.[0]?.TaxYearEndDate
  );
  const taxYearStartDateAnnualCoding: string = formatDate(
    annualCodingData?.Customer?.TaxSummaryList?.[0]?.TaxYearStartDate
  );

  const taxYearEndDate: string = formatDate(
    employmentTaxData?.Customer?.TaxSummaryList?.[0]?.TaxYearEndDate
  );
  const taxYearStartDate: string = formatDate(
    employmentTaxData?.Customer?.TaxSummaryList?.[0]?.TaxYearStartDate
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  useEffect(() => {
    try {
      if (employmentTaxData) {
        setFullName(employmentTaxData.Customer.pyFullName);
        const timeLineView = employmentTaxData.Customer.TaxSummaryList[0].TimeLineView;
        setLatestTimeLineEvents(timeLineView && timeLineView.length > 0 ? timeLineView[0] : null);
      }
    } catch (error) {
      console.log('Error processing employment tax data:', error); // eslint-disable-line no-console
    }
    setPageTitle();
  }, [employmentTaxData, i18next.language]);

  return (
    <MainWrapperFull>
      <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
          <span className='govuk-caption-xl '>{fullName}</span>
          <h1 className='govuk-heading-xl govuk-!-margin-bottom-0'>{t('PAY_AS_YOU_EARN')}</h1>
          <div className='govuk-inset-text govuk-!-margin-top-2 govuk-!-margin-bottom-6'>
            <a
              className='govuk-link'
              href='#'
              onClick={e => handleNavClick(e, '/save-your-national-insurance-number')}
              rel='noopener norefferer noreferrer'
            >
              {t('VIEW_AND_SAVE_YOUR_NATIONAL_INSURANCE_NUMBER')}
            </a>
          </div>
          <h2 className='govuk-heading-m govuk-!-margin-top-4 govuk-!-margin-bottom-1'>
            {t('MOST_RECENT_ACTIVITY_IN_YOUR_PAYE')}
          </h2>

          {latestTimeLineEvents ? (
            <>
              <div className='hmrc-card'>
                <h3 className='hmrc-card__heading'>
                  {getHeadingContent(latestTimeLineEvents?.Content, lang)?.Description}
                </h3>
                {latestTimeLineEvents.DisplayDate && (
                  <p className='govuk-hint'>{formatDate(latestTimeLineEvents.DisplayDate)}</p>
                )}

                {latestTimeLineEvents.issuedtaxCode && (
                  <p className='govuk-body'>
                    {getTaxCodeForTimeline(latestTimeLineEvents.issuedtaxCode)}
                  </p>
                )}
              </div>
              <p className='govuk-!-margin-top-1'>
                <a
                  className='govuk-link'
                  href=''
                  onClick={e => {
                    e.preventDefault();
                    redirecLatestEventPage('LandingPage');
                  }}
                >
                  {t('VIEW_ALL_ACTIVITY')}
                </a>
              </p>
            </>
          ) : (
            <p className='govuk-!-margin-top-1 govuk-!-margin-bottom-1 govuk-hint'>
              {t('NO_ACTIVITY_YET')}
            </p>
          )}
          <h2 className='govuk-heading-m govuk-!-margin-top-4 govuk-!-margin-bottom-1'>
            {t('PAYE_SERVICES')}
          </h2>
          <ul className='hmrc-card__container'>
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
              <p className='govuk-body'>
                {`${t('VIEW_YOUR_RECEIVED_PAYMENTS_SOURCES')} ${taxYearStartDate} ${t('DATE_TO')} ${taxYearEndDate}.`}
              </p>
            </li>

            <li className='hmrc-card'>
              <h3 className='hmrc-card__heading'>
                <a
                  href='#'
                  onClick={e => handleNavClick(e, '/check-income-tax/income-tax-history')}
                  className='govuk-link govuk-link--no-underline'
                >
                  {t('VIEW_AND_PRINT_INCOME_TAX_AND_EMPLOYMENT_HISTORY')}
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
              <p className='govuk-body'>{t('GET_A_RECORD_OF_YOUR_EMPLOYMENT')}</p>
            </li>
            {isAnnualCodingAvailable && (
              <li className='hmrc-card'>
                <h3 className='hmrc-card__heading'>
                  <a
                    href='#'
                    onClick={e => handleNavClick(e, '/check-income-tax/income-tax-comparison')}
                    className='govuk-link govuk-link--no-underline'
                  >
                    {t('CHECK_NEXT_TAX_YEAR')}
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
                <p className='govuk-body'>
                  {`${t('VIEW_YOUR_TAX_CODES')} ${taxYearStartDateAnnualCoding} ${t('DATE_TO')} ${taxYearEndDateAnnualCoding}.`}
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
      <hr className='govuk-section-break govuk-section-break--m govuk-section-break--invisible'></hr>
    </MainWrapperFull>
  );
};

export default LandingPage;
