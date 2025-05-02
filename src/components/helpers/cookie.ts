export const setCookie = (cname: string, cvalue: string, exdays: number): void => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};

export const getCookie = (cname: string) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.startsWith(' ')) {
      c = c.substring(1);
    }
    if (c.startsWith(name)) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const checkCookie = (cname: string) => getCookie(cname);

export const addDeviceIdCookie = async (): Promise<void> => {
  /* Functionality to set the device id in the header for use in CIP.
        Device id is unique and will be stored on the user device / browser cookie */
  const COOKIE_PEGAODXDI = 'pegaodxdi';
  let deviceID = checkCookie(COOKIE_PEGAODXDI);
  if (deviceID) {
    setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
    // @ts-ignore
    PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
  } else {
    // @ts-ignore
    const dpagepromise = PCore.getDataPageUtils().getPageDataAsync(
      'D_UserSession',
      'root'
    ) as Promise<any>;
    dpagepromise.then(res => {
      deviceID = res.DeviceId;
      setCookie(COOKIE_PEGAODXDI, deviceID, 3650);
      // @ts-ignore
      PCore.getRestClient().getHeaderProcessor().registerHeader('deviceid', deviceID);
    });
  }
};

export const setUserConsentCookie = (consent: boolean) => {
  const consentData = {
    version: '2025.1',
    datetimeSet: new Date().toISOString(),
    preferences: { GA: consent }
  };
  setCookie('userConsent', encodeURIComponent(JSON.stringify(consentData)), 365);
};
