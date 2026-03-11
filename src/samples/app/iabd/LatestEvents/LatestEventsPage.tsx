import { useEffect, useState } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import CurrentTimeLineEvent from '../PayeCurrentYear/CurrentTimeLineEvent';
import { TimeLineEvent } from '../../../../reuseables/Types/TimeLineEvents';
import LoadingWrapper from '../../../../components/helpers/LoadingSpinner/LoadingWrapper';
import ShutteredServiceWrapper from '../../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import { withPageTracking } from 'hmrc-odx-features-and-functions';

interface LatestEventsPageProps {
  employmentTaxData: any;
  goBack: any;
  handleViewDetailsClick: (d: TimeLineEvent, s: string) => void;
}

const LatestEventsPage = (props: LatestEventsPageProps) => {
  const { employmentTaxData, goBack, handleViewDetailsClick } = props;

  const { t } = useTranslation();

  const [latestTimeLineEvents, setLatestTimeLineEvents] = useState<any>([]);
  const {serviceShuttered, isLoading} = useServiceShuttered();

  useEffect(() => {
    try {
      if (employmentTaxData) {
        const latestTimeLineEvent = employmentTaxData.Customer.TaxSummaryList[0].TimeLineView;
        setLatestTimeLineEvents(latestTimeLineEvent || []);
      }
    } catch (error) {
      console.log('Error processing employment tax data:', error); // eslint-disable-line no-console
    }
    setPageTitle();
  }, [employmentTaxData, i18next.language]);

  return (
    <ShutteredServiceWrapper serviceIsShuttered={serviceShuttered}>
      <LoadingWrapper
            pageIsLoading={isLoading}
            spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
          >
        <>
          <Button
            variant='backlink'
            onClick={goBack}
            key='LatestEventPageBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull title={t('ALL_ACTIVITY_ON_YOUR_PAYE_ACCOUNT', { lng: 'en' })}>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-xl'>{t('ALL_ACTIVITY_ON_YOUR_PAYE_ACCOUNT')}</h1>

                <div className='card'>
                  <div className='card-body'>
                    <ol className='hmrc-timeline'>
                      <CurrentTimeLineEvent
                        latestTimeLineEvents={latestTimeLineEvents}
                        eventType='fullEvent'
                        handleViewDetailsClick={handleViewDetailsClick}
                      />
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </MainWrapperFull>
        </>
      </LoadingWrapper>
    </ShutteredServiceWrapper>
  );
};

export default withPageTracking(LatestEventsPage);
