import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { getServiceShutteredStatus, scrollToTop, shouldRemoveFormTagForReadOnly } from '../../../helpers/utils';
import ErrorSummary from '../../../BaseComponents/ErrorSummary/ErrorSummary';
import { DateErrorFormatter, DateErrorTargetFields } from '../../../helpers/formatters/DateErrorFormatter';
import setPageTitle from '../../../helpers/setPageTitleHelpers';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import MainWrapper from '../../../BaseComponents/MainWrapper';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import { ErrorMsgContext } from '../../../helpers/HMRCAppContext';
import useServiceShuttered from '../../../helpers/hooks/useServiceShuttered';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import { useTranslation } from 'react-i18next';

export interface ErrorMessageDetails {
  message: string;
  fieldId: string;
  pageRef: string;
  clearMessageProperty: string;
}

interface OrderedErrorMessage {
  message: ErrorMessageDetails;
  displayOrder: string;
}

declare const PCore: any;
export default function Assignment(props) {
  const { getPConnect, children, itemKey, isCreateStage, containerItemName } = props;
  const childrenRef = useRef();
  const thePConn = getPConnect();
  const [actionButtons, setActionButtons] = useState<any>({});
  const { t } = useTranslation();
  const serviceShuttered = useServiceShuttered();
  const { setAssignmentPConnect }: any = useContext(StoreContext);

  const AssignmentCard = SdkComponentMap.getLocalComponentMap().AssignmentCard
    ? SdkComponentMap.getLocalComponentMap().AssignmentCard
    : SdkComponentMap.getPegaProvidedComponentMap().AssignmentCard;

  const actionsAPI = thePConn.getActionsApi();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;

  const localeCategory = 'Assignment';
  const localeReference = `${getPConnect().getCaseInfo().getClassName()}!CASE!${getPConnect().getCaseInfo().getName()}`.toUpperCase();

  // store off bound functions to above pointers
  const finishAssignment = actionsAPI.finishAssignment.bind(actionsAPI);
  const navigateToStep = actionsAPI.navigateToStep.bind(actionsAPI);
  const cancelAssignment = actionsAPI.cancelAssignment.bind(actionsAPI);
  const saveAssignment = actionsAPI.saveAssignment?.bind(actionsAPI);
  const cancelCreateStageAssignment = actionsAPI.cancelCreateStageAssignment.bind(actionsAPI);

  const isOnlyFieldDetails = useIsOnlyField(null, children); // .isOnlyField;
  const [errorMessages, setErrorMessages] = useState<OrderedErrorMessage[]>([]);
  const [serviceShutteredStatus, setServiceShutteredStatus] = useState(serviceShuttered);

  const context = getPConnect().getContextName();

  // Register/Deregister this Pconnect Object to AssignmentPConn context value, for use in Portal scope
  useEffect(() => {
    setAssignmentPConnect(getPConnect());
    return () => setAssignmentPConnect(null);
  }, [containerItemName]);

  useEffect(() => {
    setServiceShutteredStatus(serviceShuttered);
  }, [serviceShuttered]);

  const callLocalActionSilently = async () => {
    const { invokeRestApi, invokeCustomRestApi, getCancelTokenSource, isRequestCanceled } = PCore.getRestClient();
    const cancelTokenSource = getCancelTokenSource();
    const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
    const LOCAL_ACTION_NAME = lang === 'en' ? 'SwitchLanguageToEnglish' : 'SwitchLanguageToWelsh';

    const caseID = thePConn.getCaseInfo()?.getKey();
    const actionContext = thePConn.getContextName();

    try {
      const response = await invokeRestApi('caseWideActions', {
        queryPayload: {
          caseID,
          actionID: LOCAL_ACTION_NAME
        },
        // passing cancel token so that we can cancel the request using cancelTokenSource
        cancelTokenSource: cancelTokenSource.token
      });
      // get etag
      let updatedEtag = response.headers.etag;

      const response2 = await invokeCustomRestApi(
        `/api/application/v2/cases/${caseID}/actions/${LOCAL_ACTION_NAME}?excludeAdditionalActions=true&viewType=form`,
        {
          method: 'PATCH',
          headers: {
            'if-match': updatedEtag
          }
        },
        actionContext
      );
      // get etag
      updatedEtag = response2.headers.etag;

      // update the etag in the case context
      PCore.getContainerUtils().updateCaseContextEtag(actionContext, updatedEtag);
    } catch (error) {
      // handle error
      if (isRequestCanceled(error)) {
        cancelTokenSource.cancel();
      }
    }
  };

  async function refreshView() {
    // this will refresh the case view and load all required translations
    try {
      await thePConn.getActionsApi().refreshCaseView(thePConn.getCaseInfo()?.getKey(), '', thePConn.getPageReference(), {
        autoDetectRefresh: true
      });
      await callLocalActionSilently();
      // emit this event to reload the react component forcefully
      PCore.getPubSubUtils().publish('forceRefreshRootComponent');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in refreshView: ', error);
    }
  }

  useEffect(() => {
    PCore.getPubSubUtils().subscribe('languageToggleTriggered', refreshView, 'languageToggleTriggered');
    PCore.getPubSubUtils().subscribe('callLocalActionSilently', callLocalActionSilently, 'callLocalActionSilently');

    return () => {
      PCore.getPubSubUtils().unsubscribe('languageToggleTriggered', 'languageToggleTriggered');
      PCore.getPubSubUtils().unsubscribe('callLocalActionSilently', 'callLocalActionSilently');
    };
  }, [getPConnect]);

  useEffect(() => {
    const updateErrorTimeOut = setTimeout(() => {
      setPageTitle(errorMessages.length > 0);
    }, 500);
    return () => {
      clearTimeout(updateErrorTimeOut);
    };
  }, [errorMessages]);

  let containerName;

  const caseInfo = thePConn.getDataObject().caseInfo;

  if (caseInfo?.assignments?.length > 0) {
    containerName = caseInfo.assignments[0].name;

    // const firstActionId = caseInfo.assignments[0]?.actions[0]?.ID.toUpperCase();
    // headerLocaleLocation = `${caseInfo.caseTypeID.toUpperCase()}!VIEW!${firstActionId}`;
  }

  useEffect(() => {
    if (children && children.length > 0) {
      const oWorkItem = children[0].props.getPConnect();
      const oWorkData = oWorkItem.getDataObject();
      const oData = thePConn.getDataObject();

      if (oWorkData?.caseInfo && oWorkData.caseInfo.assignments !== null) {
        const oCaseInfo = oData.caseInfo;

        if (oCaseInfo && oCaseInfo.actionButtons) {
          setActionButtons(oCaseInfo.actionButtons);
        }
      }
    }
  }, [children]);

  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  function checkErrorMessages() {
    const errorStateProps = [];

    const formFields = PCore.getContextTreeManager().getFieldsList(context);
    const processName = PCore.getStore().getState().data[context].caseInfo.assignments[0].processName;

    for (const [key, value] of formFields) {
      const { propertyName, pageReference, componentName: type, label, index: displayOrder } = value.props;

      const errorMessagesList = PCore.getMessageManager().getMessages({
        property: propertyName,
        pageReference,
        context,
        type: 'error'
      });

      let validateMessage = '';

      if (errorMessagesList.length > 0) {
        errorMessagesList.forEach(error => {
          validateMessage = validateMessage + (validateMessage.length > 0 ? '. ' : '') + localizedVal(error.message, 'Messages');
        });
      }

      // eslint-disable-next-line no-continue
      if (!validateMessage) continue;

      const formattedPropertyName = propertyName.includes('.') ? propertyName.split('.').pop() : null;
      let fieldId = formattedPropertyName;

      if (type === 'Date') {
        const DateErrorTargetFieldId = DateErrorTargetFields(validateMessage);
        fieldId = `${formattedPropertyName}-day`;
        if (DateErrorTargetFieldId.includes('month')) {
          fieldId = `${formattedPropertyName}-month`;
        } else if (DateErrorTargetFieldId.includes('year')) {
          fieldId = `${formattedPropertyName}-year`;
        }
        validateMessage = DateErrorFormatter(validateMessage, processName);
      } else if (type === 'Checkbox') {
        const formattedPageReference = pageReference.split('.').pop();
        fieldId = `${formattedPageReference}-${fieldId}`;
      }

      errorStateProps.push({
        message: {
          message: localizedVal(validateMessage),
          pageReference,
          fieldId,
          propertyName
        },
        displayOrder
      });
    }

    setErrorMessages([...errorStateProps]);
  }

  function clearErrors() {
    errorMessages.forEach(error =>
      PCore.getMessageManager().clearMessages({
        property: error.message.clearMessageProperty,
        pageReference: error.message.pageRef,
        category: 'Property',
        context,
        type: 'error'
      })
    );
  }

  // Fetches and filters any validatemessages on fields on the page, ordering them correctly based on the display order set in DefaultForm.
  // Also adds the relevant fieldID for each field to allow error summary links to move focus when clicked. This process uses the
  // name prop on the input field in most cases, however where there is a deviation (for example, in Date component, where the first field
  // has -day appended), a fieldId stateprop will be defined and this will be used instead.
  useEffect(() => {
    checkErrorMessages();
  }, [children]);

  useEffect(() => {
    if (errorMessages.length === 0) {
      const bodyfocus: any = document.getElementsByClassName('govuk-template__body')[0];
      bodyfocus.focus();
    }
  }, [children]);

  function showErrorSummary() {
    setErrorMessages([]);
    checkErrorMessages();
  }

  function onSaveActionSuccess(data) {
    actionsAPI.cancelAssignment(itemKey).then(() => {
      PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED, data);
    });
  }

  async function buttonPress(sAction: string, sButtonType: string) {
    if (sButtonType === 'secondary') {
      switch (sAction) {
        case 'navigateToStep': {
          const navigatePromise = navigateToStep('previous', itemKey);

          clearErrors();

          navigatePromise
            .then(() => {
              scrollToTop();
            })
            .catch(() => {
              scrollToTop();
              showErrorSummary();
            });

          break;
        }

        case 'saveAssignment': {
          const caseID = thePConn.getCaseInfo().getKey();
          const assignmentID = thePConn.getCaseInfo().getAssignmentID();
          const savePromise = saveAssignment(itemKey);

          savePromise
            .then(() => {
              const caseType = thePConn.getCaseInfo().c11nEnv.getValue(PCore.getConstants().CASE_INFO.CASE_TYPE_ID);
              onSaveActionSuccess({ caseType, caseID, assignmentID });
              scrollToTop();
            })
            .catch(() => {
              scrollToTop();
              showErrorSummary();
            });

          break;
        }

        case 'cancelAssignment': {
          // check if create stage (modal)
          const { PUB_SUB_EVENTS } = PCore.getConstants();
          const { publish } = PCore.getPubSubUtils();
          if (isCreateStage) {
            const cancelPromise = cancelCreateStageAssignment(itemKey);

            cancelPromise
              .then(data => {
                publish(PUB_SUB_EVENTS.EVENT_CANCEL, data);
                scrollToTop();
              })
              .catch(() => {
                scrollToTop();
                showErrorSummary();
              });
          } else {
            const cancelPromise = cancelAssignment(itemKey);

            cancelPromise
              .then(data => {
                publish(PUB_SUB_EVENTS.EVENT_CANCEL, data);
                scrollToTop();
              })
              .catch(() => {
                scrollToTop();
                showErrorSummary();
              });
          }
          break;
        }

        default:
          break;
      }
    } else if (sButtonType === 'primary') {
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (sAction) {
        case 'finishAssignment': {
          const status = await getServiceShutteredStatus();
          if (status) {
            setServiceShutteredStatus(status);
          } else {
            const finishPromise = finishAssignment(itemKey);

            finishPromise
              .then(() => {
                scrollToTop();
                PCore.getPubSubUtils().publish('CustomAssignmentFinished');
              })
              .catch(() => {
                scrollToTop();
                showErrorSummary();
                PCore.getPubSubUtils().publish('CustomAssignmentFinishedError');
              });
          }
          break;
        }

        default:
          break;
      }
    }
  }

  function handleBackLinkforInvalidDate() {
    const currentChildren = childrenRef.current;
    if (currentChildren && (currentChildren as React.ReactElement[])[0]) {
      const childPconnect = (currentChildren as React.ReactElement[])[0]?.props?.getPConnect();
      const dateField = PCore.getFormUtils()
        .getEditableFields(childPconnect.getContextName())
        .filter(field => field.type.toLowerCase() === 'date');
      if (dateField) {
        dateField?.forEach(field => {
          const childPagRef = childPconnect.getPageReference();
          const pageRef = thePConn.getPageReference() === childPagRef ? thePConn.getPageReference() : childPagRef;
          const storedRefName = field.name?.replace(pageRef, '');
          const storedDateValue = childPconnect.getValue(`.${storedRefName}`);
          if (!dayjs(storedDateValue, 'YYYY-MM-DD', true).isValid()) {
            childPconnect.setValue(`.${storedRefName}`, '');
          }
        });
      }
    }
  }

  useEffect(() => {
    PCore.getPubSubUtils().subscribe(
      'CustomBackButton',
      () => {
        handleBackLinkforInvalidDate();
      },
      'CustomBackButton'
    );

    return function cleanup() {
      PCore.getPubSubUtils().unsubscribe('CustomBackButton');
    };
  }, []);

  function renderAssignmentCard() {
    return (
      <ErrorMsgContext.Provider
        value={{
          errorMsgs: errorMessages
        }}
      >
        <AssignmentCard
          getPConnect={getPConnect}
          itemKey={itemKey}
          actionButtons={actionButtons}
          onButtonPress={buttonPress}
          errorMsgs={errorMessages}
        >
          {children}
        </AssignmentCard>
      </ErrorMsgContext.Provider>
    );
  }

  const shouldRemoveFormTag = shouldRemoveFormTagForReadOnly(containerName);

  const pageID = thePConn.getCaseInfo().c11nEnv._stateProps.assignmentNames?.[0];

  if (pageID === 'SelectEmployment' || pageID === 'Select Provider') {
    const existingBackLink = document.getElementById('dynamic-back-link');
    if (existingBackLink) {
      existingBackLink.remove();
    }
    const existingOriginalBackLink = document.getElementsByClassName('govuk-back-link');
    if (existingOriginalBackLink.length > 0) {
      Array.from(existingOriginalBackLink).forEach(backLink => backLink.remove());
    }
  }

  const caseID = caseInfo.caseTypeID;

  const serviceNameMap = {
    'HMRC-PAYE-Work-IABD-MissingEmp': 'ADD_A_MISSING_EMPLOYER',
    'HMRC-PAYE-Work-IABD-UpdateEmpLeavingDate': 'ADD_EMP_END_DATE',
    'HMRC-PAYE-Work-IABD-AddPension': 'ADD_A_MISSING_PENSION',
    'HMRC-PAYE-Work-IABD-RemovePension': 'ADD_PENSION_END_DATE'
  };

  const subServiceName = serviceNameMap[caseID] || '';

  return (
    <>
      {serviceShutteredStatus ? (
        <ShutterServicePage />
      ) : (
        <div id='Assignment'>
          <MainWrapper>
            {errorMessages.length > 0 && (
              <ErrorSummary errors={errorMessages.map(item => localizedVal(item.message, localeCategory, localeReference))} />
            )}
            <h2 className='govuk-caption-l hmrc-caption-l govuk-msn'>{t(`${subServiceName}`)}</h2>

            {(!isOnlyFieldDetails.isOnlyField ||
              containerName?.toLowerCase().includes('check your answer') ||
              containerName?.toLowerCase().includes('declaration')) && (
              <h1 className='govuk-heading-l'>{localizedVal(containerName, 'Assignment', '@BASECLASS!GENERIC!PYGENERICFIELDS')}</h1>
            )}
            {shouldRemoveFormTag ? renderAssignmentCard() : <form>{renderAssignmentCard()}</form>}

            <br />
          </MainWrapper>
        </div>
      )}
    </>
  );
}

Assignment.propTypes = {
  children: PropTypes.node.isRequired,
  getPConnect: PropTypes.func.isRequired,
  itemKey: PropTypes.string,
  isCreateStage: PropTypes.bool
};

Assignment.defaultProps = {
  itemKey: null,
  isCreateStage: false
  // buildName: null
};
