import React from 'react';
import {
  formatDate,
  generateKey,
  getCurrentLang,
  getTaxCodeForTimeline,
  getHeadingContent
} from '../../../../components/helpers/utils';
import { TimeLineEvent, TimeLineEvents } from '../../../../reuseables/Types/TimeLineEvents';
import { useTranslation } from 'react-i18next';

interface CurrentYearTimeLineProps {
  latestTimeLineEvents: TimeLineEvents;
  eventType: string;

  handleViewDetailsClick: (d: TimeLineEvent, s: string) => void;
}
const CurrentTimeLineEvent = (props: CurrentYearTimeLineProps) => {
  const { latestTimeLineEvents, eventType, handleViewDetailsClick } = props;
  const { t } = useTranslation();
  const lang = getCurrentLang();
  const currentTimeLineEvents =
    eventType === 'event' ? latestTimeLineEvents?.slice(0, 3) : latestTimeLineEvents;
  const getHelperText = (templateType: string) => {
    return templateType.toUpperCase() === 'TAXCODE' ? t('OFF') : t('OFF_THE');
  };
  const getTimeLineEvents = () => {
    return currentTimeLineEvents?.map((currentEvent, index) => (
      <li
        className='hmrc-timeline__event'
        key={generateKey(currentEvent?.Content[0]?.pyKeyString, index, 'fullEvent')}
      >
        <h2 className='hmrc-timeline__event-title'>
          {getHeadingContent(currentEvent?.Content, lang)?.Description}
        </h2>
        {currentEvent?.DisplayDate && (
          <time className='hmrc-timeline__event-meta' dateTime={currentEvent.DisplayDate}>
            {formatDate(currentEvent.DisplayDate)}
          </time>
        )}
        {getTaxCodeForTimeline(currentEvent?.issuedtaxCode) && (
          <div className='hmrc-timeline__event-content'>
            <p className='govuk-body'>{getTaxCodeForTimeline(currentEvent.issuedtaxCode)}</p>
          </div>
        )}
        {currentEvent?.pyTemplateDataField && (
          <div className='hmrc-timeline__event-content'>
            <p className='govuk-body'>
              <a
                href='#'
                className='govuk-link'
                onClick={e => {
                  e.preventDefault();
                  handleViewDetailsClick(currentEvent, eventType);
                }}
              >
                {t('VIEW_DETAILS')}
                <span className='govuk-visually-hidden'>
                  {`${getHelperText(currentEvent.pyTemplateDataField)} ${getHeadingContent(currentEvent?.Content, lang)?.Description} ${t('ON')} ${formatDate(currentEvent.DisplayDate)}`}
                </span>
              </a>
            </p>
          </div>
        )}
      </li>
    ));
  };

  return <>{getTimeLineEvents()}</>;
};

export default CurrentTimeLineEvent;
