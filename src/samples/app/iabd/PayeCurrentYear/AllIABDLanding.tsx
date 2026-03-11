import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';

import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import ErrorMessage from '../ErrorPage/errorMessage';
import { AllIABDDetails } from './PayeCurrentYearTypes';
import BenefitsTable from '../../../../components/AppComponents/AllIABDLandingComponents/BenefitsTable';
import AllIABDNonBenefitsTable from '../../../../components/AppComponents/AllIABDLandingComponents/AllIABDNonBenefitsTable';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';
import MissingLinksSection from './missingDetailsLinksSection';

interface AllIABDLandingProps {
  redirectCurrentYearPage: () => void;
  redirectToUnderstandYourTaxPage: () => void;
  redirectToViewTimelineDetailsPage: () => void;
  comingFromPage: string;
  handleLinkClick: (d: string) => void;
  handleMoreInformationClick: (d: string) => void;
}

const AllIABDLanding = ({
  handleLinkClick,
  redirectCurrentYearPage,
  redirectToUnderstandYourTaxPage,
  redirectToViewTimelineDetailsPage,
  handleMoreInformationClick,
  comingFromPage
}: AllIABDLandingProps) => {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading: isShutterServiceLoading } = useServiceShuttered();
  const [isDetailsAvailable, setIsDetailsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBenefitsList, setCurrentBenefitsList] = useState([]);
  const [currentAllowanceList, setCurrentAllowanceList] = useState([]);
  const [currentIncomeList, setCurrentIncomeList] = useState([]);
  const [currentDeductionsList, setCurrentDeductionsList] = useState([]);
  const [errorMsgArr, setErrorMsgArr] = useState([]);

  async function fetchAllIABDDetails() {
    try {
      const res = await PCore.getDataPageUtils().getPageDataAsync('D_IABDDetails', 'root');
      return res;
    } catch (error) {
      console.error('Error fetching all iabd data:', error); // eslint-disable-line no-console
      return null;
    }
  }

  async function fetchAllIABDData() {
    setIsLoading(true);
    try {
      const data: AllIABDDetails = await fetchAllIABDDetails();

      const { pyErrors } = data;
      const errorMsg = pyErrors?.pyMessages?.[0]?.pyErrorMessage;
      setErrorMsgArr(errorMsg);

      const currentBenefitsArr = data?.Customer?.TaxSummaryList?.[0]?.CurrentBenefitsList;
      const currentIncomeArr = data?.Customer?.TaxSummaryList?.[0]?.CurrentIncomeList;
      const currentAllowanceArr = data?.Customer?.TaxSummaryList?.[0]?.CurrentAllowanceList;
      const currentDeductionsArr = data?.Customer?.TaxSummaryList?.[0]?.CurrentDeductionsList;

      setCurrentBenefitsList(currentBenefitsArr);
      setCurrentIncomeList(currentIncomeArr);
      setCurrentAllowanceList(currentAllowanceArr);
      setCurrentDeductionsList(currentDeductionsArr);
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const isAllIABDDetailsAvailable =
      currentBenefitsList?.length > 0 ||
      currentIncomeList?.length > 0 ||
      currentAllowanceList?.length > 0 ||
      currentDeductionsList?.length > 0;

    setIsDetailsAvailable(isAllIABDDetailsAvailable);
  }, [currentBenefitsList, currentIncomeList, currentAllowanceList, currentDeductionsList]);

  useEffect(() => {
    fetchAllIABDData();
  }, []);

  useEffect(() => {
    setPageTitle();
  }, [i18next.language]);

  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
        pageIsLoading={isLoading || isShutterServiceLoading}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
        <>
          <Button
            variant='backlink'
            onClick={e => {
              e.preventDefault();
              if (comingFromPage === 'UnderstandYourTaxPage') {
                redirectToUnderstandYourTaxPage();
              } else if (comingFromPage === 'ViewTimelineDetailsPage') {
                redirectToViewTimelineDetailsPage();
              } else {
                redirectCurrentYearPage();
              }
            }}
            key='AllIABDPageBacklink'
            attributes={{ type: 'link' }}
          />
          {errorMsgArr?.length > 0 && <ErrorMessage />}
          {errorMsgArr === undefined && (
            <MainWrapperFull title={t('VIEW_UPDATE_INFORMATION', { lng: 'en' })}>
              <div className='govuk-grid-row'>
                <div className='govuk-grid-column-two-thirds'>
                  <h1 className='govuk-heading-xl'>{t('OTHER_INCOMES_IABD')}</h1>
                  {isDetailsAvailable ? (
                    <>
                     <p className='govuk-body'>{t('LIST_SHOWS_ALL_PAY_AS_YOU_EARN')}</p>
                    <div className='govuk-inset-text'>
                      <p className='govuk-body'>{t('AMOUNT_DO_NOT_ACCOUNT_PERSONAL_RELIEFS')}</p>
                    </div>
                      </>
                  ) : (
                    <p className='govuk-body'>{t('NO_INCOME_OTHER_SOURCE')}</p>
                  )}
                </div>
              </div>

              {isDetailsAvailable && (
                <div className='govuk-grid-row'>
                  <div className='govuk-grid-column-full'>
                    {/* Income */}
                    <AllIABDNonBenefitsTable
                      nonBenefitList={currentIncomeList}
                      nonBenefitType='incomes'
                      handleLinkClick={handleLinkClick}
                      handleMoreInformationClick={handleMoreInformationClick}
                    />
                    {/* Allowances */}
                    <AllIABDNonBenefitsTable
                      nonBenefitList={currentAllowanceList}
                      nonBenefitType='allowances'
                      handleLinkClick={handleLinkClick}
                      handleMoreInformationClick={handleMoreInformationClick}
                    />
                    {/* Benefits */}
                    <BenefitsTable
                      handleLinkClick={handleLinkClick}
                      displayList={currentBenefitsList}
                    />
                    {/* Deductions */}
                    <AllIABDNonBenefitsTable
                      nonBenefitList={currentDeductionsList}
                      nonBenefitType='deductions'
                      handleLinkClick={handleLinkClick}
                      handleMoreInformationClick={handleMoreInformationClick}
                    />
                    <MissingLinksSection />
                  </div>
                </div>
              )}
            </MainWrapperFull>
          )}
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(AllIABDLanding);
