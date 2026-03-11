import React, { useEffect, useState } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import { generateKey, formatCurrency } from '../../../../components/helpers/utils';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import CurrentYearTimeLine from './payCurrentYearTimeline';
import SummaryCard from './payCurrentYearCard';
import { DetailsTypes } from './PayeCurrentYearTypes';
import { TimeLineEvent } from '../../../../reuseables/Types/TimeLineEvents';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface PayeCurrentYearProps {
  employmentTaxData: any;
  dynamicDisabledIABDDetails: boolean;
  userFullName?: string;
  beginClaim: () => void;
  beginUpdateClaim: () => void;
  beginAddPensionClaim: () => void;
  beginUpdatePensionClaim: () => void;
  beginIntrruptionPage: (
    d: number,
    s: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => void,
    st: string
  ) => void;
  handleLinkClick: any;
  redirectLandingPage: () => void;
  redirectToAllIABDLandingPage: (s: string) => void;

  redirecLatestEventPage: (s: string) => void;

  handleViewAllDetailsClick?: (d: DetailsTypes) => void;
  handleUnderstandYourTaxCodeClick: (d: DetailsTypes, s: string, st: string) => void;

  handleViewDetailsClick: (d: TimeLineEvent, s: string) => void;
  setEmpTaxData: (data: { Customer: any; MDTPURLVALUE: string } | null) => void;
}
const PayeCurrentYear = (props: PayeCurrentYearProps) => {
  const {
    employmentTaxData,
    userFullName,
    dynamicDisabledIABDDetails,
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
    handleUnderstandYourTaxCodeClick,
    handleViewDetailsClick,
    setEmpTaxData
  } = props;
  const { t } = useTranslation();
  const [currentEmploymentDetails, setCurrentEmploymentDetails] = useState<any[]>([]);
  const [endedEmploymentDetails, setEndedEmploymentDetails] = useState<any[]>([]);
  const [statePensionDetails, setStatePensionDetails] = useState<any[]>([]);
  const [currentPensionDetails, setCurrentPensionDetails] = useState<any[]>([]);
  const [previousPensionDetails, setPreviousPensionDetails] = useState<any[]>([]);
  const [latestTimeLineEvents, setLatestTimeLineEvents] = useState<any>([]);
  const [pageContentReady, setPageContentReady] = useState<boolean>(false);
  const [serviceError, setServiceError] = useState<boolean>(false);

  const { serviceShuttered, isLoading } = useServiceShuttered();

  async function fetchDataAndError() {
    try {
      const empData = await PCore.getDataPageUtils().getPageDataAsync('D_PAYEDetails', 'root');

      if (empData) {
        const { Customer, pyURLContent, pyErrors } = empData;
        const ErrorMsg = pyErrors && pyErrors.pyMessages[0];
        return { Customer, MDTPURLVALUE: pyURLContent, pyErrors: ErrorMsg };
      } else {
        throw new Error('Empty response received');
      }
    } catch (error) {
      console.error('Error fetching employment tax data:', error); // eslint-disable-line no-console
      return { Customer: null, MDTPURLVALUE: null, pyErrors: null };
    }
  }

  async function fetchEmploymentTaxData() {
    try {
      setPageContentReady(false);
      const { Customer, MDTPURLVALUE, pyErrors } = await fetchDataAndError();
      const newData =
        Customer !== null && Customer !== undefined ? { Customer, MDTPURLVALUE } : null;
      setServiceError(!!pyErrors);
      setEmpTaxData(newData);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    fetchEmploymentTaxData();
  }, []);

  useEffect(() => {
    try {
      if (employmentTaxData) {
        const taxSummary = employmentTaxData.Customer.TaxSummaryList[0];
        setLatestTimeLineEvents(taxSummary.TimeLineView || []);
        setCurrentEmploymentDetails(taxSummary.CurrentEmploymentList || []);
        setEndedEmploymentDetails(taxSummary.PreviousEmploymentList || []);
        setStatePensionDetails(taxSummary.StatePensionList || []);
        setCurrentPensionDetails(taxSummary.CurrentPensionList || []);
        setPreviousPensionDetails(taxSummary.PreviousPensionList || []);
        setPageContentReady(true);
      }
    } catch (error) {
      console.log('Error processing employment tax data:', error); // eslint-disable-line no-console
      setPageContentReady(true);
    }
    setPageTitle();
  }, [employmentTaxData, i18next.language]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    handleLinkClick(path);
  };

  const pensionDetails =
    currentPensionDetails.length > 0 ||
    previousPensionDetails.length > 0 ||
    statePensionDetails.length > 0;

  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceError || serviceShuttered}>
      <LoadingWrapper
        pageIsLoading={isLoading || !pageContentReady}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
        {pageContentReady && (
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
            <MainWrapperFull title={t('YOUR_PAY_AS_YOU_EARN_SUMMARY', { lng: 'en' })}>
              <>
                <div className='govuk-grid-row'>
                  <div className='govuk-grid-column-full'>
                    <span className='govuk-caption-xl'>{userFullName}</span>
                    <h1 className='govuk-heading-xl'>{t('YOUR_PAY_AS_YOU_EARN_SUMMARY')}</h1>
                  </div>
                </div>

                <CurrentYearTimeLine
                  latestTimeLineEvents={latestTimeLineEvents}
                  redirecLatestEventPage={redirecLatestEventPage}
                  handleViewDetailsClick={handleViewDetailsClick}
                />
                <div className='govuk-grid-row'>
                  <div className='govuk-grid-column-full'>
                    <h2 className='govuk-heading-l govuk-!-padding-top-5'>
                      {t('EMPLOYMENT_INCOME')}
                    </h2>
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
                          handleUnderstandYourTaxCodeClick={handleUnderstandYourTaxCodeClick}
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
                          handleUnderstandYourTaxCodeClick={handleUnderstandYourTaxCodeClick}
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
                {currentEmploymentDetails?.length === 0 ? (
                  <p className='govuk-body'>
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
                  </p>
                ) : (
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
                )}

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
                              <div className='govuk-summary-list__row '>
                                <dt className='govuk-summary-list__key'>{t('AMOUNT')}</dt>
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
                          handleUnderstandYourTaxCodeClick={handleUnderstandYourTaxCodeClick}
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
                        <div
                          key={generateKey(previousPension.EmployerName, index, 'previousPension')}
                        >
                          <SummaryCard
                            details={{ ...previousPension, index }}
                            type='previousPension'
                            handleNavClick={handleNavClick}
                            beginIntrruptionPage={beginIntrruptionPage}
                            handleViewAllDetailsClick={handleViewAllDetailsClick}
                            handleUnderstandYourTaxCodeClick={handleUnderstandYourTaxCodeClick}
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
                {currentPensionDetails?.length === 0 ? (
                  <p className='govuk-body'>
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
                  </p>
                ) : (
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
                )}
                {!dynamicDisabledIABDDetails && (
                  <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-three-quarters'>
                      <h2 className='govuk-heading-l govuk-!-padding-top-7'>
                        {t('OTHER_INCOMES_IABD')}
                      </h2>
                      <div className='govuk-inset-text'>
                        <a
                          href='#'
                          className='govuk-link'
                          onClick={e => {
                            e.preventDefault();
                            redirectToAllIABDLandingPage('PayeCurrentYearPage');
                          }}
                        >
                          {t('VIEW_UPDATE_INFORMATION')}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </MainWrapperFull>
          </>
        )}
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(PayeCurrentYear);
