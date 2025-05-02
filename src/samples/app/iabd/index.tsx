// @ts-nocheck - TypeScript type checking to be added soon
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sdkIsLoggedIn, getSdkConfig, logout } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import LogoutPopup from '../../../components/AppComponents/LogoutPopup';
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
import ShutterServicePage from '../../../components/AppComponents/ShutterServicePage';
import DelayedErrorMessage from './ErrorPage/delayedErrorMessage';
import ErrorMessage from './ErrorPage/errorMessage';
import LoadingSpinner from '../../../components/helpers/LoadingSpinner/LoadingSpinner';
import SummaryPage from '../../../components/AppComponents/SummaryPage';
import NavBar from '../../../components/helpers/navbar/navbar';
import NavBarMobile from '../../../components/helpers/navbar/navbarMobile';
import BetaBanner from '../../../components/helpers/navbar/banner';
import { useStartMashup } from '../../../reuseables/PegaSetup';
import ViewAllDetails from './PayeCurrentYear/ViewAllDetails';
import AllIABDLanding from './PayeCurrentYear/AllIABDLanding';
import ViewTimelineDetails from './PayeCurrentYear/ViewTimelineDetails';
import { TimeLineEvent } from '../../../reuseables/Types/TimeLineEvents';
import { addDeviceIdCookie } from '../../../components/helpers/cookie';

/* Time out modal functionality */
let applicationTimeout = null;
let signoutTimeout = null;
// Sets default timeouts (13 mins for warning, 115 seconds for sign out after warning shows)
let milisecondsTilSignout = 115 * 1000;
let milisecondsTilWarning = 780 * 1000;
declare const PCore: any;

// Clears any existing timeouts and starts the timeout for warning, after set time shows the modal and starts signout timer
function initTimeout(setShowTimeoutModal) {
  clearTimeout(applicationTimeout);
  clearTimeout(signoutTimeout);

  applicationTimeout = setTimeout(() => {
    setShowTimeoutModal(true);
    signoutTimeout = setTimeout(() => {
      logout();
    }, milisecondsTilSignout);
  }, milisecondsTilWarning);
}

function staySignedIn(setShowTimeoutModal, refreshSignin = true) {
  if (refreshSignin) {
    PCore.getDataPageUtils().getPageDataAsync('D_PAYEDetails', 'root');
  }
  setShowTimeoutModal(false);
  initTimeout(setShowTimeoutModal);
}

export default function Iabd() {
  const [showAddEmpStartPage, setShowAddEmpStartPage] = useState(false);
  const [showInterruptionPage, setShowInterruptionPage] = useState(false);
  const [showAddPensionStartPage, setShowAddPensionStartPage] = useState(false);
  const [showUpdateEmpStartPage, setShowUpdateEmpStartPage] = useState(false);
  const [showUpdatePensionStartPage, setShowUpdatePensionStartPage] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [authType] = useState('gg');
  const [employmentTaxData, setEmploymentTaxData] = useState(null);
  const [accessGroup, setAccessGroup] = useState<string>('');
  const [showCreatedCase, setSowCreatedCase] = useState(false);
  const [showCurrentYearPage, setShowCurrentYearPage] = useState(false);
  const [showLatestEventsPage, setShowLatestEventsPage] = useState(false);
  const [showAllIABDLandingPage, setShowAllIABDLandingPage] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showDynamicValues, setShowDynamicValues] = useState(false);
  const [currentPage, setCurrentPage] = useState('LandingPage');
  const [previousPage, setPreviousPage] = useState(null);
  const [dynamicEmpPayPeriod, setDynamicEmpPayPeriod] = useState<string>('');
  const [dynamicPenPayPeriod, setDynamicPenPayPeriod] = useState<string>('');
  const [employmentSequenceNumber, setEmploymentSequenceNumber] = useState(null);
  const [navClickHandler, setNavClickHandler] = useState(null);
  const [caseTypeClicked, setCaseTypeClicked] = useState('');
  const [pConn, setPconn] = useState(null);
  const [summaryPageContent, setSummaryPageContent] = useState<any>({
    content: null,
    title: null,
    banner: null
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 770);

  const [details, setDetails] = useState({});
  const [isPCoreReady, setIsPCoreReady] = useState(false);
  const [annualCodingData, setAnnualCodingData] = useState(null);

  const [timelineDetails, setTimelineDetails] = useState({});
  const [eventType, setEventType] = useState('');

  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 770);
  };

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
    resetAppDisplay();
    setShowPega(true);
  }

  function displayUserPortal() {
    resetAppDisplay();
    setShowLandingPage(true);
  }

  function displayAddEmpStartPage() {
    resetAppDisplay();
    setShowAddEmpStartPage(true);
    window.scrollTo(0, 0);
  }

  function displayInterruptionPage() {
    resetAppDisplay();
    setShowInterruptionPage(true);
    window.scrollTo(0, 0);
  }
  function displayUpdateEmpStartPage() {
    resetAppDisplay();
    setShowUpdateEmpStartPage(true);
    window.scrollTo(0, 0);
  }

  function displayAddPensionStartPage() {
    resetAppDisplay();
    setShowAddPensionStartPage(true);
    window.scrollTo(0, 0);
  }

  function displayUpdatePensionStartPage() {
    resetAppDisplay();
    setShowUpdatePensionStartPage(true);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (showResolutionPage) {
      resetAppDisplay();
    }
  }, [showResolutionPage]);

  const { t } = useTranslation();

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

  function createCase(caseType) {
    displayPega();
    setSowCreatedCase(true);

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
    const filteredEmploymentList = filterList(
      employmentTaxData.Customer.TaxSummaryList[0].CurrentEmploymentList
    );
    const filteredPensionList = filterList(
      employmentTaxData.Customer.TaxSummaryList[0].CurrentPensionList
    );

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
      PCore.getMashupApi().createCase(openCaseID, PCore.getConstants().APP.APP, { startingFields });
    }
  }

  function startNow(caseType: string) {
    setCaseTypeClicked(caseType);
    if (pConn) {
      createCase(caseType);
    }
  }

  function beginClaim() {
    staySignedIn(setShowTimeoutModal);
    setCurrentPage('');
    displayAddEmpStartPage();
  }

  function beginIntrruptionPage(TheEmploymentSequenceNumber, handleNavClick, fromPage) {
    staySignedIn(setShowTimeoutModal);
    setCurrentPage('');
    setEmploymentSequenceNumber(TheEmploymentSequenceNumber);
    setNavClickHandler(() => handleNavClick);
    displayInterruptionPage();
    setPreviousPage(fromPage);
  }

  function beginUpdateClaim() {
    staySignedIn(setShowTimeoutModal);
    setCurrentPage('');
    displayUpdateEmpStartPage();
  }

  function beginAddPensionClaim() {
    staySignedIn(setShowTimeoutModal);
    setCurrentPage('');
    displayAddPensionStartPage();
  }

  function beginUpdatePensionClaim() {
    staySignedIn(setShowTimeoutModal);
    setCurrentPage('');
    displayUpdatePensionStartPage();
  }
  function redirectCurrentYearPage() {
    setPreviousPage(currentPage);
    setCurrentPage('PayeCurrentYearPage');
    staySignedIn(setShowTimeoutModal);
    setShowUpdateEmpStartPage(false);
    setShowAddEmpStartPage(false);
    setShowInterruptionPage(false);
    setShowAddPensionStartPage(false);
    setShowUpdatePensionStartPage(false);
    setShowCurrentYearPage(true);
    setShowLandingPage(false);
    window.scrollTo(0, 0);
  }

  function redirectLandingPage() {
    setPreviousPage(currentPage);
    setCurrentPage('LandingPage');
    staySignedIn(setShowTimeoutModal);
    setShowCurrentYearPage(false);
    setShowLandingPage(true);
    window.scrollTo(0, 0);
  }

  function redirecLatestEventPage(fromPage) {
    setPreviousPage(fromPage);
    setCurrentPage('LatestEventsPage');
    staySignedIn(setShowTimeoutModal);
    setShowLatestEventsPage(true);
    setShowCurrentYearPage(false);
    setShowLandingPage(false);
    window.scrollTo(0, 0);
  }

  function redirectToAllIABDLandingPage(fromPage) {
    setPreviousPage(fromPage);
    setCurrentPage('AllIABDLandingPage');
    setShowAllIABDLandingPage(true);
    staySignedIn(setShowTimeoutModal);
    window.scrollTo(0, 0);
  }

  const goBack = () => {
    setShowInterruptionPage(false);
    setCurrentPage(previousPage);
    window.scrollTo(0, 0);
  };

  function returnToPortalPage() {
    staySignedIn(setShowTimeoutModal);
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

  async function fetchDynamicValueData() {
    try {
      const data = await fetchDynamicValue();
      setDynamicEmpPayPeriod(data?.MissingEmploymentPayPeriod);
      setDynamicPenPayPeriod(data?.PensionPayPeriod);
      setShowDynamicValues(data);
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

      setAnnualCodingData(data);
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

  async function fetchDataAndError() {
    try {
      const empData = await PCore.getDataPageUtils().getPageDataAsync('D_PAYEDetails', 'root');

      if (empData) {
        const { pyAccessGroup } = empData;
        const { Customer } = empData;
        const { pyURLContent } = empData;
        const { pyErrors } = empData;
        const ErrorMsg = pyErrors && pyErrors.pyMessages[0];
        setShowLandingPage(true);
        return { Customer, MDTPURLVALUE: pyURLContent, pyErrors: ErrorMsg, pyAccessGroup };
      } else {
        throw new Error('Empty response received');
      }
    } catch (error) {
      console.error('Error fetching employment tax data:', error); // eslint-disable-line no-console
      return { Customer: null, MDTPURLVALUE: null, pyErrors: null };
    }
  }

  async function fetchEmploymentTaxData() {
    try {
      const { Customer, MDTPURLVALUE, pyAccessGroup } = await fetchDataAndError();
      const accessGroupValue = pyAccessGroup;
      const newData =
        Customer !== null && Customer !== undefined
          ? { Customer, MDTPURLVALUE, pyAccessGroup }
          : null;
      setEmploymentTaxData(newData);
      setAccessGroup(accessGroupValue);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      // login();     // Login now handled at TopLevelApp
    } else {
      setShowLandingPage(true);
    }
  }, [showPega]);

  function closeContainer() {
    if (PCore.getContainerUtils().getActiveContainerItemName('app/primary')) {
      PCore.getContainerUtils().closeContainerItem(
        PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
        { skipDirtyCheck: true }
      );
    }
  }
  useEffect(() => {
    if (isPCoreReady) {
      PCore?.getPubSubUtils()?.subscribe(
        'CustomBackButton',
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
        'CustomBackButton'
      );
      return function cleanup() {
        PCore.getPubSubUtils().unsubscribe('CustomBackButton');
      };
    }
  }, [isPCoreReady, caseTypeClicked]);

  useEffect(() => {
    if (showResolutionPage) {
      setSummaryPageContent(true);
      getSdkConfig().then(config => {
        PCore.getRestClient()
          .invokeCustomRestApi(
            `${config.serverConfig.infinityRestServerUrl}/api/application/v2/cases/${caseId}?pageName=SubmissionSummary`,
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

            const currentLang =
              sessionStorage.getItem('rsdk_locale')?.slice(0, 2).toUpperCase() || 'EN';

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
  });

  useEffect(() => {
    if (isPCoreReady) {
      addDeviceId();
      fetchAnnualCodingData();
      fetchEmploymentTaxData();
      fetchDynamicValueData();
      getSdkConfig()
        .then(sdkConfig => {
          if (sdkConfig.timeoutConfig.secondsTilWarning)
            milisecondsTilWarning = sdkConfig.timeoutConfig.secondsTilWarning * 1000;
          if (sdkConfig.timeoutConfig.secondsTilLogout)
            milisecondsTilSignout = sdkConfig.timeoutConfig.secondsTilLogout * 1000;
        })
        .finally(() => {
          // Subscribe to any store change to reset timeout counter
          PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, false));
          initTimeout(setShowTimeoutModal);
        });
    }
  }, [isPCoreReady]);

  function signOut() {
    let authService;
    if (authType && authType === 'gg-paye') {
      authService = 'GovGateway';
    } else if (authType && authType === 'gg-paye-dev') {
      authService = 'GovGateway-Dev';
    } else {
      authService = authType;
    }

    // If the container / case is opened then close the container on signout to prevent locking.
    const activeCase = PCore.getContainerUtils().getActiveContainerItemContext('app/primary_1');
    if (activeCase) {
      PCore.getContainerUtils().closeContainerItem(activeCase, { skipDirtyCheck: true });
    }
    type responseType = { URLResourcePath2: string };
    // Fetch the logout URL from D_AuthServiceLogout and handle the logout process
    PCore.getDataPageUtils()
      .getPageDataAsync('D_AuthServiceLogout', 'root', { AuthService: authService })

      .then((response: unknown) => {
        const logoutUrl = (response as responseType).URLResourcePath2;

        logout().then(() => {
          if (logoutUrl) {
            sessionStorage.clear();
            window.location.href = logoutUrl;
          }
        });
      })
      .catch(error => {
        console.error('Error during signOut:', error); // eslint-disable-line no-console
      });
  }

  function handleSignout() {
    if (showPega) {
      setShowSignoutModal(true);
    } else {
      signOut();
    }
  }

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    staySignedIn(setShowTimeoutModal);
  };

  const handleViewAllDetailsClick = detail => {
    setDetails(detail);
    setCurrentPage('ViewAllDetailsPage');
  };

  const handleViewDetailsClick = (timeline: TimeLineEvent, event: string) => {
    setTimelineDetails(timeline);
    setEventType(event);
    setCurrentPage('ViewTimelineDetailsPage');
  };

  const renderContent = () => {
    if (shutterServicePage) {
      return <ShutterServicePage />;
    } else if (accessGroup === '' || accessGroup === null) {
      return (
        <>
          <div id='pega-part-of-page'>
            <div id='pega-root'></div>
          </div>
          <LoadingSpinner bottomText='Loading' size='30px' />
        </>
      );
    } else if (accessGroup === undefined) {
      return (
        <>
          <div id='pega-part-of-page' aria-hidden={showResolutionPage}>
            {!showResolutionPage && <div id='pega-root'></div>}
          </div>

          {!showLandingPage &&
            !showCurrentYearPage &&
            !showAddEmpStartPage &&
            !showInterruptionPage &&
            !showLatestEventsPage &&
            !showAllIABDLandingPage &&
            !showCreatedCase &&
            !showUpdateEmpStartPage &&
            !showAddPensionStartPage &&
            !showUpdatePensionStartPage && <LoadingSpinner bottomText='Loading' size='30px' />}

          {showLandingPage && (employmentTaxData === null || employmentTaxData === undefined) && (
            <ErrorMessage />
          )}
          {showAddEmpStartPage &&
            !showUpdateEmpStartPage &&
            !showAddPensionStartPage &&
            !showInterruptionPage &&
            !showUpdatePensionStartPage && (
              <AddEmpStartPage
                onStart={() => startNow('addEmployee')}
                onBack={redirectCurrentYearPage}
                dynamicEmpPayPeriod={dynamicEmpPayPeriod}
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
                dynamicEmpPayPeriod={dynamicEmpPayPeriod}
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
                dynamicPenPayPeriod={dynamicPenPayPeriod}
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
                dynamicPenPayPeriod={dynamicPenPayPeriod}
              />
            )}

          {showInterruptionPage &&
            !showUpdatePensionStartPage &&
            !showAddPensionStartPage &&
            !showAddEmpStartPage &&
            !showUpdateEmpStartPage && (
              <InterruptionPage
                employmentSequenceNumber={employmentSequenceNumber}
                handleNavClick={navClickHandler}
                onBack={goBack}
              />
            )}

          {summaryPageContent && showResolutionPage && (
            <SummaryPage
              summaryContent={summaryPageContent?.Content}
              summaryTitle={summaryPageContent?.Title}
              summaryBanner={summaryPageContent?.Banner}
              backlinkProps={{}}
            />
          )}
          {currentPage === 'LandingPage' &&
            currentPage !== 'PayeCurrentYearPage' &&
            currentPage !== 'LatestEventsPage' &&
            employmentTaxData !== null &&
            employmentTaxData !== undefined &&
            !showResolutionPage && (
              <LandingPage
                employmentTaxData={employmentTaxData}
                annualCodingData={annualCodingData}
                redirectCurrentYearPage={redirectCurrentYearPage}
                handleLinkClick={handleLinkClick}
                redirecLatestEventPage={redirecLatestEventPage}
              />
            )}
          {currentPage === 'PayeCurrentYearPage' &&
            currentPage !== 'LandingPage' &&
            currentPage !== 'LatestEventsPage' &&
            employmentTaxData !== null &&
            employmentTaxData !== undefined &&
            !showResolutionPage && (
              <PayeCurrentYear
                beginClaim={beginClaim}
                beginIntrruptionPage={beginIntrruptionPage}
                beginUpdateClaim={beginUpdateClaim}
                beginAddPensionClaim={beginAddPensionClaim}
                beginUpdatePensionClaim={beginUpdatePensionClaim}
                employmentTaxData={employmentTaxData}
                showDynamicValues={showDynamicValues}
                handleLinkClick={handleLinkClick}
                redirectLandingPage={redirectLandingPage}
                redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
                redirecLatestEventPage={redirecLatestEventPage}
                handleViewAllDetailsClick={handleViewAllDetailsClick}
                handleViewDetailsClick={handleViewDetailsClick}
              />
            )}
          {currentPage === 'LatestEventsPage' &&
            currentPage !== 'LandingPage' &&
            currentPage !== 'PayeCurrentYearPage' &&
            employmentTaxData !== null &&
            employmentTaxData !== undefined &&
            !showResolutionPage && (
              <LatestEventsPage
                employmentTaxData={employmentTaxData}
                redirectLandingPage={redirectLandingPage}
                goBack={goBack}
                handleViewDetailsClick={handleViewDetailsClick}
              />
            )}

          {currentPage === 'ViewAllDetailsPage' &&
            currentPage !== 'LandingPage' &&
            currentPage !== 'PayeCurrentYearPage' &&
            details !== null &&
            details !== undefined &&
            !showResolutionPage && (
              <ViewAllDetails
                details={details}
                redirectCurrentYearPage={redirectCurrentYearPage}
                beginIntrruptionPage={beginIntrruptionPage}
                handleLinkClick={handleLinkClick}
              />
            )}

          {currentPage === 'AllIABDLandingPage' &&
            currentPage !== 'LandingPage' &&
            currentPage !== 'PayeCurrentYearPage' &&
            details !== null &&
            details !== undefined &&
            !showResolutionPage && (
              <AllIABDLanding
                redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
                handleLinkClick={handleLinkClick}
                goBack={goBack}
              />
            )}

          {currentPage === 'ViewTimelineDetailsPage' &&
            currentPage !== 'LandingPage' &&
            currentPage !== 'PayeCurrentYearPage' &&
            details !== null &&
            details !== undefined &&
            !showResolutionPage && (
              <ViewTimelineDetails
                timelineDetails={timelineDetails}
                eventType={eventType}
                redirectCurrentYearPage={redirectCurrentYearPage}
                redirecLatestEventPage={redirecLatestEventPage}
                handleNavClick={navClickHandler}
                handleLinkClick={handleLinkClick}
                redirectToAllIABDLandingPage={redirectToAllIABDLandingPage}
              />
            )}
        </>
      );
    } else if (accessGroup === 'PAYE_Dev:UnauthCitizen' || accessGroup === 'PAYE:UnauthCitizen') {
      return (
        <>
          <div id='pega-part-of-page'>
            <div id='pega-root'></div>
          </div>
          <DelayedErrorMessage accessGroupMsg />
        </>
      );
    }
  };

  const appname = t('PAYE_SERVICE');

  return (
    <>
      <TimeoutPopup
        signoutHandler={() => logout()}
        show={showTimeoutModal}
        staySignedinHandler={() => staySignedIn(setShowTimeoutModal)}
        milisecondsTilSignout={milisecondsTilSignout}
        isAuthorised
      />

      <AppHeader appname={appname} isPegaApp={showPega} />
      {isMobileView ? (
        <NavBarMobile
          handleSignout={handleSignout}
          signoutHandler={() => logout()}
          milisecondsTilSignout={milisecondsTilSignout}
          handleLinkClick={handleLinkClick}
          hasLanguageToggle
        />
      ) : (
        <NavBar
          handleSignout={handleSignout}
          signoutHandler={() => logout()}
          milisecondsTilSignout={milisecondsTilSignout}
          handleLinkClick={handleLinkClick}
          hasLanguageToggle
        />
      )}

      <div className='govuk-width-container'>
        {serviceNotAvailable ? (
          <ServiceNotAvailable returnToPortalPage={returnToPortalPage} />
        ) : (
          renderContent()
        )}
      </div>

      <LogoutPopup
        show={showSignoutModal && !showTimeoutModal}
        hideModal={() => setShowSignoutModal(false)}
        handleSignoutModal={signOut}
        handleStaySignIn={handleStaySignIn}
      />

      <BetaBanner />

      <AppFooter />
    </>
  );
}
