import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrentTimeLineEvent from './CurrentTimeLineEvent';
import { TimeLineEvent, TimeLineEvents } from '../../../../reuseables/Types/TimeLineEvents';

interface CurrentYearTimeLineProps {
  latestTimeLineEvents: TimeLineEvents;
  redirecLatestEventPage: any;

  redirectToAllIABDLandingPage: (s: string) => void;

  handleViewDetailsClick: (d: TimeLineEvent, s: string) => void;
}
const CurrentYearTimeLine = (props: CurrentYearTimeLineProps) => {
  const {
    latestTimeLineEvents,
    redirecLatestEventPage,
    redirectToAllIABDLandingPage,
    handleViewDetailsClick
  } = props;
  const { t } = useTranslation();

  return (
    <div className='govuk-grid-row'>
      <div className='govuk-grid-column-full'>
        <h2 className='govuk-heading-l'>{t('LATEST_ACTIVITY')}</h2>
        {latestTimeLineEvents && latestTimeLineEvents.length > 0 ? (
          <>
            <ol className='hmrc-timeline'>
              {(latestTimeLineEvents && (
                <CurrentTimeLineEvent
                  latestTimeLineEvents={latestTimeLineEvents}
                  eventType='event'
                  handleViewDetailsClick={handleViewDetailsClick}
                />
              )) ?? <p>{t('NO_ACTIVITY_YET')}</p>}
            </ol>
            <p className='govuk-body'>
              <a
                className='govuk-link'
                href=''
                onClick={e => {
                  e.preventDefault();
                  redirecLatestEventPage('PayeCurrentYearPage');
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
        <h2 className='govuk-heading-l'>{t('INFORMATION_HMRC_ABOUT_YOU')}</h2>
        <div className='govuk-inset-text'>
          <a
            className='govuk-link'
            href=''
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
  );
};

export default CurrentYearTimeLine;
