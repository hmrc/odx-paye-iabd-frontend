import type { Mock } from 'jest-mock';

declare global {
  interface Window {
    PCore: any;
  }
}

export interface PubSubMock {
  subscribe: Mock;
  unsubscribe: Mock;
  subscribeOnce: Mock;
  publish: Mock;
  unsubscribeAllWithEventType: Mock;
  cleanContextSubscribersSomewhere: Mock;
}

export interface DataPageUtilsMock {
  getDataAsync: Mock;
}

export interface MashupApiMock {
  createCase: Mock;
  openAssignment: Mock;
}

export function setupPCore(overrides?: {
  pubSub?: Partial<PubSubMock>;
  dataPageUtils?: Partial<DataPageUtilsMock>;
  mashupApi?: Partial<MashupApiMock>;
  subscribe?: Mock;
  unsubscribe?: Mock;
}) {
  const subscribe = overrides?.subscribe ?? jest.fn();
  const unsubscribe = overrides?.unsubscribe ?? jest.fn();

  const pubSub = {
    subscribe,
    unsubscribe,
    subscribeOnce: jest.fn(),
    publish: jest.fn(),
    unsubscribeAllWithEventType: jest.fn(),
    cleanContextSubscribersSomewhere: jest.fn(),
    ...(overrides?.pubSub ?? {})
  };

  const dataPageUtils = {
    getDataAsync: jest.fn(),
    ...(overrides?.dataPageUtils ?? {})
  };

  const mashupApi = {
    createCase: jest.fn(),
    openAssignment: jest.fn(),
    ...(overrides?.mashupApi ?? {})
  };

  (window as any).PCore = {
    getPubSubUtils: jest.fn(() => pubSub),
    getDataPageUtils: jest.fn(() => dataPageUtils),
    getMashupApi: jest.fn(() => mashupApi)
  };

  const teardown = () => {
    delete (window as any).PCore;
  };

  return {
    pubSub: pubSub as PubSubMock,
    dataPageUtils: dataPageUtils as DataPageUtilsMock,
    mashupApi: mashupApi as MashupApiMock,
    subscribe,
    unsubscribe,
    teardown
  };
}
