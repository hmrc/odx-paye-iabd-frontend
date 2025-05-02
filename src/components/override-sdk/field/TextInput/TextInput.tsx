import { useContext, useEffect, useState } from 'react';
import GDSTextInput from '../../../BaseComponents/TextInput/TextInput';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import ReadOnlyDisplay from '../../../BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import GDSCheckAnswers from '../../../BaseComponents/CheckAnswer/index';
import { ReadOnlyDefaultFormContext, FieldGroupContext } from '../../../helpers/HMRCAppContext';
import { checkStatus } from '../../../helpers/utils';

export default function TextInput(props) {
  const {
    getPConnect,
    value = '',
    placeholder,
    validatemessage,
    onChange,
    helperText,
    inputProps,
    fieldMetadata,
    readOnly,
    disabled,
    name,
    testId,
    configAlternateDesignSystem
  } = props;

  const { hasBeenWrapped } = useContext(ReadOnlyDefaultFormContext);
  const { isFieldSetPresent } = useContext(FieldGroupContext);
  registerNonEditableField(!!disabled);

  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  // @ts-ignore
  const [errorMessage, setErrorMessage] = useState(localizedVal(validatemessage));

  useEffect(() => {
    // @ts-ignore
    setErrorMessage(localizedVal(validatemessage));
  }, [validatemessage]);
  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();

  const propName = thePConn.getStateProps().value;
  const fieldId = propName?.split('.')?.pop();
  const formattedPropertyName = name || fieldId;

  const handleChange = evt => {
    if (name === 'content-pyPostalCode') {
      const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
      handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
    }
  };

  let label = props.label;
  const { isOnlyField, overrideLabel } = useIsOnlyField(props.displayOrder);
  if (isOnlyField && !readOnly) label = overrideLabel.trim() ? overrideLabel : label;

  const maxLength = fieldMetadata?.maxLength;
  const inprogressStatus = checkStatus();

  if (
    hasBeenWrapped &&
    configAlternateDesignSystem?.ShowChangeLink &&
    inprogressStatus === 'Open'
  ) {
    return (
      <GDSCheckAnswers
        label={props.label}
        value={value}
        name={name}
        stepId={configAlternateDesignSystem.stepId}
        hiddenText={configAlternateDesignSystem.hiddenText}
        getPConnect={getPConnect}
        required={false}
        disabled={false}
        validatemessage=''
        onChange={undefined}
        readOnly={false}
        testId=''
        helperText={helperText}
        hideLabel={false}
        placeholder={placeholder}
      />
    );
  }

  if (readOnly) {
    return <ReadOnlyDisplay label={label} value={value} name={name} />;
  }

  const extraProps = {
    testProps: { 'data-test-id': testId },
    extraLabelClasses: !isFieldSetPresent ? 'govuk-label--m' : ''
  };

  const extraInputProps: { onChange: any; value: any; type?: string; autoComplete?: string } = {
    onChange,
    value
  };

  if (configAlternateDesignSystem?.type || inputProps?.type) {
    extraInputProps.type = configAlternateDesignSystem?.type || inputProps?.type;
  } else {
    extraInputProps.type = 'text';
  }

  // TODO Investigate more robust way to check if we should display as password
  if (fieldMetadata?.displayAs === 'pxPassword') {
    extraInputProps.type = 'password';
  }

  if (configAlternateDesignSystem?.autocomplete || inputProps?.autoComplete) {
    extraInputProps.autoComplete =
      configAlternateDesignSystem?.autocomplete || inputProps?.autoComplete;
  } else {
    extraInputProps.autoComplete = 'off';
  }

  return (
    <GDSTextInput
      inputProps={{
        ...inputProps,
        ...extraInputProps
      }}
      hintText={helperText}
      errorText={errorMessage}
      label={label}
      labelIsHeading={isOnlyField}
      name={formattedPropertyName}
      maxLength={maxLength}
      fieldId={fieldId}
      onBlur={e => handleChange(e)}
      {...extraProps}
      disabled={disabled || false}
    />
  );
}
