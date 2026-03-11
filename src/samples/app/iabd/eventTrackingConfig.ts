import { useEffect } from 'react';
import { TrackerConfig, EventType, InteractionTracker } from 'hmrc-odx-features-and-functions';

const callClientActionDataPage = async payload => {
  if (typeof PCore !== 'undefined') {
    await PCore.getDataPageUtils().getPageDataAsync(
      'D_OnClientAction',
      'root',
      { ...payload },
      {
        invalidateCache: true
      }
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn('PCore is not defined');
  }
};

/*
  Sets up a new tracking event config, adding it to the list of tracking events
  Handles the default event config set up, minimising set up of new
*/
function setupNewEventTracker(eventConfig: Partial<TrackerConfig>): InteractionTracker {
  return new InteractionTracker({
    url: eventConfig.url ?? null,
    apiCallback: eventConfig.apiCallback ?? callClientActionDataPage,
    includeSelectors: eventConfig.includeSelectors,
    events: eventConfig.events,
    target: eventConfig.target,
    loggedEventType: eventConfig.loggedEventType
  });
}

const linkClickActionTargetBuilder = (e: Event) => {
  const targetHtml = (e.target as HTMLElement).closest('a');
  return targetHtml.getAttribute('data-tracking-target');
};

const outboundLinkTracker = setupNewEventTracker({
  includeSelectors: ['a[data-tracking-type="Outbound"]'],
  events: ['click'],
  target: linkClickActionTargetBuilder,
  loggedEventType: EventType.Outbound
});

const signoutLinkTracker = setupNewEventTracker({
  includeSelectors: ['a[data-tracking-type="Signout"]'],
  events: ['click'],
  target: () =>
    `Sign out <${document.querySelector('H1:not(#govuk-timeout-heading)')?.textContent}>`,
  loggedEventType: EventType.Outbound
});

function useEventTracking() {
  useEffect(() => {
    outboundLinkTracker.startEventTracking();
    signoutLinkTracker.startEventTracking();
    return () => {
      outboundLinkTracker.stopEventTracking();
      signoutLinkTracker.stopEventTracking();
    };
  }, []);
}

export default useEventTracking;
export { callClientActionDataPage };
