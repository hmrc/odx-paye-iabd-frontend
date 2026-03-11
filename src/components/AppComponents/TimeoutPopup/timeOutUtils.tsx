import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import { triggerLogout } from '../../helpers/utils';
import { Dispatch, SetStateAction } from 'react';

declare const PCore: any;

let milisecondsTilSignout = 115 * 1000;
let milisecondsTilWarning = 780 * 1000;

export const settingTimer = async (): Promise<void> => {
  const sdkConfig = await getSdkConfig();
  if (sdkConfig.timeoutConfig.secondsTilWarning)
    milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
  if (sdkConfig.timeoutConfig.secondsTilLogout)
    milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
};

let applicationTimeout = null;
let signoutTimeout = null;

export function clearTimer() {
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);
}

export const initTimeout = async (setShowTimeoutModal: Dispatch<SetStateAction<boolean>>) => {
  // Set timers to sdk-config values
  await settingTimer();

  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);

  applicationTimeout = setTimeout(() => {
    setShowTimeoutModal(true);
    signoutTimeout = setTimeout(() => {
      triggerLogout(true);
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
};

export function staySignedIn(
  setShowTimeoutModal: Dispatch<SetStateAction<boolean>>,
  refreshSignin = true
) {
  if (refreshSignin) {
    try {
      PCore.getDataPageUtils().getPageDataAsync('D_PAYEDynamicConfig', 'root');
    } catch (error) {
      console.error('Error refreshing sign-in:', error); // eslint-disable-line no-console
    }
  }
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal);
}
