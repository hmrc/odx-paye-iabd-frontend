import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import TaxFreeAmountDetails from './TaxFreeAmountDetails';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';
import {
  formatCurrency,
  formatDate,
  getCurrentLang,
  getHeadingContent,
  scrollToTop
} from '../../../../components/helpers/utils';
import { TimeLineEvent } from '../../../../reuseables/Types/TimeLineEvents';
import LoadingSpinner from '../../../../components/helpers/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorPage/errorMessage';
import { WIMTCDetails } from './PayeCurrentYearTypes';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import TaxCodeExplainer from './TaxCodeExplainer';
import TaxFreeAmountTable from './TaxFreeAmountTable';

interface ViewTimelineDetailsProps {
  timelineDetails: TimeLineEvent;
  redirectCurrentYearPage: () => void;

  redirecLatestEventPage: (s: string) => void;
  eventType: string;

  handleLinkClick: (d: string) => void;

  redirectToAllIABDLandingPage: (d: string) => void;
}

const ViewTimelineDetails = ({
  timelineDetails,
  redirecLatestEventPage,
  redirectCurrentYearPage,
  eventType,
  handleLinkClick,
  redirectToAllIABDLandingPage
}: ViewTimelineDetailsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsgArr, setErrorMsgArr] = useState([]);
  const [taxSummaryList, setTaxSummaryList] = useState(null);
  const serviceShuttered = useServiceShuttered();
  const { t } = useTranslation();
  const lang = getCurrentLang();

  const templateType: string = timelineDetails?.pyTemplateDataField?.toLocaleLowerCase();
  const isActivePension: boolean = timelineDetails?.ActiveOccupationalPension;
  const isPrimaryEmployment: boolean = timelineDetails?.EmploymentType?.toUpperCase() === 'PRIMARY';

  useEffect(() => {
    setPageTitle();
    scrollToTop();
  }, [i18next.language]);

  async function fetchWIMTCDetails() {
    const parameters = {
      issuedtaxCode: timelineDetails?.issuedtaxCode,
      NetCodedAllowance: timelineDetails?.NetCodedAllowance,
      taxCodeIdentifier: timelineDetails?.IntegerSortingHolder,
      EmploymentRecordType: timelineDetails?.EmploymentType,
      ESN: timelineDetails?.EmploymentSequenceNumber
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
    if (templateType === 'taxcode') {
      fetchTaxCodeData();
    } else {
      setIsLoading(false);
    }
  }, []);

  function renderBody(pyTemplateDataField: string): React.ReactNode {
    let templeteBody;

    switch (pyTemplateDataField) {
      case 'c':
        templeteBody = (
          <>
            <p className='govuk-body'>{t('EXPLAINER_CAT_C')}</p>
            <p className='govuk-body'>{t('YOU_DO_NOT_DO_ANYTHING')}</p>
          </>
        );
        break;
      case 'a-increase':
        templeteBody = (
          <>
            <p className='govuk-body'>{t('EXPLAINER_CAT_A_BODY_INC')}</p>
            <p className='govuk-body'>{t('EXPLAINER_CAT_A_BODY')}</p>
            <p className='govuk-body'>{t('YOU_DO_NOT_DO_ANYTHING')}</p>
          </>
        );
        break;
      case 'a-decrease':
        templeteBody = (
          <>
            <p className='govuk-body'>{t('EXPLAINER_CAT_A_BODY_DEC')}</p>
            <p className='govuk-body'>{t('EXPLAINER_CAT_A_BODY')}</p>
            <p className='govuk-body'>{t('YOU_DO_NOT_DO_ANYTHING')}</p>
          </>
        );
        break;
      default:
        break;
    }
    return templeteBody;
  }

  const renderTemplateForTaxCode = () => {
    return (
      <>
        <p className='govuk-body'>
          {t('WE_HAVE_SENT')} {isActivePension ? t('PENSION_PROVIDER') : t('EMPLOYER')}.
        </p>
        <p className='govuk-body'>
          {t('THIS_MAY_AFFECT')} {isActivePension ? t('PENSION_PROVIDER') : t('EMPLOYER')}{' '}
          {t('STARTS_TO_USE_TAX')}
        </p>
        <TaxFreeAmountDetails
          allowances={taxSummaryList?.CurrentAllowanceList}
          personalAllowances={taxSummaryList?.PersonalAllowances}
          deductions={taxSummaryList?.CurrentDeductionsList}
          handleLinkClick={handleLinkClick}
        />
        <p className='govuk-body'>
          {isActivePension
            ? t('YOUR_TAX_FREE_AMOUNT_PENSION')
            : t('YOUR_TAX_FREE_AMOUNT_EMPLOYMENT')}
          {timelineDetails?.NetCodedAllowance &&
            formatCurrency(timelineDetails?.NetCodedAllowance, true)}
          .
        </p>
        {!isActivePension && isPrimaryEmployment && (
          <p className='govuk-body'>
            {t('IF_YOU_THINK_INCORRECT')}
            <a
              className='govuk-link'
              href='#'
              onClick={e => {
                e.preventDefault();
                redirectToAllIABDLandingPage('ViewTimelineDetailsPage');
              }}
            >
              {t('UPDATE_REMOVE_INFO_ABOUT_YOU')}
            </a>
            .
          </p>
        )}
        <TaxFreeAmountTable taxDetails={taxSummaryList?.TaxDetails} />
        {taxSummaryList?.TaxAttribute && (
          <TaxCodeExplainer
            taxCode={taxSummaryList?.TaxAttribute}
            netCodedAllowance={timelineDetails?.NetCodedAllowance}
            isActivePension={isActivePension}
            issuedTaxCode={timelineDetails?.issuedtaxCode}
          />
        )}

        <h2 className='govuk-heading-m govuk-!-margin-top-7'>{t('WHAT_HAPPEN_NEXT')}</h2>
        <p className='govuk-body'>{t('THIS_IS_FOR_YOUR_INFO')}</p>
      </>
    );
  };

  return isLoading ? (
    <LoadingSpinner bottomText='Loading' size='30px' />
  ) : (
    <>
      {!serviceShuttered && (
        <>
          <Button
            variant='backlink'
            onClick={e => {
              e.preventDefault();
              if (eventType === 'event') {
                redirectCurrentYearPage();
              } else {
                redirecLatestEventPage('LandingPage');
              }
            }}
            key='ViewTimelineBacklink'
            attributes={{ type: 'link' }}
          />
          {errorMsgArr?.length > 0 && <ErrorMessage />}
          {errorMsgArr?.length === 0 && (
            <MainWrapperFull>
              <div className='govuk-grid-row'>
                <div className='govuk-grid-column-two-thirds'>
                  <h1 className='govuk-heading-l govuk-!-margin-bottom-2'>
                    {getHeadingContent(timelineDetails?.Content, lang)?.Description}
                  </h1>
                  <p className='govuk-hint'>{formatDate(timelineDetails?.DisplayDate)}</p>
                  {renderBody(timelineDetails?.pyTemplateDataField?.toLocaleLowerCase())}
                  {templateType === 'taxcode' && renderTemplateForTaxCode()}
                </div>
              </div>
            </MainWrapperFull>
          )}
        </>
      )}
      {serviceShuttered && <ShutterServicePage />}
    </>
  );
};

export default ViewTimelineDetails;
