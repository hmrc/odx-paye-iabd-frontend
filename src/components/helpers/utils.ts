import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import dayjs from 'dayjs';
import { t } from 'i18next';
import {
  AllowanceObject,
  DetailsTypes
} from '../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';

declare const PCore: any;

interface ErrorMessage {
  message: {
    fieldId: string;
    message: string;
    pageRef: string;
    clearMessageProperty: string;
  };
}

export const scrollToTop = () => {
  const position = document.getElementById('#main-content')?.offsetTop || 0;
  document.body.scrollTop = position;
  document.documentElement.scrollTop = position;
};

export const GBdate = (date: string) => {
  const d = String(date).split('-');
  return d.length > 1 ? `${d[2]}/${d[1]}/${d[0]}` : date;
};

export const checkErrorMsgs = (
  errorMsgs: ErrorMessage[] = [],
  fieldIdentity = '',
  fieldElement = ''
) => {
  return errorMsgs.find(
    (element: ErrorMessage) =>
      element.message.fieldId === fieldIdentity || element.message.fieldId.startsWith(fieldElement)
  );
};

export const shouldRemoveFormTagForReadOnly = (pageName: string) => {
  const arrContainerNamesFormNotRequired = ['Your date of birth'];
  return arrContainerNamesFormNotRequired.includes(pageName);
};

export const getServiceShutteredStatus = async (): Promise<boolean> => {
  interface ResponseType {
    data: { Shuttered: boolean };
  }
  try {
    const sdkConfig = await getSdkConfig();
    const urlConfig = new URL(
      `${sdkConfig.serverConfig.infinityRestServerUrl}/app/${sdkConfig.serverConfig.appAlias}/api/application/v2/data_views/D_ShutterLookup`
    ).href;
    const featureID = 'PAYE';
    const featureType = 'Service';

    const parameters = new URLSearchParams(
      `{FeatureID: ${featureID}, FeatureType: ${featureType}}`
    );

    const url = `${urlConfig}?dataViewParameters=${parameters}`;
    const { invokeCustomRestApi } = PCore.getRestClient();
    /* eslint-disable */
    return invokeCustomRestApi(
      url,
      {
        method: 'GET',
        body: '',
        headers: '',
        withoutDefaultHeaders: false
      },
      ''
    )
      .then((response: ResponseType) => {
        return response.data.Shuttered;
      })
      .catch((error: Error) => {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const isUnAuthJourney = () => {
  const containername = PCore.getContainerUtils().getActiveContainerItemName(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const context = PCore.getContainerUtils().getActiveContainerItemName(`${containername}/workarea`);
  const caseType = PCore.getStoreValue('.CaseType', 'caseInfo.content', context);
  return caseType === 'Unauth';
};

export const isSingleEntity = (propReference: string, getPConnect: any) => {
  const containerName = getPConnect().getContainerName();
  const context = PCore.getContainerUtils().getActiveContainerItemContext(
    `${PCore.getConstants().APP.APP}/${containerName}`
  );

  const count = PCore.getStoreValue(
    propReference.split('[')[0],
    'caseInfo.content',
    context
  )?.length;

  if (typeof count !== 'undefined' && count === 1) return true;
};

export const removeRedundantString = (redundantString: string, separator: string = '.') => {
  const list: string[] = redundantString.split(separator);
  const newList: string[] = [];
  let uniqueString = '';
  if (list.length > 0) {
    list.forEach(item => {
      if (!newList.includes(item.trim())) {
        newList.push(item);
      }
    });
    if (newList.length > 0) {
      newList.forEach(element => {
        uniqueString = uniqueString + (uniqueString.length > 0 ? '. ' : '') + element.trim();
      });
    }
  }
  return uniqueString;
};

export const checkStatus = () => {
  const containername = PCore.getContainerUtils().getActiveContainerItemName(
    `${PCore.getConstants().APP.APP}/primary`
  );
  const context = PCore.getContainerUtils().getActiveContainerItemName(`${containername}/workarea`);
  const status = PCore.getStoreValue('.pyStatusWork', 'caseInfo.content', context);
  return status;
};

export const formatDate = (dateString: string) => {
  return dayjs(dateString).format('D MMMM YYYY');
};

// This new code is tempory solution from react, it will be removed in next sprint as this content will come from pega with welsh
export const getTaxCodeForTimeline = (taxCode: string) => {
  const exceptionalTaxCodes = [
    'BR',
    'D0',
    'D1',
    'SBR',
    'SD0',
    'SD1',
    'SD2',
    'SD3',
    'CBR',
    'CD0',
    'CD1',
    'NT'
  ];

  if (exceptionalTaxCodes.includes(taxCode?.split(' ')[0])) {
    return t(taxCode.toUpperCase().replace(' ', '_').replace('WEEK1/MONTH1', 'WEEK1_MONTH1'));
  }
};

export const getTaxCode = (taxCode: string) => {
  return taxCode.replace('Week1/Month1', t('WEEK1_MONTH1'));
};

export const generateKey = (name: string, index: number, employer: string = '') => {
  return `${name}_${index}_${employer}`;
};

export const formatCurrency = (
  amount: string | number | undefined,
  isTruncate: boolean = false
): string => {
  if (typeof amount !== 'string' && typeof amount !== 'number') {
    return '';
  }
  const stringAmount: string =
    typeof amount === 'string' ? amount.trim() : amount.toString().trim();

  if (isNaN(Number(stringAmount))) {
    return '';
  }

  const parsedAmount = Math.floor(Number(stringAmount) * 100) / 100;

  return `${new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: isTruncate ? 0 : 2,
    maximumFractionDigits: isTruncate ? 0 : 2
  }).format(parsedAmount)}`;
};

export const getTesLinks = (tesLinkID: string, tesLinks: any[]) => {
  return tesLinks?.filter(tesLink => tesLink.pyKeyString === tesLinkID);
};

export const getTESLinksOnLang = (details: DetailsTypes | AllowanceObject, lang: string) => {
  const TESLinkArr = details?.TESLinks?.map(
    tesLink => tesLink?.Content.filter(tes => tes?.Language.toLowerCase() === lang)[0]
  );
  return TESLinkArr;
};

export const getCurrentLang = (): string => {
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  return lang;
};

export function getHeadingContent(content, lang) {
  const contentObj = content?.find(obj => obj?.Language.toLowerCase() === lang);
  return contentObj;
}

export function truncate(value: string | number) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '';
  }

  if (isNaN(+value) || value === '') {
    return '';
  }
  return Math.trunc(+value);
}
