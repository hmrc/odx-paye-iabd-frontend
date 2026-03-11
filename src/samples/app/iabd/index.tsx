import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { sdkIsLoggedIn, getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import PayeCurrentYear from './PayeCurrentYear/PayeCurrentYear';
import LandingPage from './LandingPage';
import InterruptionPage from './InterruptionPage/InterruptionPage';
import AddEmpStartPage from './StartPage/AddEmpStartPage';
import UpdateEmpStartPage from './StartPage/UpdateEmpStartPage';
import AddPensionStartPage from './StartPage/AddPensionStartPage';
import UpdatePensionStartPage from './StartPage/UpdatePensionStartPage';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';
import LatestEventsPage from './LatestEvents/LatestEventsPage';
import TimeoutPopup from '../../../components/AppComponents/TimeoutPopup';
import ServiceNotAvailable from '../../../components/AppComponents/ServiceNotAvailable';
import { DetailsTypes } from './PayeCurrentYear/PayeCurrentYearTypes';
import DelayedErrorMessage from './ErrorPage/delayedErrorMessage';
import ErrorMessage from './ErrorPage/errorMessage';
import SummaryPage from '../../../components/AppComponents/SummaryPage';
import NavBar from '../../../components/helpers/navbar/navbar';
import NavBarMobile from '../../../components/helpers/navbar/navbarMobile';
import { useStartMashup } from '../../../reuseables/PegaSetup';
import ViewAllDetails from './PayeCurrentYear/ViewAllDetails';
import AllIABDLanding from './PayeCurrentYear/AllIABDLanding';
import ViewTimelineDetails from './PayeCurrentYear/ViewTimelineDetails';
import DetailExplainer from './PayeCurrentYear/DetailExplainer';
import { TimeLineContentObj, TimeLineEvent } from '../../../reuseables/Types/TimeLineEvents';
import { addDeviceIdCookie } from '../../../components/helpers/cookie';
import { scrollToTop, triggerLogout } from '../../../components/helpers/utils';
import {
  staySignedIn,
  settingTimer,
  initTimeout
} from '../../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { getServiceShutteredStatus } from '../../../components/helpers/utils';
import UnderstandYourTaxCodePage from './PayeCurrentYear/UnderstandYourTaxCodePage';
import WinterFuelExplainerPage from './PayeCurrentYear/WinterFuelExplainerPage';
import UnderstandYourTaxForSpecialPage from './PayeCurrentYear/UnderstandYourTaxForSpecialPage';
import UntaxedSavingsInterestPage from './PayeCurrentYear/UntaxedSavingsInterestPage';
import { AnalyticsConfigProvider, AnalyticsPayload } from 'hmrc-odx-features-and-functions';
import useServiceShuttered from '../../../components/helpers/hooks/useServiceShuttered';
import LoadingWrapper from '../../../components/helpers/LoadingSpinner/LoadingWrapper';
import ShutteredServiceWrapper from '../../../components/AppComponents/ShutterService/ShutteredServiceWrapper';
import AnnualCodingTemplate from './AnnualCodingTemplate/AnnualCodingTemplate';
import TaxCodeExplainerWFP from './PayeCurrentYear/WinterFuelPaymentPages/TaxCodeExplainerWFP';
import ViewTimelineDetailsP2 from './PayeCurrentYear/P2Explainer';

let milisecondsTilSignout = 115 * 1000;
declare const PCore: any;

export default function Iabd() {
  const [showAddEmpStartPage, setShowAddEmpStartPage] = useState(false);
  const [showInterruptionPage, setShowInterruptionPage] = useState(false);
  const [showAddPensionStartPage, setShowAddPensionStartPage] = useState(false);
  const [showUpdateEmpStartPage, setShowUpdateEmpStartPage] = useState(false);
  const [showUpdatePensionStartPage, setShowUpdatePensionStartPage] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const [employmentTaxData, setEmploymentTaxData] = useState(null);
  const [accessGroup, setAccessGroup] = useState<string>('');
  const [showCreatedCase, setSowCreatedCase] = useState(false);
  const [showCurrentYearPage, setShowCurrentYearPage] = useState(false);
  const [showLatestEventsPage, setShowLatestEventsPage] = useState(false);
  const [showAllIABDLandingPage, setShowAllIABDLandingPage] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [currentPage, setCurrentPage] = useState('LandingPage');
  const [previousPage, setPreviousPage] = useState(null);
  const [sourceAmount, setSourceAmount] = useState('');
  const [dynamicDisabledIABDDetails, setDynamicDisabledIABDDetails] = useState<boolean>(false);
  const [employmentSequenceNumber, setEmploymentSequenceNumber] = useState(null);
  const [navClickHandler, setNavClickHandler] = useState(null);
  const [caseTypeClicked, setCaseTypeClicked] = useState('');
  const [pConn, setPconn] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [summaryPageContent, setSummaryPageContent] = useState<any>({
    content: null,
    title: null,
    banner: null
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 770);

  const [details, setDetails] = useState(null);
  const [isPCoreReady, setIsPCoreReady] = useState(false);
  const [annualCodingData, setAnnualCodingData] = useState(null);
  const [taxYearStartDate, setTaxYearStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(!isPCoreReady);
  const [serviceIsShuttered, setServiceIsShuttered] = useState(false);
  const currentLang = sessionStorage.getItem('rsdk_locale')?.slice(0, 2).toUpperCase() || 'EN';
  const [annualCodingTemplateValue, setAnnualCodingTemplateValue] = useState('');
  const [timelineDetails, setTimelineDetails] = useState<Partial<TimeLineEvent>>({});
  const [eventType, setEventType] = useState('');
  const [explainerComponentName, setExplainerComponentName] = useState('');
  const [understandYourTaxDetails, setUnderstandYourTaxDetails] = useState(null);
  const [comingFromPage, setComingFromPage] = useState(null);
  const { serviceShuttered, isLoading: isShutteredServiceLoading } = useServiceShuttered();
  const [annualCodingPageName, setAnnualCodingPageName] = useState('');
  const { t } = useTranslation();

  const ref = useRef(null);
  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 770);
  };

  type payeDynamicEmpPension = {
    EmploymentEndLeavingPeriod: number;
    MissingEmploymentPayPeriod: number;
    PensionPayPeriod: number;
    PensionEndLeavingPeriod: number;
    IncomeThresholdForWinterFuelPayment: number;
    NextTaxStartYear: number;
  };

  const [dynamicIABDVals, setDynamicIABDVals] = useState<payeDynamicEmpPension>();

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // This needs to be changed in future when we handle the shutter for multiple service, for now this one's for single service
  const featureID = 'PAYE';

  const {
    showPega,
    setShowPega,
    showResolutionPage,
    setShowResolutionPage,
    caseId,
    serviceNotAvailable,
    shutterServicePage,
    assignmentPConnect,
    renderRootComponent,
    rootProps
  } = useStartMashup({
    appBacklinkProps: {},
    appNameHeader: featureID
  });

  useEffect(() => {
    if (assignmentPConnect) {
      setPconn(assignmentPConnect);
    }
  }, [assignmentPConnect]);

  function resetAppDisplay() {
    setShowAddEmpStartPage(false);
    setShowInterruptionPage(false);
    setShowAddPensionStartPage(false);
    setShowUpdateEmpStartPage(false);
    setShowUpdatePensionStartPage(false);
    setShowLandingPage(false);
    setShowPega(false);
  }

  function displayPega() {
    setShowPega(true);
  }

  function displayUserPortal() {
    resetAppDisplay();
    setShowLandingPage(true);
  }

  function displayAddEmpStartPage() {
    resetAppDisplay();
    setShowAddEmpStartPage(true);
    scrollToTop();
  }

  function displayInterruptionPage() {
    resetAppDisplay();
    setShowInterruptionPage(true);
    scrollToTop();
  }
  function displayUpdateEmpStartPage() {
    resetAppDisplay();
    setShowUpdateEmpStartPage(true);
    scrollToTop();
  }

  function displayAddPensionStartPage() {
    resetAppDisplay();
    setShowAddPensionStartPage(true);
    scrollToTop();
  }

  function displayUpdatePensionStartPage() {
    resetAppDisplay();
    setShowUpdatePensionStartPage(true);
    scrollToTop();
  }

  useEffect(() => {
    if (showResolutionPage) {
      resetAppDisplay();
    }
  }, [showResolutionPage]);

  useEffect(() => {
    setPageTitle();
  }, [
    showInterruptionPage,
    showAddEmpStartPage,
    showUpdateEmpStartPage,
    showAddPensionStartPage,
    setShowUpdatePensionStartPage,
    showLandingPage,
    showPega,
    shutterServicePage
  ]);

  // Function to force re-render the pega Root component
  const forceRefreshRootComponent = () => {
    renderRootComponent();
  };

  useEffect(() => {
    if (Object.keys(rootProps).length) {
      PCore.getPubSubUtils().subscribe(
        'forceRefreshRootComponent',
        forceRefreshRootComponent,
        'forceRefreshRootComponent'
      );
    }
    return () => {
      PCore?.getPubSubUtils().unsubscribe('forceRefreshRootComponent', 'forceRefreshRootComponent');
    };
  }, [rootProps]);

  async function createCase(caseType) {
    displayPega();
    setSowCreatedCase(true);
    const currentEmpList = employmentTaxData.Customer.TaxSummaryList[0].CurrentEmploymentList;
    const currentPenList = employmentTaxData.Customer.TaxSummaryList[0].CurrentPensionList;

    function filterList(list) {
      return list.map(emp => ({
        AssignedTaxCode: emp.AssignedTaxCode,
        EmployerName: emp.EmployerName,
        EstimatedPay: emp.EstimatedPay,
        PAYENumber: emp.PAYENumber,
        PayRollID: emp.PayRollID,
        StartDate: emp.StartDate
      }));
    }

    const filteredEmploymentList = currentEmpList?.length > 0 ? filterList(currentEmpList) : [];
    const filteredPensionList = currentPenList?.length > 0 ? filterList(currentPenList) : [];

    const startingFields = {
      ...(caseType === 'updateEmployee' && { CurrentEmploymentList: filteredEmploymentList }),
      ...(caseType === 'updatePension' && { CurrentPensionList: filteredPensionList }),
      NotificationLanguage: sessionStorage.getItem('rsdk_locale')?.slice(0, 2) || 'en'
    };

    const caseTypes = {
      addEmployee: 'HMRC-PAYE-Work-IABD-MissingEmp',
      updateEmployee: 'HMRC-PAYE-Work-IABD-UpdateEmpLeavingDate',
      addPension: 'HMRC-PAYE-Work-IABD-AddPension',
      updatePension: 'HMRC-PAYE-Work-IABD-RemovePension'
    };

    const openCaseID = caseTypes[caseType];
    if (openCaseID) {
      await PCore.getMashupApi().createCase(openCaseID, PCore.getConstants().APP.APP, {
        startingFields
      });
    }
  }

  const getShutteredService = async () => {
    setIsLoading(true);
    const status: boolean = await getServiceShutteredStatus();
    setServiceIsShuttered(status);
    setIsLoading(false);
    return status;
  };

  async function startNow(caseType: string) {
    resetAppDisplay();
    setCaseTypeClicked(caseType);
    const isServiceShuttered = await getShutteredService();
    if (!isServiceShuttered && pConn) {
      await createCase(caseType);
    }
  }

  function beginClaim() {
    staySignedIn(setShowTimeoutModal, true);
    setCurrentPage('');
    displayAddEmpStartPage();
  }

  function beginIntrruptionPage(
    TheEmploymentSequenceNumber: number,
    handleNavClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => void,
    fromPage: string
  ) {
    staySignedIn(setShowTimeoutModal, true);
    setCurrentPage('');
    setEmploymentSequenceNumber(TheEmploymentSequenceNumber);
    setNavClickHandler(() => handleNavClick);
    displayInterruptionPage();
    setPreviousPage(fromPage);
  }

  function beginUpdateClaim() {
    staySignedIn(setShowTimeoutModal, true);
    setCurrentPage('');
    displayUpdateEmpStartPage();
  }

  function beginAddPensionClaim() {
    staySignedIn(setShowTimeoutModal, true);
    setCurrentPage('');
    displayAddPensionStartPage();
  }

  function beginUpdatePensionClaim() {
    staySignedIn(setShowTimeoutModal, true);
    setCurrentPage('');
    displayUpdatePensionStartPage();
  }
  function redirectCurrentYearPage() {
    setShowResolutionPage(false);
    setPreviousPage(currentPage);
    setCurrentPage('PayeCurrentYearPage');
    staySignedIn(setShowTimeoutModal, true);
    setShowUpdateEmpStartPage(false);
    setShowAddEmpStartPage(false);
    setShowInterruptionPage(false);
    setShowAddPensionStartPage(false);
    setShowUpdatePensionStartPage(false);
    setShowCurrentYearPage(true);
    setShowLandingPage(false);
    scrollToTop();
  }

  function redirectAnnualCodingTemplatePage({
    templateValue,
    pageName
  }: {
    templateValue: string;
    pageName: string;
  }) {
    setAnnualCodingTemplateValue(templateValue);
    setPreviousPage(currentPage);
    setCurrentPage('AnnualCodingTemplate');
    setAnnualCodingPageName(pageName);
    scrollToTop();
  }

  function redirectLandingPage() {
    setPreviousPage(currentPage);
    setCurrentPage('LandingPage');
    staySignedIn(setShowTimeoutModal, true);
    setShowCurrentYearPage(false);
    setShowLandingPage(true);
    scrollToTop();
  }

  function redirecLatestEventPage(fromPage) {
    setPreviousPage(fromPage);
    setCurrentPage('LatestEventsPage');
    staySignedIn(setShowTimeoutModal, true);
    setShowLatestEventsPage(true);
    setShowCurrentYearPage(false);
    setShowLandingPage(false);
    scrollToTop();
  }

  function redirectToAllIABDLandingPage(fromPage) {
    setComingFromPage(fromPage);
    setCurrentPage('AllIABDLandingPage');
    setShowAllIABDLandingPage(true);
    staySignedIn(setShowTimeoutModal, true);
    scrollToTop();
  }
  function redirectToUnderstandYourTaxPage() {
    setCurrentPage('UnderstandYourTaxPage');
    staySignedIn(setShowTimeoutModal, true);
    scrollToTop();
  }

  function redirectToViewTimelineDetailsPage() {
    setPreviousPage(currentPage);
    setCurrentPage('ViewTimelineDetailsPage');
    staySignedIn(setShowTimeoutModal, true);
    setShowCurrentYearPage(false);
    setShowLandingPage(false);
    scrollToTop();
  }

  function redirectToDeductionExplainerpage(
    comingFrom: string,
    explainerPage: string,
    SourceAmount: string
  ) {
    setComingFromPage(comingFrom);
    setCurrentPage(explainerPage);
    setSourceAmount(SourceAmount);
    staySignedIn(setShowTimeoutModal, true);
    scrollToTop();
  }

  const goBack = () => {
    setShowInterruptionPage(false);
    setCurrentPage(previousPage);
    scrollToTop();
  };

  function returnToPortalPage() {
    staySignedIn(setShowTimeoutModal, true);
    displayUserPortal();
    PCore.getContainerUtils().closeContainerItem(
      PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
      { skipDirtyCheck: true }
    );
  }

  async function fetchDynamicValue() {
    try {
      const dataViewName = 'D_PAYEDynamicConfig';
      const parameters = { Inputparam: '' };
      const context = 'app/primary_1';
      const options = { invalidateCache: true };
      const res = await PCore.getDataPageUtils().getPageDataAsync(
        dataViewName,
        context,
        parameters,
        options
      );
      return res;
    } catch (error) {
      console.error('Error fetching employment tax data:', error); // eslint-disable-line no-console
      return null;
    }
  }

  async function fetchAnnualCoding() {
    try {
      const res = await PCore.getDataPageUtils().getPageDataAsync('D_AnnualCoding', 'root');
      return res;
    } catch (error) {
      console.error('Error fetching annual code data:', error); // eslint-disable-line no-console
      return null;
    }
  }

  async function fetchPAYELanding() {
    try {
      const res = await PCore.getDataPageUtils().getPageDataAsync('D_PAYELanding', 'root');
      return res;
    } catch (error) {
      console.error('Error fetching annual code data:', error); // eslint-disable-line no-console
      return null;
    }
  }

  async function fetchDynamicValueData() {
    try {
      const data = await fetchDynamicValue();
      setDynamicDisabledIABDDetails(data?.DisabledIABDDetails);
      setDynamicIABDVals({
        EmploymentEndLeavingPeriod: data?.EmploymentEndLeavingPeriod,
        MissingEmploymentPayPeriod: data?.MissingEmploymentPayPeriod,
        PensionPayPeriod: data?.PensionPayPeriod,
        PensionEndLeavingPeriod: data?.PensionEndLeavingPeriod,
        IncomeThresholdForWinterFuelPayment: data?.IncomeThresholdForWinterFuelPayment,
        NextTaxStartYear: data?.NextTaxStartYear
      });
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }

  async function addDeviceId() {
    try {
      await addDeviceIdCookie();
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }

  async function fetchAnnualCodingData() {
    try {
      const data = await fetchAnnualCoding();

      setTaxYearStartDate(data?.Customer?.TaxSummaryList?.[0]?.TaxYearStartDate);
      setAnnualCodingData(data);
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }

  async function fetchPAYELandingData() {
    try {
      const data = await fetchPAYELanding();
      if (data?.Customer) {
        setCustomerDetails(data?.Customer);
      }
      setAccessGroup(data?.pyAccessGroup);
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }

  async function fetchMDTPData(link) {
    const parameters = {
      ContinueURL: link
    };
    try {
      const res = await PCore.getDataPageUtils().getPageDataAsync(
        'D_PAYERedirectURL',
        'root',
        parameters
      );

      return res;
    } catch (error) {
      console.error('Error fetching employment tax data:', error); // eslint-disable-line no-console
      return null;
    }
  }

  async function handleLinkClick(link) {
    try {
      const data = await fetchMDTPData(link);
      window.location.href = data.pyURLContent;
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }

  const publishAnalyticsEventToPega = useCallback(async (payload: AnalyticsPayload) => {
    PCore.getDataPageUtils().getPageDataAsync(
      'D_OnClientAction',
      'root',
      { ...payload },
      {
        invalidateCache: true
      }
    );
  }, []);

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      // login();     // Login now handled at TopLevelApp
    } else {
      setShowLandingPage(true);
    }
  }, [showPega, isPCoreReady]);

  function closeContainer() {
    if (PCore.getContainerUtils().getActiveContainerItemName('app/primary')) {
      PCore.getContainerUtils().closeContainerItem(
        PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
        { skipDirtyCheck: true }
      );
    }
  }

  const handleSummaryLinkClick = useCallback(
    (event: MouseEvent) => {
      try {
        const element = event.target as HTMLElement | null;
        const targetIsHomepageLink = element?.id?.toLowerCase() === 'homepage';
        if (targetIsHomepageLink) {
          event.preventDefault();
          resetAppDisplay();
          redirectCurrentYearPage();
        }
      } catch (err) {
        console.error('Error with summary link click:', err); // eslint-disable-line no-console
      }
    },
    [redirectCurrentYearPage]
  );

  useEffect(() => {
    document.addEventListener('click', handleSummaryLinkClick);
    return () => {
      document.removeEventListener('click', handleSummaryLinkClick);
    };
  }, [handleSummaryLinkClick]);

  useEffect(() => {
    if (isPCoreReady) {
      PCore?.getPubSubUtils()?.subscribe(
        'CUSTOM_EVENT_BACK',
        () => {
          closeContainer();
          switch (caseTypeClicked) {
            case 'addEmployee':
              displayAddEmpStartPage();
              break;
            case 'updateEmployee':
              displayUpdateEmpStartPage();
              break;
            case 'addPension':
              displayAddPensionStartPage();
              break;
            case 'updatePension':
              displayUpdatePensionStartPage();
              break;
            default:
              break;
          }
        },
        'CUSTOM_EVENT_BACK'
      );
      return function cleanup() {
        PCore.getPubSubUtils().unsubscribe('CUSTOM_EVENT_BACK');
      };
    }
  }, [isPCoreReady, caseTypeClicked]);

  useEffect(() => {
    if (isPCoreReady) {
      PCore.getPubSubUtils().subscribe(
        'languageToggleTriggered',
        () => {
          getShutteredService();
        },
        'summarypageLanguageChange'
      );
      return () => {
        PCore.getPubSubUtils().unsubscribe('languageToggleTriggered', 'summarypageLanguageChange');
      };
    }
  }, [currentLang]);

  useEffect(() => {
    if (showResolutionPage) {
      setSummaryPageContent(true);
      getSdkConfig().then(config => {
        PCore.getRestClient()
          .invokeCustomRestApi(
            `${config.serverConfig.infinityRestServerUrl}/app/${config.serverConfig.appAlias}/api/application/v2/cases/${caseId}?pageName=SubmissionSummary`,
            {
              method: 'GET',
              body: '',
              headers: '',
              withoutDefaultHeaders: false
            },
            ''
          )
          .then(response => {
            PCore.getPubSubUtils().unsubscribe(
              'languageToggleTriggered',
              'summarypageLanguageChange'
            );

            const summaryData: any[] =
              response.data.data.caseInfo.content.ScreenContent.LocalisedContent;

            setSummaryPageContent(summaryData.find(data => data.Language === currentLang));

            PCore.getPubSubUtils().subscribe(
              'languageToggleTriggered',
              ({ language }) => {
                setSummaryPageContent(
                  summaryData.find(data => data.Language === language.toUpperCase())
                );
              },
              'summarypageLanguageChange'
            );
          })
          .catch(() => {
            return false;
          });
      });
    }
  }, [showResolutionPage, shutterServicePage, serviceNotAvailable]);

  document.addEventListener('SdkConstellationReady', () => {
    PCore.onPCoreReady(() => {
      setIsPCoreReady(true);
    });
    settingTimer();
  });

  useEffect(() => {
    (async () => {
      if (isPCoreReady) {
        try {
          setIsLoading(true);
          await Promise.all([
            addDeviceId(),
            fetchAnnualCodingData(),
            fetchPAYELandingData(),
            fetchDynamicValueData()
          ]);
          const sdkConfig = await getSdkConfig();
          if (sdkConfig.timeoutConfig.secondsTilLogout) {
            milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
          }

          // Subscribe to any store change to reset timeout counter
          PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, false));
          initTimeout(setShowTimeoutModal);
        } catch (error) {
          return false;
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [isPCoreReady]);

  const handleViewAllDetailsClick = (detail: DetailsTypes) => {
    setDetails(detail);
    setCurrentPage('ViewAllDetailsPage');
  };

  const handleUnderstandYourTaxCodeClick = (
    understandYourTax: DetailsTypes,
    taxCode: string,
    fromPage: string
  ) => {
    setUnderstandYourTaxDetails(understandYourTax);
    setPreviousPage(fromPage);
    if (taxCode === 'defaulttaxcode') {
      setCurrentPage('UnderstandYourTaxPage');
    } else {
      setCurrentPage('UnderstandYourTaxForSpecialPage');
    }
  };

  const handleMoreInformationClick = (fromPage: string) => {
    setCurrentPage(fromPage);
  };

  const handleViewDetailsClick = (timeline: TimeLineEvent, event: string) => {
    setTimelineDetails(timeline);
    setEventType(event);
    setCurrentPage('ViewTimelineDetailsPage');
  };

  const handleDetailExplainerLinkClick = (ComponentName: string) => {
    setExplainerComponentName(ComponentName);
    setCurrentPage('DetailExplainerPage');
  };

  const renderContent = () => {
    return (
      <>
        <div id='pega-part-of-page' aria-hidden={showResolutionPage}>
          <div id='pega-root'></div>
        </div>
        <AnalyticsConfigProvider apiCallback={publishAnalyticsEventToPega}>
          <ShutteredServiceWrapper
            serviceIsShuttered={serviceIsShuttered || shutterServicePage || serviceShuttered}
          >
            <LoadingWrapper
              pageIsLoading={isLoading || isShutteredServiceLoading}
              spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
            >
              <>
                {showLandingPage && customerDetails === null && <ErrorMessage />}
                {showAddEmpStartPage &&
                  !showUpdateEmpStartPage &&
                  !showAddPensionStartPage &&
                  !showInterruptionPage &&
                  !showUpdatePensionStartPage && (
                    <AddEmpStartPage
                      onStart={() => startNow('addEmployee')}
                      onBack={redirectCurrentYearPage}
                      dynamicEmpPayPeriod={dynamicIABDVals?.MissingEmploymentPayPeriod}
                      pageName='Add a missing employment'
                    />
                  )}
                {showUpdateEmpStartPage &&
                  !showAddEmpStartPage &&
                  !showInterruptionPage &&
                  !showAddPensionStartPage &&
                  !showUpdatePensionStartPage && (
                    <UpdateEmpStartPage
                      onStart={() => startNow('updateEmployee')}
                      onBack={redirectCurrentYearPage}
                      EmploymentPeriod={dynamicIABDVals?.EmploymentEndLeavingPeriod}
                    />
                  )}
                {showAddPensionStartPage &&
                  !showAddEmpStartPage &&
                  !showUpdateEmpStartPage &&
                  !showInterruptionPage &&
                  !showUpdatePensionStartPage && (
                    <AddPensionStartPage
                      onStart={() => startNow('addPension')}
                      onBack={redirectCurrentYearPage}
                      dynamicPenPayPeriod={dynamicIABDVals?.PensionPayPeriod}
                      pageName='Add a missing pension'
                    />
                  )}
                {showUpdatePensionStartPage &&
                  !showAddPensionStartPage &&
                  !showAddEmpStartPage &&
                  !showInterruptionPage &&
                  !showUpdateEmpStartPage && (
                    <UpdatePensionStartPage
                      onStart={() => startNow('updatePension')}
                      onBack={redirectCurrentYearPage}
                      pensionPeriod={dynamicIABDVals?.PensionEndLeavingPeriod}
                    />
                  )}

                {showInterruptionPage &&
                  !showUpdatePensionStartPage &&
                  !showAddPensionStartPage &&
                  !showAddEmpStartPage &&
                  !showUpdateEmpStartPage && (
                    <InterruptionPage
                      pageName='Estimated pay-Interrupt'
                      employmentSequenceNumber={employmentSequenceNumber}
                      handleNavClick={navClickHandler}
                      onBack={goBack}
                    />
                  )}

                {summaryPageContent && showResolutionPage && (
                  <SummaryPage
                    ref={ref}
                    summaryContent={summaryPageContent?.Content}
                    summaryTitle={summaryPageContent?.Title}
                    summaryBanner={summaryPageContent?.Banner}
                    backlinkProps={{}}
                  />
                )}
                {currentPage === 'LandingPage' && !showResolutionPage && customerDetails && (
                  <LandingPage
                    pageName='Pay As You Earn (PAYE)'
                    annualCodingData={annualCodingData}
                    redirectCurrentYearPage={redirectCurrentYearPage}
                    handleLinkClick={handleLinkClick}
                    userFullName={customerDetails?.pyFullName}
                    redirectAnnualCodingTemplatePage={redirectAnnualCodingTemplatePage}
                  />
                )}
                {currentPage === 'AnnualCodingTemplate' && (
                  <AnnualCodingTemplate
                    onBack={redirectLandingPage}
                    annualCodingTemplateValue={annualCodingTemplateValue}
                    pageName={annualCodingPageName}
                    taxYearStartDate={taxYearStartDate}
                    handleLinkClick={handleLinkClick}
                  />
                )}
                {currentPage === 'PayeCurrentYearPage' && (
                  <PayeCurrentYear
                    pageName='Your Pay As You Earn summary'
                    userFullName={customerDetails?.pyFullName}
                    beginClaim={beginClaim}
                    beginIntrruptionPage={beginIntrruptionPage}
                    beginUpdateClaim={beginUpdateClaim}
                    beginAddPensionClaim={beginAddPensionClaim}
                    beginUpdatePensionClaim={beginUpdatePensionClaim}
                    employmentTaxData={employmentTaxData}
                    dynamicDisabledIABDDetails={dynamicDisabledIABDDetails}
                    handleLinkClick={handleLinkClick}
                    redirectLandingPage={redirectLandingPage}
                    redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
                    redirecLatestEventPage={redirecLatestEventPage}
                    handleViewAllDetailsClick={handleViewAllDetailsClick}
                    handleViewDetailsClick={handleViewDetailsClick}
                    handleUnderstandYourTaxCodeClick={handleUnderstandYourTaxCodeClick}
                    setEmpTaxData={setEmploymentTaxData}
                  />
                )}
                {currentPage === 'LatestEventsPage' && (
                  <LatestEventsPage
                    pageName='View All Activity'
                    employmentTaxData={employmentTaxData}
                    goBack={redirectCurrentYearPage}
                    handleViewDetailsClick={handleViewDetailsClick}
                  />
                )}

                {currentPage === 'ViewAllDetailsPage' && (
                  <ViewAllDetails
                    pageName='View All Details'
                    details={details}
                    redirectCurrentYearPage={redirectCurrentYearPage}
                    beginIntrruptionPage={beginIntrruptionPage}
                    handleLinkClick={handleLinkClick}
                    handleUnderstandYourTaxCodeClick={handleUnderstandYourTaxCodeClick}
                  />
                )}

                {currentPage === 'AllIABDLandingPage' && (
                  <AllIABDLanding
                    pageName='View and update the information'
                    handleLinkClick={handleLinkClick}
                    comingFromPage={comingFromPage}
                    redirectToUnderstandYourTaxPage={redirectToUnderstandYourTaxPage}
                    redirectCurrentYearPage={redirectCurrentYearPage}
                    redirectToViewTimelineDetailsPage={redirectToViewTimelineDetailsPage}
                    handleMoreInformationClick={handleMoreInformationClick}
                  />
                )}

                {currentPage === 'ViewTimelineDetailsPage' &&
                  (timelineDetails?.pyTemplateDataField === 'P2TAXCODE' ? ( // P2 template
                    <ViewTimelineDetailsP2
                      redirectCurrentYearPage={redirectCurrentYearPage}
                      timelineDetails={timelineDetails}
                      eventType={eventType}
                    />
                  ) : (
                    <ViewTimelineDetails
                      pageName={
                        timelineDetails?.pyTemplateDataField === 'TAXCODE'
                          ? 'View Details for Updated Tax Code'
                          : `${(timelineDetails.Content as TimeLineContentObj[])[0].pyKeyString} event details`
                      }
                      timelineDetails={timelineDetails}
                      eventType={eventType}
                      redirectCurrentYearPage={redirectCurrentYearPage}
                      redirecLatestEventPage={redirecLatestEventPage}
                      handleLinkClick={handleLinkClick}
                      redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
                      handleDetailExplainerLinkClick={handleDetailExplainerLinkClick}
                      redirectToDeductionExplainerpage={redirectToDeductionExplainerpage}
                    />
                  ))}

                {currentPage === 'DetailExplainerPage' && (
                  <DetailExplainer
                    componentName={explainerComponentName}
                    redirectToViewTimelineDetailsPage={redirectToViewTimelineDetailsPage}
                  />
                )}
                {currentPage === 'UnderstandYourTaxPage' && (
                  <UnderstandYourTaxCodePage
                    pageName='Understand your tax code'
                    understandYourTaxDetails={understandYourTaxDetails}
                    handleLinkClick={handleLinkClick}
                    redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
                    onBack={goBack}
                    redirectToDeductionExplainerpage={redirectToDeductionExplainerpage}
                  />
                )}
                {currentPage === 'winterFuelPaymentIABDPage' && (
                  <WinterFuelExplainerPage
                    pageName='More information Winter Fuel Payment'
                    redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
                    incomeThresholdForWinterFuelPayment={
                      dynamicIABDVals.IncomeThresholdForWinterFuelPayment
                    }
                  />
                )}
                {currentPage === 'UnderstandYourTaxForSpecialPage' && (
                  <UnderstandYourTaxForSpecialPage
                    pageName='Understand your tax code'
                    understandYourTaxDetails={understandYourTaxDetails}
                    handleLinkClick={handleLinkClick}
                    onBack={goBack}
                  />
                )}
                {currentPage === 'untaxedsavingsinterest' && (
                  <UntaxedSavingsInterestPage
                    pageName='What untaxed savings interest means'
                    redirectToUnderstandYourTaxPage={redirectToUnderstandYourTaxPage}
                    redirectToViewTimelineDetailsPage={redirectToViewTimelineDetailsPage}
                    comingFromPage={comingFromPage}
                  />
                )}
                {currentPage === 'winterfuelpaymentcharge' && (
                  <TaxCodeExplainerWFP
                    pageName='Winter Fuel Payment Charge'
                    taxCodeSourceAmount={sourceAmount}
                    redirectToUnderstandYourTaxPage={redirectToUnderstandYourTaxPage}
                    redirectToViewTimelineDetailsPage={redirectToViewTimelineDetailsPage}
                    incomeThreshold={dynamicIABDVals?.IncomeThresholdForWinterFuelPayment}
                    comingFromPage={comingFromPage}
                    nextTaxStartYear={dynamicIABDVals?.NextTaxStartYear}
                  />
                )}
              </>
            </LoadingWrapper>
          </ShutteredServiceWrapper>
        </AnalyticsConfigProvider>
      </>
    );
  };
  return (
    <>
      <TimeoutPopup
        signoutHandler={() => triggerLogout(true)}
        show={showTimeoutModal}
        staySignedinHandler={() => staySignedIn(setShowTimeoutModal, true)}
        milisecondsTilSignout={milisecondsTilSignout}
        isAuthorised
      />
      <AppHeader />
      {isMobileView ? (
        <NavBarMobile
          handleSignout={() => triggerLogout(false)}
          milisecondsTilSignout={milisecondsTilSignout}
          handleLinkClick={handleLinkClick}
          hasLanguageToggle
        />
      ) : (
        <NavBar
          handleSignout={() => triggerLogout(false)}
          milisecondsTilSignout={milisecondsTilSignout}
          handleLinkClick={handleLinkClick}
          hasLanguageToggle
        />
      )}

      <div className='govuk-width-container'>
        {serviceNotAvailable ? (
          <ServiceNotAvailable returnToPortalPage={returnToPortalPage} />
        ) : (
          <>
            {accessGroup === undefined ? (
              renderContent()
            ) : (
              <>
                <div id='pega-part-of-page'>
                  <div id='pega-root'></div>
                </div>
                <ShutteredServiceWrapper
                  serviceIsShuttered={serviceIsShuttered || shutterServicePage || serviceShuttered}
                >
                  <LoadingWrapper
                    pageIsLoading={isLoading || isShutteredServiceLoading}
                    spinnerProps={{ bottomText: t('LOADING'), size: '30px', label: t('LOADING') }}
                  >
                    <>
                      {accessGroup === 'PAYE_Dev:UnauthCitizen' ||
                      accessGroup === 'PAYE:UnauthCitizen' ? (
                        <DelayedErrorMessage accessGroupMsg showInstantly />
                      ) : null}
                    </>
                  </LoadingWrapper>
                </ShutteredServiceWrapper>
              </>
            )}
          </>
        )}
      </div>

      <AppFooter />
    </>
  );
}
