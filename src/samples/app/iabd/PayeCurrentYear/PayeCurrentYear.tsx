import React, { useEffect, useState } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import { generateKey, formatCurrency } from '../../../../components/helpers/utils';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import i18next from 'i18next';
import CurrentYearTimeLine from './payCurrentYearTimeline';
import SummaryCard from './payCurrentYearCard';
import { DetailsTypes } from './PayeCurrentYearTypes';
import SummaryCardIncomeOtherSources from './IncomeOtherSourcesCard';
import { TimeLineEvent } from '../../../../reuseables/Types/TimeLineEvents';

interface PayeCurrentYearProps {
  employmentTaxData: any;
  payeRedirectUrl: string;
  beginClaim: () => void;
  beginUpdateClaim: () => void;
  beginAddPensionClaim: () => void;
  beginUpdatePensionClaim: () => void;
  beginIntrruptionPage: () => void;
  handleLinkClick: any;
  redirectLandingPage: () => void;
  redirectToAllIABDLandingPage: () => void;

  redirecLatestEventPage: (s: string) => void;

  handleViewAllDetailsClick: (d: DetailsTypes) => void;

  handleViewDetailsClick: (d: TimeLineEvent, s: string) => void;
}
const PayeCurrentYear = (props: PayeCurrentYearProps) => {
  const {
    employmentTaxData,
    payeRedirectUrl,
    handleLinkClick,
    redirectLandingPage,
    redirecLatestEventPage,
    redirectToAllIABDLandingPage,
    beginUpdateClaim,
    beginIntrruptionPage,
    beginClaim,
    beginAddPensionClaim,
    beginUpdatePensionClaim,
    handleViewAllDetailsClick,
    handleViewDetailsClick
  } = props;
  const { t } = useTranslation();
  const [fullName, setFullName] = useState<string>('');
  const [currentEmploymentDetails, setCurrentEmploymentDetails] = useState<any[]>([]);
  const [endedEmploymentDetails, setEndedEmploymentDetails] = useState<any[]>([]);
  const [statePensionDetails, setStatePensionDetails] = useState<any[]>([]);
  const [currentPensionDetails, setCurrentPensionDetails] = useState<any[]>([]);
  const [previousPensionDetails, setPreviousPensionDetails] = useState<any[]>([]);
  const [latestTimeLineEvents, setLatestTimeLineEvents] = useState<any>([]);
  const [incomeFromOtherSources, setIncomeFromOtherSources] = useState<any>([]);

  useEffect(() => {
    try {
      if (employmentTaxData) {
        setFullName(employmentTaxData.Customer.pyFullName);
        const taxSummary = employmentTaxData.Customer.TaxSummaryList[0];
        setLatestTimeLineEvents(taxSummary.TimeLineView || []);
        setCurrentEmploymentDetails(taxSummary.CurrentEmploymentList || []);
        setEndedEmploymentDetails(taxSummary.PreviousEmploymentList || []);
        setStatePensionDetails(taxSummary.StatePensionList || []);
        setCurrentPensionDetails(taxSummary.CurrentPensionList || []);
        setPreviousPensionDetails(taxSummary.PreviousPensionList || []);
        setIncomeFromOtherSources(taxSummary.IncomeFromOtherSources || []);
      }
    } catch (error) {
      console.log('Error processing employment tax data:', error); // eslint-disable-line no-console
    }
    setPageTitle();
  }, [employmentTaxData, payeRedirectUrl, i18next.language]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  const pensionDetails =
    currentPensionDetails.length > 0 ||
    previousPensionDetails.length > 0 ||
    statePensionDetails.length > 0;

  return (
    <>
      <Button
        variant='backlink'
        onClick={e => {
          e.preventDefault();
          redirectLandingPage();
        }}
        key='StartPageBacklink'
        attributes={{ type: 'link' }}
      />
      <MainWrapperFull>
        <>
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <span className='govuk-caption-xl'>{fullName}</span>
              <h1 className='govuk-heading-xl'>{t('YOUR_PAY_AS_YOU_EARN_SUMMARY')}</h1>
            </div>
          </div>
          <CurrentYearTimeLine
            latestTimeLineEvents={latestTimeLineEvents}
            redirecLatestEventPage={redirecLatestEventPage}
            redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
            handleViewDetailsClick={handleViewDetailsClick}
          />
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <h2 className='govuk-heading-l govuk-!-padding-top-5'>{t('EMPLOYMENT_INCOME')}</h2>
            </div>
          </div>

          {currentEmploymentDetails.length > 0 || endedEmploymentDetails.length > 0 ? (
            <div className='govuk-grid-column-three-quarters'>
              {currentEmploymentDetails.length > 0 && (
                <div className='govuk-grid-row'>
                  <h3 className='govuk-heading-m '>{t('CURRENT_EMPLOYMENTS')}</h3>
                </div>
              )}
              {currentEmploymentDetails.map((employment, index) => (
                <div
                  className='govuk-grid-row'
                  key={generateKey(employment.EmployerName, index, 'currentEmp')}
                >
                  <SummaryCard
                    details={{ ...employment, index }}
                    type='currentEmp'
                    beginIntrruptionPage={beginIntrruptionPage}
                    handleNavClick={handleNavClick}
                    handleViewAllDetailsClick={handleViewAllDetailsClick}
                  />
                </div>
              ))}
              {endedEmploymentDetails.length > 0 && (
                <div className='govuk-grid-row'>
                  <h3 className='govuk-heading-m govuk-!-padding-top-5'>
                    {t('ENDED_EMPLOYMENTS')}
                  </h3>
                </div>
              )}
              {endedEmploymentDetails.map((endedEmployment, index) => (
                <div
                  className='govuk-grid-row'
                  key={generateKey(endedEmployment.EmployerName, index, 'endedEmp')}
                >
                  <SummaryCard
                    details={{ ...endedEmployment, index }}
                    type='endedEmp'
                    beginIntrruptionPage={beginIntrruptionPage}
                    handleNavClick={handleNavClick}
                    handleViewAllDetailsClick={handleViewAllDetailsClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-full'>
                <p className='govuk-body'>{t('YOU_HAVE_NO_EMPLOYMENT_INCOME')}</p>
              </div>
            </div>
          )}
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <h3 className='govuk-heading-m'>{t('MANAGE_EMPLOYMENT_INCOME')}</h3>
            </div>
          </div>
          <ul className='govuk-list'>
            <li>
              <a
                href='#'
                onClick={e => {
                  e.preventDefault();
                  beginClaim();
                }}
                className='govuk-link'
              >
                {t('ADD_A_MISSING_EMPLOYER')}
              </a>
            </li>
            {currentEmploymentDetails.length > 0 && (
              <li>
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault();
                    beginUpdateClaim();
                  }}
                  className='govuk-link'
                >
                  {t('ADD_EMP_END_DATE')}
                </a>
              </li>
            )}
          </ul>

          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <h2 className='govuk-heading-l govuk-!-padding-top-5'>{t('PENSION_INCOME')}</h2>
            </div>
            {pensionDetails ? (
              <div className='govuk-grid-column-three-quarters'>
                {(currentPensionDetails.length > 0 || statePensionDetails.length > 0) && (
                  <h3 className='govuk-heading-m '>{t('CURRENT_PENSION')}</h3>
                )}
                {statePensionDetails.map((statePension, index) => (
                  <div
                    className='govuk-summary-card'
                    key={generateKey(statePension.EmployerName, index, 'currentStatePention')}
                  >
                    <div className='govuk-summary-card__title-wrapper'>
                      <h4 className='govuk-summary-card__title'>{t('STATE_PENSION')}</h4>
                    </div>
                    <div className='govuk-summary-card__content'>
                      <dl className='govuk-summary-list'>
                        <div className='govuk-summary-list__row'>
                          <dt className='govuk-summary-list__key'>{t('Annual_AMOUNT')}</dt>
                          <dd className='govuk-summary-list__value'>
                            {formatCurrency(statePension.AnnualAmount)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                ))}

                {currentPensionDetails.map((currentPension, index) => (
                  <SummaryCard
                    key={generateKey(currentPension.EmployerName, index, 'currentPension')}
                    details={{ ...currentPension, index }}
                    type='currentPension'
                    beginIntrruptionPage={beginIntrruptionPage}
                    handleNavClick={handleNavClick}
                    handleViewAllDetailsClick={handleViewAllDetailsClick}
                  />
                ))}
                {previousPensionDetails.length > 0 && (
                  <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                      <h3 className='govuk-heading-m govuk-!-padding-top-5'>
                        {t('ENDED_PENSIONS')}
                      </h3>
                    </div>
                  </div>
                )}
                {previousPensionDetails.map((previousPension, index) => (
                  <div key={generateKey(previousPension.EmployerName, index, 'previousPension')}>
                    <SummaryCard
                      details={{ ...previousPension, index }}
                      type='previousPension'
                      handleNavClick={handleNavClick}
                      beginIntrruptionPage={beginIntrruptionPage}
                      handleViewAllDetailsClick={handleViewAllDetailsClick}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className='govuk-grid-column-full'>
                <p className='govuk-body'>{t('YOU_HAVE_NO_PENSION_INCOME')}</p>
              </div>
            )}
          </div>
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <h3 className='govuk-heading-m'>{t('MANAGE_PENSION_INCOME')}</h3>
            </div>
          </div>
          <ul className='govuk-list'>
            <li>
              <a
                href='#'
                onClick={e => {
                  e.preventDefault();
                  beginAddPensionClaim();
                }}
                className='govuk-link'
              >
                {t('ADD_A_MISSING_PENSION')}
              </a>
            </li>
            {currentPensionDetails.length > 0 && (
              <li>
                <a
                  href='#'
                  onClick={e => {
                    e.preventDefault();
                    beginUpdatePensionClaim();
                  }}
                  className='govuk-link'
                >
                  {t('ADD_PENSION_END_DATE')}
                </a>
              </li>
            )}
          </ul>

          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <h2 className='govuk-heading-l govuk-!-padding-top-5'>
                {t('INCOME_FROM_OTHER_SOURCES')}
              </h2>
            </div>

            {incomeFromOtherSources.length > 0 ? (
              <div className='govuk-grid-column-three-quarters'>
                {incomeFromOtherSources
                  .filter(otherSources => otherSources.AnnualAmount >= 1)
                  .map((otherSources, index) => (
                    <div
                      className='govuk-summary-card'
                      key={generateKey(otherSources.EmployerName, index, 'otherSources')}
                    >
                      <SummaryCardIncomeOtherSources
                        details={otherSources}
                        handleNavClick={handleNavClick}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className='govuk-grid-column-full'>
                <p className='govuk-body'>{t('YOU_HAVE_NO_INCOME_FROM_OTHER_SOURCES')}</p>
              </div>
            )}
          </div>
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-full'>
              <h3 className='govuk-heading-m'>{t('MANAGE_INCOME_FROM_OTHER_SOURCES')}</h3>
            </div>
          </div>
          <ul className='govuk-list'>
            <li>
              <a
                className='govuk-link'
                href='#'
                onClick={e => {
                  handleNavClick(
                    e,
                    `/digital-forms/form/tell-us-about-your-taxable-state-benefit/draft/guide`
                  );
                }}
              >
                {t('ADD_MISSING_INCOME_FROM_ANOTHER_SOURCE')}
              </a>
            </li>

            <li>
              <a
                className='govuk-link'
                href='#'
                onClick={e => {
                  handleNavClick(
                    e,
                    `/digital-forms/form/tell-us-about-investment-income/draft/guide`
                  );
                }}
              >
                {t('ADD_MISSING_INVESTMENT_INCOME')}
              </a>
            </li>
          </ul>
        </>
        <hr className='govuk-section-break govuk-section-break--m govuk-section-break--invisible'></hr>
      </MainWrapperFull>
    </>
  );
};
export default PayeCurrentYear;
