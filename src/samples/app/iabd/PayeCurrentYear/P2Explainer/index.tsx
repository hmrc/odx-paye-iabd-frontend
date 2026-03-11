import { SummaryListRow } from 'hmrc-gds-react-components';
import Button from '../../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import MainWrapperFull from '../../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import ShutteredServiceWrapper from '../../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import LoadingWrapper from '../../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import { formatDate, getHeadingContent } from '../../../../../components/helpers/utils';
import useServiceShuttered from '../../../../../components/helpers/hooks/useServiceShuttered';
import { useCallback, useEffect, useState } from 'react';
import WhyExplainer, { WhyExplainerItem } from './WhyExplainer';
import WhatExplainer from './WhatExplainer';
import HowExplainer from './HowExplainer';
import { TimeLineEvent } from '../../../../../reuseables/Types/TimeLineEvents';
import { TaxDetail } from './typings';
import setPageTitle from '../../../../../components/helpers/setPageTitleHelpers';
import i18next from 'i18next';

interface ExplainerData {
  MonthlyEarnings: string;
  WhyExplainer?: WhyExplainerItem[];
  TaxDetails: TaxDetail[];
}

interface Props {
  redirectCurrentYearPage: () => void;
  timelineDetails: Partial<TimeLineEvent>;
  eventType: string;
}

export default function ViewTimelineDetailsP2({
  redirectCurrentYearPage,
  timelineDetails,
  eventType
}: Props) {
  const { t } = useTranslation();
  const { serviceShuttered, isLoading: isShutteredServiceLoading } = useServiceShuttered();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [fetchedData, setFetchedData] = useState<ExplainerData | null>(null);

  const fetchP2Explainer = useCallback(async () => {
    const parameters = {
      EmploymentRecordType: timelineDetails?.EmploymentType,
      ESN: timelineDetails?.EmploymentSequenceNumber!,
      NetCodedAllowance: timelineDetails?.NetCodedAllowance,
      ActiveOccupationalPension: timelineDetails.ActiveOccupationalPension,
      EmployerName: timelineDetails.EmployerName,
      taxCodeIdentifier: timelineDetails?.IntegerSortingHolder,
      issuedtaxCode: timelineDetails?.issuedtaxCode
    };

    try {
      const response = await PCore.getDataPageUtils().getDataAsync(
        'D_P2Explainer',
        'root',
        parameters,
        {},
        {},
        { invalidateCache: true }
      );
      const data = response.data[0].Customer.TaxSummaryList[0];
      setFetchedData(data);
      setIsPageLoading(false);
    } catch (error) {
      console.error('Error fetching D_P2Explainer data:', error); // eslint-disable-line no-console
      setFetchedData(null);
      setIsPageLoading(false);
    }
  }, [timelineDetails]);

  useEffect(() => {
    setPageTitle();
  }, [i18next.language]);

  useEffect(() => {
    fetchP2Explainer();
  }, []);

  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
        pageIsLoading={isShutteredServiceLoading || isPageLoading}
        spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
      >
        <>
          <Button
            variant='backlink'
            onClick={e => {
              e.preventDefault();
              if (eventType === 'event') {
                redirectCurrentYearPage();
              }
            }}
            key='ViewTimelineBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull title={getHeadingContent(timelineDetails?.Content, 'en')?.Description}>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-l govuk-!-margin-bottom-2'>
                  {t('WE_ARE_CHANGING_YOUR_TAX_CODE_FOR')} {timelineDetails.EmployerName}
                </h1>

                <p className='govuk-hint'>{formatDate(timelineDetails.DisplayDate)}</p>

                <dl className='govuk-summary-list' title={t('CHANGE_OF_TAX_CODE')}>
                  <SummaryListRow
                    label={t('WHY_IT_CHANGED')}
                    value={<WhyExplainer items={fetchedData?.WhyExplainer} />}
                  />
                  <SummaryListRow
                    label={t('WHAT_THIS_MEANS_FOR_YOU')}
                    value={<WhatExplainer monthlyEarnings={fetchedData?.MonthlyEarnings} />}
                  />
                  {fetchedData?.MonthlyEarnings && fetchedData?.MonthlyEarnings !== '0' && (
                    <SummaryListRow
                      label={t('HOW_WE_WILL_COLLECT_IT')}
                      value={
                        <HowExplainer
                          employerName={timelineDetails.EmployerName}
                          activeOccupationalPension={timelineDetails.ActiveOccupationalPension}
                          taxDetails={fetchedData.TaxDetails}
                        />
                      }
                    />
                  )}
                </dl>
                <h2 className='govuk-heading-m'>{t('WHAT_HAPPENS_NEXT')}</h2>
                <p className='govuk-body'>
                  {t('THIS_IS_FOR_INFO_ONLY_NOT_DO_ANYTHING_UNLESS_CHANGED')}
                </p>
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
}
