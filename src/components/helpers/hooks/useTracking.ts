import { useCallback } from 'react';

export interface TrackingDataType {
  payload?: Record<string, unknown>;
}

export default function useTracking() {
  const trackEvent = useCallback((event: TrackingDataType) => {
    try {
      const trackingData = {
        ...event.payload
      };

      const options = {
        invalidateCache: true
      };

      PCore.getDataPageUtils().getPageDataAsync(
        'D_ClientAction',
        'root',
        { ...trackingData },
        options
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('CIP DPage Error:', error);
    }
  }, []);
  return { trackEvent };
}
