import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import TaxFreeAmountDetails from './TaxFreeAmountDetails';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import { formatCurrency, formatTaxCode, scrollToTop } from '../../../../components/helpers/utils';
import LoadingSpinner from '../../../../components/helpers/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorPage/errorMessage';
import { DetailsTypes, WIMTCDetails } from './PayeCurrentYearTypes';
import TaxCodeExplainer from './TaxCodeExplainer';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface UnderstandYourTaxCodeProps {
  understandYourTaxDetails: DetailsTypes;
  handleLinkClick: (d: string) => void;
  redirectToAllIABDLandingPage: (d: string) => void;
  onBack: () => void;
  redirectToDeductionExplainerpage: (
    comingFrom: string,
    explainerPage: string,
    SourceAmount: string
  ) => void;
}

const UnderstandYourTaxCodePage = ({
  understandYourTaxDetails,
  onBack,
  handleLinkClick,
  redirectToAllIABDLandingPage,
  redirectToDeductionExplainerpage
}: UnderstandYourTaxCodeProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsgArr, setErrorMsgArr] = useState([]);
  const [taxSummaryList, setTaxSummaryList] = useState(null);

  const { t } = useTranslation();
  const { serviceShuttered, isLoading: isShutterServiceLoading } = useServiceShuttered();

  const isActivePension: boolean = understandYourTaxDetails?.ActiveOccupationalPension;
  const isPrimaryEmployment: boolean =
    understandYourTaxDetails?.EmploymentType?.toUpperCase() === 'PRIMARY';

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  async function fetchWIMTCDetails() {
    const parameters = {
      issuedtaxCode: understandYourTaxDetails?.AssignedTaxCode,
      NetCodedAllowance: understandYourTaxDetails?.NetCodedAllowance,
      taxCodeIdentifier: understandYourTaxDetails?.IntegerSortingHolder,
      EmploymentRecordType: understandYourTaxDetails?.EmploymentType,
      ESN: understandYourTaxDetails?.EmploymentSequenceNumber
    };

    try {
      const res = await PCore.getDataPageUtils().getDataAsync(
        'D_WIMTC',
        'root',
        parameters,
        {},
        {},
        { invalidateCache: true }
      );
      return res;
    } catch (error) {
      console.error('Error fetching D_WIMTC data:', error); // eslint-disable-line no-console
      return null;
    }
  }

  async function fetchTaxCodeData() {
    setIsLoading(true);
    try {
      const details: WIMTCDetails = await fetchWIMTCDetails();
      setTaxSummaryList(details?.data?.[0]?.Customer?.TaxSummaryList[0]);
      const errorMsg = details?.data?.[0]?.pyErrors?.pyMessages?.[0]?.pyErrorMessage ?? [];
      if (errorMsg) setErrorMsgArr(errorMsg);
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTaxCodeData();
  }, []);

  const renderUnderstandYourTaxCodeBody = () => {
    const marginBottom = !(isActivePension || isPrimaryEmployment)
      ? 'govuk-!-margin-bottom-6'
      : null;
    return (
      <>
        <TaxFreeAmountDetails
          allowances={taxSummaryList?.CurrentAllowanceList}
          personalAllowances={taxSummaryList?.PersonalAllowances}
          deductions={taxSummaryList?.CurrentDeductionsList}
          handleLinkClick={handleLinkClick}
          redirectToDeductionExplainerpage={redirectToDeductionExplainerpage}
          comingFrom='UnderstandYourTaxCodePage'
        />
        <p className={`govuk-body ${marginBottom}`}>
          {isActivePension
            ? t('YOUR_TAX_FREE_AMOUNT_PENSION')
            : t('YOUR_TAX_FREE_AMOUNT_EMPLOYMENT')}
          {understandYourTaxDetails?.NetCodedAllowance &&
            formatCurrency(understandYourTaxDetails?.NetCodedAllowance, true)}
          .
        </p>
        {isPrimaryEmployment && (
          <p className='govuk-body govuk-!-margin-bottom-6'>
            {t('IF_YOU_THINK_INCORRECT')}
            <a
              className='govuk-link'
              href='#'
              onClick={e => {
                e.preventDefault();
                redirectToAllIABDLandingPage('UnderstandYourTaxPage');
              }}
            >
              {t('UPDATE_REMOVE_INFO_ABOUT_YOU')}
            </a>
            .
          </p>
        )}

        {taxSummaryList?.TaxAttribute && (
          <TaxCodeExplainer
            taxCode={taxSummaryList?.TaxAttribute}
            netCodedAllowance={understandYourTaxDetails?.NetCodedAllowance}
            isActivePension={isActivePension}
            issuedTaxCode={understandYourTaxDetails?.AssignedTaxCode}
          />
        )}
        <p className='govuk-body'>
          <a
            className='govuk-link'
            href='#'
            onClick={e => {
              e.preventDefault();
              handleLinkClick('/check-income-tax/paye-income-tax-estimate');
            }}
          >
            {t('VIEW_INCOME_TAX_ESTIMATE')}
          </a>
        </p>
      </>
    );
  };

  return isLoading ? (
    <LoadingSpinner bottomText='Loading' size='30px' />
  ) : (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
        pageIsLoading={isLoading}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
        <>
          <Button
            variant='backlink'
            onClick={e => {
              e.preventDefault();
              onBack();
            }}
            key='UnderstandYourTaxCodeBacklink'
            attributes={{ type: 'link' }}
          />
          <>
            {errorMsgArr?.length > 0 && <ErrorMessage />}
            {errorMsgArr?.length === 0 && (
              <MainWrapperFull
                title={`${t('YOUR_TAX_CODE_FOR', { lng: 'en' })} ${understandYourTaxDetails?.EmployerName} ${t('IS', { lng: 'en' })} ${formatTaxCode(understandYourTaxDetails?.AssignedTaxCode)}`}
              >
                <div className='govuk-grid-row'>
                  <div className='govuk-grid-column-two-thirds'>
                    <h1 className='govuk-heading-l govuk-!-margin-bottom-8'>
                      {`${t('YOUR_TAX_CODE_FOR')} ${understandYourTaxDetails?.EmployerName} ${t('IS')} ${formatTaxCode(understandYourTaxDetails?.AssignedTaxCode)}`}
                    </h1>

                    {renderUnderstandYourTaxCodeBody()}
                  </div>
                </div>
              </MainWrapperFull>
            )}
          </>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(UnderstandYourTaxCodePage);
